import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Button, Typography} from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab/';
import { AccountBalance, TrendingFlat, AttachMoney } from '@material-ui/icons';
import { idle, txState, selectTxState, selectTxError, selectTxErrorState } from './apiSlice';
import { Transfer } from './Transfer';
import { CreateCDP } from './CreateCDP';
import { Loading } from '../common/Loading';
import { Wallet } from '../wallet/Wallet';

const txMessage = {
  [txState.PREPARING]: 'Preparing',
  [txState.SIGNING]: 'Signing',
  [txState.BROADCASTING]: 'Broadcasting',
  [txState.CONFIRMING]: 'Confirming',
}

function txIsIdle(state) {
  return state === txState.IDLE;
}

function txInProgress(state) {
  return state !== txState.IDLE &&
    state !== txState.ERRORED &&
    state !== txState.COMPLETED
}

function txErrored(state) {
  return state === txState.ERRORED;
}

function txCompleted(state) {
  return state === txState.COMPLETED;
}

export function APIConnect({ cosmosAPI }) {
  const dispatch = useDispatch();
  const [view, setView] = useState('wallet');
  const currentTxState = useSelector(selectTxState);
  const txError = useSelector(selectTxError);
  const txErrorState = useSelector(selectTxErrorState);

  const handleChange = (event, nextView) => {
    setView(nextView);
  };

  let component;

  if (txIsIdle(currentTxState)) {
    switch(view) {
      case 'wallet':
        component = <Wallet cosmosAPI={cosmosAPI} />
        break
      case 'transfer':
        component = <Transfer cosmosAPI={cosmosAPI} />
        break;
      case 'createCDP':
        component = <CreateCDP cosmosAPI={cosmosAPI} />
        break;
      default:
        break;
    }
  } else if (txInProgress(currentTxState)) {
    component = <Loading message={txMessage[currentTxState] + '...'} />
  } else if (txErrored(currentTxState)) {
    component = (
      <Box paddingTop={1}>
        <Typography variant="h4" color="error">
          Error while { txErrorState }
        </Typography>
        <Typography variant="h5" component="p" color="error">
          { txError }
        </Typography>
        <Box width="227px" margin="auto" paddingTop={1}>
        <Button
            variant="contained"
            color="secondary"
            size="large"
            fullWidth={true}
            onClick={() => dispatch(idle())}
          >
            Back
          </Button>
        </Box>
      </Box>
    )
  } else if (txCompleted(currentTxState)) {
    component = (
      <Box paddingTop={1}>
        <Typography variant="h5" component="p" color="secondary">
          Transaction Confirmed!
        </Typography>
      <Box width="227px" margin="auto" paddingTop={1}>
        <Button
            variant="contained"
            color="secondary"
            size="large"
            fullWidth={true}
            onClick={() => dispatch(idle())}
          >
          Back
        </Button>
      </Box>
      </Box>
    )
  }

  return (
    <Box>
      { txIsIdle(currentTxState) &&
        <ToggleButtonGroup orientation="horizontal" value={view} exclusive onChange={handleChange}>
          <ToggleButton value="wallet" aria-label="wallet">
            <AccountBalance />
          </ToggleButton>
          <ToggleButton value="transfer" aria-label="transfer">
            <TrendingFlat />
          </ToggleButton>
          <ToggleButton value="createCDP" aria-label="createCDP">
            <AttachMoney />
          </ToggleButton>
        </ToggleButtonGroup>
      }
        <Box>
          {component}
        </Box>
    </Box>
  )
}