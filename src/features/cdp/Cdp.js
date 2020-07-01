import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Box } from "@material-ui/core";

import { DepositWithdraw } from "./DepositWithdraw";
import { LiquidationPrice } from "./LiquidationPrice";
import { LoanToValue } from "./LoanToValue";
import { DrawRepay } from "./DrawRepay";
import { setCdpAsync, setPriceAsync, selectCdp, selectPrice } from './cdpSlice';

export function Cdp({ cosmosAPI, address, balances }) {
    const dispatch = useDispatch();

    // State
    let [collateralDenom] = useState('bnb');
    let [debtDenom] = useState('usdx');

    // Selectors
    let price = useSelector(selectPrice);
    let cdp = useSelector(selectCdp);

    // Effects
    useEffect(() => {
        dispatch(setPriceAsync(cosmosAPI, collateralDenom));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if(address) {
            dispatch(setCdpAsync(cosmosAPI, address, collateralDenom));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address]);
    
    return(
        <Box display="flex" flexDirection="column" marginTop={2}>
            <Box display="flex" flexDirection="horizontal" marginBottom={2}>
                <Box marginRight={3}>
                    <LiquidationPrice cdp={cdp} price={price} penalty={"13"}/>
                </Box>
                <Box marginLeft={3}>
                    <LoanToValue cdp={cdp} price={price} minimumRatio={"150"} stabilityFee={"2.0"}/>
                </Box>
            </Box>
            <Box display="flex" flexDirection="horizontal" marginTop={2}>
                <Box marginRight={3}>
                    <DepositWithdraw collateralDenom={collateralDenom} cdp={cdp} price={price}/>
                </Box>
                <Box marginLeft={3}>
                    <DrawRepay debtDenom={debtDenom} cdp={cdp} price={price}/>
                </Box>
            </Box>
        </Box>
    )
}