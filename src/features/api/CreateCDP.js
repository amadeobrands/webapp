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
            onChange={e => setCollateralDenom(e.target.value)}
            InputLabelProps={{
            value: collateralDenom,
            shrink: true
            }}
        />
        <TextField
            id="input-collateral-amount"
            label="Collateral Amount"
            style={{ margin: 8 }}
            placeholder="100"
            margin="normal"
            onChange={e => setCollateralAmount(e.target.value)}
            InputLabelProps={{
            value: collateralAmount,
            shrink: true
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
            onChange={e => setPrincipalDenom(e.target.value)}
            InputLabelProps={{
            value: principalDenom,
            shrink: true
            }}
        />
        <TextField
            id="input-principal-amount"
            label="Principal Amount"
            style={{ margin: 8 }}
            placeholder="100"
            margin="normal"
            onChange={e => setPrincipalAmount(e.target.value)}
            InputLabelProps={{
            value: principalAmount,
            shrink: true
            }}
        />
    </Box>
    <br/>
    <Box width="227px" margin="auto">
      <Button
          variant="contained"
          color="secondary"
          size="large"
          fullWidth={true}
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
    </Box>
    )
}
