import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Button, TextField } from '@material-ui/core';
import { postMsgSendAsync} from './apiSlice';

export function Transfer({ cosmosAPI }) {
  const dispatch = useDispatch();

  let [recipient, setRecipient] = useState('');
  let [denom, setDenom] = useState('');
  let [amount, setAmount] = useState('');

  return (
    <Box paddingTop='1rem'>
        <TextField
        id="input-recipient"
        label="Recipient"
        style={{ margin: 8 }}
        placeholder="kava834au91..."
        fullWidth
        margin="normal"
        onChange={e => setRecipient(e.target.value)}
        InputLabelProps={{
            value: recipient,
            shrink: true
        }}
        />
        <Box display="flex" paddingTop='1rem' flexDirection="row">
            <TextField
                id="input-denom"
                label="Denom"
                style={{ margin: 8 }}
                placeholder="bnb"
                margin="normal"
                onChange={e => setDenom(e.target.value)}
                InputLabelProps={{
                value: denom,
                shrink: true
                }}
            />
            <TextField
                id="input-amount"
                label="Amount"
                style={{ margin: 8 }}
                placeholder="100"
                margin="normal"
                onChange={e => setAmount(e.target.value)}
                InputLabelProps={{
                value: amount,
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
              onClick={() => dispatch(postMsgSendAsync(cosmosAPI, recipient, denom, amount))}>
              Transfer
          </Button>
        </Box>
    </Box>
    )
}
