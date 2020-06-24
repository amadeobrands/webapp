import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button } from '@material-ui/core';
import { initApiAsync, postMsgAsync, selectIsLoaded, selectIsPosted} from './apiSlice';

export function APIConnect({ cosmosAPI }) {
  const dispatch = useDispatch();

  const loaded = useSelector(selectIsLoaded);
  const posted = useSelector(selectIsPosted);

  let [recipient, setRecipient] = useState('');
  let [denom, setDenom] = useState('');
  let [amount, setAmount] = useState('');

  let component
  switch(loaded) {
    case false:
      if(!posted) {
        component = (
          <Box paddingTop={1}>
            <Button
            variant="outlined"
            color="secondary"
            size="large"
            onClick={() => dispatch(initApiAsync(cosmosAPI))}>
              Init
            </Button>
          </Box>
        )       
      } else {
        component = (
        <Box paddingTop={1}>
          <p>Tx sent</p>
        </Box>
        )
      }
      break;
    case true:
      component = (
        <Box paddingTop='1rem'>
          <p>Recipient</p>
          <input
            value={recipient}
            onChange={e => setRecipient(e.target.value)}
          />
          <p>Denom</p>
          <input
            value={denom}
            onChange={e => setDenom(e.target.value)}
          />
          <p>Amount</p>
          <input
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
          <br/>
          <br/>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            onClick={() => dispatch(postMsgAsync(cosmosAPI, recipient, denom, amount))}>
              Send
          </Button>
        </Box>
      )
    }

    // Render
    return (
      <Box>
        {component}
      </Box>
    )
}