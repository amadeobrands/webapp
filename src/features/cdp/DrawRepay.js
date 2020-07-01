// General imports
import React, { useState } from 'react';

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
//            DrawRepay Component
// ------------------------------------------

export function DrawRepay({debtDenom, cdp, price }) {
    let [debtPrice] = useState(1);
  
    const titleText = ["Outstanding", debtDenom.toUpperCase(), "debt"].join(" ")

    let outstandingDebt = 0;
    let canGenerateUsdValue = 0;
    if(cdp && cdp.cdp) {
        outstandingDebt = Number(cdp.cdp.principal.amount)/USDX_CONVERSION_FACTOR;

        const collateralAmount = Number(cdp.cdp.collateral.amount)/BNB_CONVERSION_FACTOR;
        const canGenerateCollateral = Number(collateralAmount / 1.5);
        canGenerateUsdValue = canGenerateCollateral * price;
    }

    // Render
    return (
        <Box display="flex" flexDirection="column" >
            <Box marginTop={1} marginBottom={1}>
                <Typography variant="h5" align={"left"}>
                    {titleText}
                </Typography>
            </Box>
            <Box display="flex" flexDirection="column" border={1} borderRadius={5} borderColor={"#D3D3D3"}>
                <RowButton
                    rowText={["Outstanding", debtDenom.toUpperCase(), "debt"].join(" ")}
                    buttonText={"Pay back"}
                    denom={debtDenom}
                    amount={outstandingDebt}
                    price={debtPrice}
                />
                <Divider/>
                <RowButton
                    rowText="Available to generate"
                    buttonText="Generate"
                    denom={debtDenom}
                    amount={canGenerateUsdValue}
                    price={debtPrice}
                />
            </Box>
        </Box>
    )
}
