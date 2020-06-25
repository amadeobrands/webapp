import React from 'react';
import { Box, Container, CircularProgress, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { CosmosLedger } from './features/ledger/ledger';
import { LedgerConnect } from './features/ledger/LedgerConnect';
import { selectConnectionState, selectConnectionError, status } from './features/ledger/ledgerSlice';
import { CosmosAPI } from './features/api/CosmosAPI';
import { APIConnect } from './features/api/APIConnect';
import logo from './logo.svg';
import { COSMOS_URL } from './config';

// temp test for netfily.toml config
console.log(COSMOS_URL)

const ledger = new CosmosLedger();
const cosmosAPI = new CosmosAPI(COSMOS_URL, ledger);


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
        <Box paddingTop={1}>
          <APIConnect cosmosAPI={cosmosAPI}/>
        </Box>
      )
      break;
    case status.CONNECTING:
      component = (
        <Box paddingTop={2}>
          <CircularProgress color="secondary" size={80}/>
          <Typography variant="h5" component="p" color="secondary">
            Connecting...
          </Typography>
        </Box>
      )
      break;
    case status.DISCONNECTED:
      component = (
        <React.Fragment>
          <LedgerConnect ledger={ledger}/>
        </React.Fragment>
      )
        break;
    case status.FAILED:
      component = (
        <React.Fragment>
         <LedgerConnect ledger={ledger}/>
         <Box paddingTop={1}>
          <Typography variant="h5" component="p" color="error">
              { connectionError }
          </Typography>
          </Box>
        </React.Fragment>
      )
      break;
    default:
      break;
  }

  return (
      <Container className={classes.root}>
        <Box>
          <img src={logo} className={classes.logo} alt="logo" />
          { component }
        </Box>
      </Container>
  );
}

export default App;
