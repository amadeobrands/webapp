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
//            DrawRepay Component
// ------------------------------------------

export function DrawRepay({ cosmosAPI }) {
    const dispatch = useDispatch();

    // State
    let [debtDenom] = useState('usdx');

    // Selectors
    let address = useSelector(selectAddress);
    let balances = useSelector(selectBalances);
    let cdp = useSelector(selectCdp);
    // let price = useSelector(selectPrice);
    let price = 1;

    // Effects
    useEffect(() => {
        dispatch(setAddressAsync(cosmosAPI));
        dispatch(setPriceAsync(cosmosAPI, debtDenom));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if(address) {
            dispatch(setBalancesAsync(cosmosAPI, address));
            // dispatch(setCdpAsync(cosmosAPI, address, collateralDenom)); // TODO: use me
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address]);

    // Get user's balance of debt coin // TODO: this will be used by the modal
    let balance
    if(balances) {
        const coin  = balances.find(coin => coin.denom === debtDenom);
        balance = coin ? coin.amount : 0;
    }

    // Render
    return (
        <Box display="flex" flexDirection="column" border={1} borderRadius={5} borderColor={"#D3D3D3"}>
            <RowButton
                rowText={["Outstanding", debtDenom.toUpperCase(), "debt"].join(" ")}
                buttonText={"Pay back"}
                denom={debtDenom}
                amount={"25.00"}
                price={price}
            />
            <Divider/>
            <RowButton
                rowText="Available to generate"
                buttonText="Generate"
                denom={debtDenom}
                amount={"12.44"}
                price={price}
            />
        </Box>
    )
}
