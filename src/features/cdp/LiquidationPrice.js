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

// ------------------------------------------
//                Functionality
// ------------------------------------------

var usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

// ------------------------------------------
//         LiquidationPrice Component
// ------------------------------------------
export function LiquidationPrice({cdp, price, penalty }) {
    // Calculate liquidation price and format for display
    let displayLiquidationPrice;
    if(cdp && cdp.cdp) {
        const lockedCollateralAmount = Number(cdp.cdp.collateral.amount)/BNB_CONVERSION_FACTOR;
        const usdxAmount = Number(cdp.cdp.principal.amount)/USDX_CONVERSION_FACTOR;
        const requiredCollateralUsdValue = Number(usdxAmount * 1.5);
        const liquidationPrice = usdFormatter.format(requiredCollateralUsdValue / lockedCollateralAmount);
        displayLiquidationPrice = liquidationPrice.slice(1, liquidationPrice.length);
    }

    // Render
    return (
        <Box display="flex" flexDirection="column" >
            <Box marginTop={1} marginBottom={1}>
                <Typography variant="h5" align={"left"}>
                    Liquidation price
                </Typography>
            </Box>
            <Box display="flex" flexDirection="column" border={1} borderRadius={5} borderColor={"#D3D3D3"}>
                <Box display="flex" flexDirection="row" alignItems={"flex-end"}>
                    <Box marginTop={1} marginLeft={2} marginRight={0.5}>
                        <Typography variant="h5">
                            {displayLiquidationPrice ? displayLiquidationPrice : 0}
                        </Typography> 
                    </Box>            
                    <Box>
                        <Typography variant="subtitle1">
                            USD
                        </Typography>
                    </Box>
                </Box>
                <Row
                    rowText={"Current price information"}
                    value={price}
                    valueTextSuffix={" USD"}
                />
                <Divider/>
                <Row
                    rowText="Liquidation penalty"
                    value={penalty}
                    valueTextSuffix={"%"}
                />
            </Box>
        </Box>
    )
}
