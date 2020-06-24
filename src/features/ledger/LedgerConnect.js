import React from 'react'
import { useDispatch } from 'react-redux';
import { Box, Button } from '@material-ui/core';
import { connectAsync } from './ledgerSlice';

export function LedgerConnect({ ledger }) {
  const dispatch = useDispatch();

  return (
    <Box paddingTop='1rem'>
      <Button variant="outlined" color="secondary" size="large" onClick={() => dispatch(connectAsync(ledger))}>Connect Ledger</Button>
    </Box>
  )
}
