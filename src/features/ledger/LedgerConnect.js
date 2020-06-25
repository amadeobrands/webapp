import React from 'react'
import { useDispatch } from 'react-redux';
import { Box, Button, Typography } from '@material-ui/core';
import { connectAsync } from './ledgerSlice';

export function LedgerConnect({ ledger, errorMessage }) {
  const dispatch = useDispatch();

  return (
    <Box>
      <Box paddingTop={1}>
        <Button variant="outlined" color="secondary" size="large" onClick={() => dispatch(connectAsync(ledger))}>Connect Ledger</Button>
      </Box>
      { errorMessage &&
        <Box paddingTop={1}>
          <Typography variant="h5" component="p" color="error">
              { errorMessage }
          </Typography>
        </Box>
      }
    </Box>
  )
}
