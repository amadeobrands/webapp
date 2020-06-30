// General imports
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Third party library imports
import { Box, Divider } from '@material-ui/core';

// Local imports
import { RowButton } from './RowButton';
import { setAddressAsync, setBalancesAsync, setCdpAsync, setPriceAsync,
    selectAddress, selectBalances, selectCdp, selectPrice } from './cdpSlice';

// ------------------------------------------
//                 Constants
// ------------------------------------------
const BNB_CONVERSION_FACTOR = 10 ** 8;
const USDX_CONVERSION_FACTOR = 10 ** 6;

// ------------------------------------------
//            DrawRepay Component
// ------------------------------------------

export function DrawRepay({ cosmosAPI }) {
    const dispatch = useDispatch();

    // State
    let [collateralDenom] = useState('bnb');
    let [debtDenom] = useState('usdx');
    let [debtPrice] = useState(1);

    // Selectors
    let address = useSelector(selectAddress);
    let balances = useSelector(selectBalances);
    let cdp = useSelector(selectCdp);
    let price = useSelector(selectPrice);

    // Effects
    useEffect(() => {
        dispatch(setAddressAsync(cosmosAPI));
        dispatch(setPriceAsync(cosmosAPI, collateralDenom));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if(address) {
            dispatch(setBalancesAsync(cosmosAPI, address));
            if(price) {
                dispatch(setCdpAsync(cosmosAPI, address, collateralDenom));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address]);

    // Get user's balance of debt coin // TODO: this will be used by the modal
    let balance
    if(balances) {
        const coin  = balances.find(coin => coin.denom === debtDenom);
        balance = coin ? coin.amount : 0;
    }

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
    )
}
