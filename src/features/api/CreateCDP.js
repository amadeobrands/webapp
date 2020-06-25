import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Button, TextField } from '@material-ui/core';
import { postMsgCreateCdpAsync} from './apiSlice';

export function CreateCDP({ cosmosAPI }) {
  const dispatch = useDispatch();

  let [collateralDenom, setCollateralDenom] = useState('');
  let [collateralAmount, setCollateralAmount] = useState('');
  let [principalDenom, setPrincipalDenom] = useState('');
  let [principalAmount, setPrincipalAmount] = useState('');

  return (
    <Box paddingTop='1rem'>
    <Box display="flex" paddingTop='1rem' flexDirection="row">
        <TextField
            id="input-collateral-denom"
            label="Collateral Denom"
            style={{ margin: 8 }}
            placeholder="bnb"
            margin="normal"
            InputLabelProps={{
            value: collateralDenom,
            shrink: true,
            onChange: e => setCollateralDenom(e.target.value)
            }}
        />
        <TextField
            id="input-collateral-amount"
            label="Collateral Amount"
            style={{ margin: 8 }}
            placeholder="100"
            margin="normal"
            InputLabelProps={{
            value: collateralAmount,
            shrink: true,
            onChange: e => setCollateralAmount(e.target.value)
            }}
        />    
    </Box>
    <Box display="flex" paddingTop='1rem' flexDirection="row">
        <TextField
            id="input-principal-denom"
            label="Principal Denom"
            style={{ margin: 8 }}
            placeholder="usdx"
            margin="normal"
            InputLabelProps={{
            value: principalDenom,
            shrink: true,
            onChange: e => setPrincipalDenom(e.target.value)
            }}
        />
        <TextField
            id="input-principal-amount"
            label="Principal Amount"
            style={{ margin: 8 }}
            placeholder="100"
            margin="normal"
            InputLabelProps={{
            value: principalAmount,
            shrink: true,
            onChange: e => setPrincipalAmount(e.target.value)
            }}
        />    
    </Box>    
    <br/>
    <Button
        variant="outlined"
        color="secondary"
        size="large"
        onClick={() => dispatch(
        postMsgCreateCdpAsync(
            cosmosAPI,
            collateralDenom,
            collateralAmount,
            principalDenom,
            principalAmount)
        )}>
        Create CDP
    </Button>
    </Box>
    )
}
