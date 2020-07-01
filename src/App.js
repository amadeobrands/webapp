import React from 'react';
import { Box, Container, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { CosmosLedger } from './features/ledger/ledger';
import { LedgerConnect } from './features/ledger/LedgerConnect';
import { selectConnectionState, selectConnectionError, status } from './features/ledger/ledgerSlice';
import { Loading } from './features/common/Loading';
import { CosmosAPI } from './features/api/CosmosAPI';
import { APIConnect } from './features/api/APIConnect';
import logo from './logo.svg';
import { COSMOS_URL, CHAIN_ID } from './config';

const ledger = new CosmosLedger();
const cosmosAPI = new CosmosAPI(COSMOS_URL, CHAIN_ID, ledger);

const useStyles = makeStyles({
  root: {
    minHeight: '100vh',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'

  },
  logo: {
    height: '100px'
  }
});

function App() {
  const classes = useStyles();

  const connectionState = useSelector(selectConnectionState);
  const connectionError = useSelector(selectConnectionError);

  let component;

  switch(connectionState) {
    case status.CONNECTED:
      component = (
        <Box>
          <APIConnect cosmosAPI={cosmosAPI}/>
        </Box>
      )
      break;
    case status.CONNECTING:
      component = <Loading message="Connecting..."/>
      break;
    case status.DISCONNECTED:
      component = <LedgerConnect ledger={ledger}/>
      break;
    case status.FAILED:
      component = <LedgerConnect ledger={ledger} errorMessage={connectionError}/>
      break;
    default:
      component = (
        <Box paddingTop={2}>
          <Typography variant="h5" component="p" color="error">
            An unkown error has occurred! Please refresh the page.
          </Typography>
        </Box>
      )
      break;
  }

  return (
      <Container className={classes.root}>
        <Box marginBottom={5}>
          <img src={logo} className={classes.logo} alt="logo" />
        </Box>
        <Box>
          { component }
        </Box>
      </Container>
  );
}

export default App;
