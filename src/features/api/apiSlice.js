import { createSlice } from '@reduxjs/toolkit';

export const txState = {
  IDLE: 'idle',
  PREPARING: 'preparing',
  SIGNING: 'signing',
  BROADCASTING: 'broadcasting',
  CONFIRMING: 'confirming',
  ERRORED: 'errored',
  COMPLETED: 'completed',
}

export const apiSlice = createSlice({
  name: 'api',
  initialState: {
    txState: txState.IDLE,
    txError: '',
    txErrorState: null,
  },
  reducers: {
    idle: state => {
      state.txState = txState.IDLE;
      state.txError = '';
      state.txErrorState = null;
    },
    preparing: state => {
      state.txState = txState.PREPARING;
      state.txError = '';
      state.txErrorState = null;
    },
    signing: state => {
      state.txState = txState.SIGNING;
      state.txError = '';
      state.txErrorState = null;
    },
    broadcasting: state => {
      state.txState = txState.BROADCASTING;
      state.txError = '';
      state.txErrorState = null;
    },
    confirming: state => {
      state.txState = txState.CONFIRMING;
      state.txError = '';
      state.txErrorState = null;
    },
    errored: (state, action) => {
      state.txErrorState = state.txState;
      state.txState = txState.ERRORED;
      state.txError = action.payload;
    },
    completed: state => {
      state.txState = txState.COMPLETED;
      state.txError = '';
      state.txErrorState = null;
    }
  }
});

export const { idle, preparing, signing, broadcasting, confirming, errored, completed } = apiSlice.actions;

export const postMsgSendAsync = (cosmosAPI, recipient, denom, amount) => async dispatch => {
  try {
    dispatch(preparing());
    const [address, accountNumber, sequence] = await cosmosAPI.getAccountInfo();
    const msg = cosmosAPI.MsgSend(address, recipient, denom, amount);

    dispatch(signing());
    const signedTx = await cosmosAPI.signTxForMsg(msg, accountNumber, sequence);

    dispatch(broadcasting());
    const response = await cosmosAPI.broadcastTx(signedTx);

    if (response.error) {
      dispatch(errored(response.error));
      return;
    }

    if (response.code) {
      dispatch(errored(response.raw_log));
      return;
    }

    dispatch(confirming());
    const txHash = response.txHash;
    const included = await cosmosAPI.waitForBlock(txHash);

    if (included) {
      dispatch(completed());
    } else {
      dispatch(errored('Timeout while waiting for transaction to be included in block'));
    }
  } catch(e) {
    dispatch(errored(e.toString()));
    return;
  }

}

export const postMsgCreateCdpAsync = (
  cosmosAPI,
  collateralDenom,
  collateralAmount,
  principalDenom,
  principalAmount
) => async dispatch => {
  await cosmosAPI.getAddress();

  //const sender = await cosmosAPI.getAccountAddress();
  //const collateral = Kava.utils.formatCoins(collateralAmount, collateralDenom);
  //const principal = Kava.utils.formatCoins(principalAmount, principalDenom);
  //const msg = Kava.msg.newMsgCreateCDP(sender, principal, collateral);

  //// Sign and broadcast the transaction
  //await cosmosAPI.broadcast(msg);
}

export const selectTxState = state => state.api.txState;
export const selectTxError = state => state.api.txError;
export const selectTxErrorState = state => state.api.txErrorState;

export default apiSlice.reducer;
