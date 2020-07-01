// General imports
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Third party library imports
import { Box, Divider } from '@material-ui/core';

// Local imports
import { RowButton } from './RowButton';
import { setAddressAsync, setBalancesAsync, setCdpAsync, setPriceAsync,
    selectAddress, selectCdp, selectPrice } from './cdpSlice';

// ------------------------------------------
//                 Constants
// ------------------------------------------
const BNB_CONVERSION_FACTOR = 10 ** 8;
const USDX_CONVERSION_FACTOR = 10 ** 6;

// ------------------------------------------
//          DepositWithdraw Component
// ------------------------------------------

export function DepositWithdraw({ cosmosAPI }) {
    const dispatch = useDispatch();

    // State
    let [collateralDenom] = useState('bnb');

    // Selectors
    let address = useSelector(selectAddress);
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

    // Setup
    // Get user's balance of collateral coin
    // let balance
    // if(balances) {
    //     const coin  = balances.find(coin => coin.denom === collateralDenom);
    //     balance = coin ? coin.amount : 0;
    // }

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
        <Box display="flex" flexDirection="column" border={1} borderRadius={5} borderColor={"#D3D3D3"}>
            <RowButton
                rowText={collateralDenom.toUpperCase() + " Locked"}
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
    )
}
