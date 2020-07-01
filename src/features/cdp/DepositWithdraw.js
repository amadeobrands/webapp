// General imports
import React from 'react';

// Third party library imports
import { Box, Divider, Typography } from '@material-ui/core';

// Local imports
import { RowButton } from './RowButton';

// ------------------------------------------
//                 Constants
// ------------------------------------------
const BNB_CONVERSION_FACTOR = 10 ** 8;
const USDX_CONVERSION_FACTOR = 10 ** 6;

// ------------------------------------------
//          DepositWithdraw Component
// ------------------------------------------
export function DepositWithdraw({collateralDenom, cdp, price }) {
    const rowText = collateralDenom.toUpperCase() + " Locked";

    // Get locked collateral amount and withdrawable amount
    let lockedCollateralAmount = 0;
    let withdrawableAmount = 0;
    if(cdp && cdp.cdp) {
        lockedCollateralAmount = Number(cdp.cdp.collateral.amount)/BNB_CONVERSION_FACTOR;

        // Calculate withdrawal amount of collateral without crossing 150% liquidation threshold
        const usdxAmount = Number(cdp.cdp.principal.amount)/USDX_CONVERSION_FACTOR;
        const requiredCollateralUsdValue = Number(usdxAmount * 1.5);
        const collateralUsdValue = Number(cdp.collateral_value.amount)/USDX_CONVERSION_FACTOR;
        const withdrawableAmountUsdValue = Number(collateralUsdValue) - Number(requiredCollateralUsdValue);
        withdrawableAmount = withdrawableAmountUsdValue / price;
    }

    // Render
    return (
        <Box display="flex" flexDirection="column" >
            <Box marginTop={1} marginBottom={1}>
                <Typography variant="h5" align={"left"}>
                    {rowText}
                </Typography>
            </Box>
            <Box display="flex" flexDirection="column" border={1} borderRadius={5} borderColor={"#D3D3D3"}>
                <RowButton
                    rowText={rowText}
                    buttonText={"Deposit"}
                    denom={collateralDenom}
                    amount={lockedCollateralAmount}
                    price={price}
                />
                <Divider/>
                <RowButton
                    rowText="Able to withdraw"
                    buttonText="Withdraw"
                    denom={collateralDenom}
                    amount={withdrawableAmount}
                    price={price}
                />
            </Box>
        </Box>
    )
}
