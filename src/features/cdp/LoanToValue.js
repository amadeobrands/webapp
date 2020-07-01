// General imports
import React from 'react';

// Third party library imports
import { Box, Divider, Typography } from '@material-ui/core';

// Local imports
import { Row } from './Row';

// ------------------------------------------
//                 Constants
// ------------------------------------------
const BNB_CONVERSION_FACTOR = 10 ** 8;
const USDX_CONVERSION_FACTOR = 10 ** 6;

// TODO: Transition from 'CollateralizationRatio' to 'LTV'
// ------------------------------------------
//        LoanToValue Component
// ------------------------------------------
export function LoanToValue({cdp, price, minimumRatio, stabilityFee }) {
    // Calculate loan to value ratio and format for display
    let displaycollateralizationRatio;
    if(cdp && cdp.cdp) {
        const collateralAmount = Number(cdp.cdp.collateral.amount)/BNB_CONVERSION_FACTOR;
        const collateralAmountUsdValue = collateralAmount * Number(price);
        const usdxAmount = Number(cdp.cdp.principal.amount)/USDX_CONVERSION_FACTOR;
        const requiredCollateralUsdValue = Number(usdxAmount * 1.5);
        const loanToValue =  collateralAmountUsdValue / requiredCollateralUsdValue;
        displaycollateralizationRatio = (loanToValue * 100).toFixed(2);
    }

    // Render
    return (
        <Box display="flex" flexDirection="column" >
            <Box marginTop={1} marginBottom={1}>
                <Typography variant="h5" align={"left"}>
                    Collateralization ratio
                </Typography>
            </Box>
            <Box display="flex" flexDirection="column" border={1} borderRadius={5} borderColor={"#D3D3D3"}>
                <Box display="flex" flexDirection="row" alignItems={"flex-end"}>
                    <Box marginTop={1} marginLeft={2} marginRight={0.5}>
                        <Typography variant="h5">
                            {displaycollateralizationRatio ? displaycollateralizationRatio : 0}
                        </Typography> 
                    </Box>            
                    <Box>
                        <Typography variant="subtitle1">
                            %
                        </Typography>
                    </Box>
                </Box>
                <Row
                    rowText={"Minimum ratio"}
                    value={minimumRatio}
                    valueTextSuffix={"%"}
                />
                <Divider/>
                <Row
                    rowText="Stability fee"
                    value={stabilityFee}
                    valueTextSuffix={"%"}
                />
            </Box>
        </Box>
    )
}
