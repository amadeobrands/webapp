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
//          DepositWithdraw Component
// ------------------------------------------

export function DepositWithdraw({ cosmosAPI }) {
    const dispatch = useDispatch();

    // State
    let [collateralDenom] = useState('bnb');

    // Selectors
    let address = useSelector(selectAddress);
    let balances = useSelector(selectBalances);
    // let cdp = useSelector(selectCdp);
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
            // dispatch(setCdpAsync(cosmosAPI, address, collateralDenom)); // TODO: use me
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address]);

    // Setup
    // Get user's balance of collateral coin
    let balance
    if(balances) {
        const coin  = balances.find(coin => coin.denom === collateralDenom);
        balance = coin ? coin.amount : 0;
    }

    // Render
    return (
        <Box display="flex" flexDirection="column" border={1} borderRadius={5} borderColor={"#D3D3D3"}>
            <RowButton
                rowText={collateralDenom.toUpperCase() + " Locked"}
                buttonText={"Deposit"}
                denom={collateralDenom}
                amount={"40.52"}
                price={price}
            />
            <Divider/>
            <RowButton
                rowText="Able to withdraw"
                buttonText="Withdraw"
                denom={collateralDenom}
                amount={balance}
                price={price}
            />
        </Box>
    )
}
