import { createSlice } from '@reduxjs/toolkit';
import Kava from '@kava-labs/javascript-sdk';

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

export const postTxAsync = (cosmosAPI, msg) => async dispatch => {
  try {
    dispatch(preparing());
    const [accountNumber, sequence] = await cosmosAPI.prepareSignInfo();

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
    const txHash = response.txhash;

    const included = await cosmosAPI.waitForBlock(txHash);

    if (included) {
      dispatch(completed());
    } else {
      dispatch(errored('Timeout while waiting for transaction to be included in block'));
    }
  } catch(e) {
    dispatch(errored(e));
    return;
  }
}

export const postMsgSendAsync = (cosmosAPI, recipient, denom, amount) => async dispatch => {
  const sender = await cosmosAPI.getWalletAddress();
  const coins = Kava.utils.formatCoins(amount, denom);
  const msg = Kava.msg.newMsgSend(sender, recipient, coins);
  return dispatch(postTxAsync(cosmosAPI, msg));
}

export const postMsgCreateCdpAsync = (
  cosmosAPI,
  collateralDenom,
  collateralAmount,
  principalDenom,
  principalAmount) => async dispatch => {
  const sender = await cosmosAPI.getWalletAddress();
  const collateral = Kava.utils.formatCoin(collateralAmount, collateralDenom);
  const principal = Kava.utils.formatCoin(principalAmount, principalDenom);
  const msg = Kava.msg.newMsgCreateCDP(sender, principal, collateral);
  return dispatch(postTxAsync(cosmosAPI, msg));
}

// TODO: Moved to cdpSlice.js, remove later
// export const postMsgDepositAsync = (cosmosAPI, owner, collateralDenom, collateralAmount) => async dispatch => {
//   const sender = await cosmosAPI.getWalletAddress();
//   if(!owner) { owner = sender; }  // Default to sender's CDP
//   const collateral = Kava.utils.formatCoin(collateralAmount, collateralDenom);
//   const msg = Kava.msg.newMsgDeposit(owner, sender, collateral);
//   return dispatch(postTxAsync(cosmosAPI, msg));
// }

// export const postMsgWithdrawAsync = (cosmosAPI, owner, collateralDenom, collateralAmount) => async dispatch => {
//   const sender = await cosmosAPI.getWalletAddress();
//   if(!owner) { owner = sender; }  // Default to sender's CDP
//   const collateral = Kava.utils.formatCoin(collateralAmount, collateralDenom);
//   const msg = Kava.msg.newMsgWithdraw(owner, sender, collateral);
//   return dispatch(postTxAsync(cosmosAPI, msg));
// }

// export const postMsgDrawDebtAsync = (cosmosAPI, cdpDenom, principalDenom, principalAmount) => async dispatch => {
//   const owner = await cosmosAPI.getWalletAddress();
//   const principal = Kava.utils.formatCoin(principalAmount, principalDenom);
//   const msg = Kava.msg.newMsgDrawDebt(owner, cdpDenom, principal);
//   return dispatch(postTxAsync(cosmosAPI, msg));
// }

// export const postMsgRepayDebtAsync = (cosmosAPI, cdpDenom, principalDenom, principalAmount) => async dispatch => {
//   const owner = await cosmosAPI.getWalletAddress();
//   const principal = Kava.utils.formatCoin(principalAmount, principalDenom);
//   const msg = Kava.msg.msgRepayDebt(owner, principal, cdpDenom);
//   return dispatch(postTxAsync(cosmosAPI, msg));
// }

export const postMsgCreateSwap = (
  cosmosAPI,
  recipient,
  recipientOtherChain,
  senderOtherChain,
  randomNumberHash,
  timestamp,
  coinDenom,
  coinAmount,
  heightSpan,
) => async dispatch => {
  const sender = await cosmosAPI.getWalletAddress();
  const amount = Kava.utils.formatCoins(coinAmount, coinDenom);
  const msg = Kava.msg.newMsgCreateAtomicSwap(
    sender,
    recipient,
    recipientOtherChain,
    senderOtherChain,
    randomNumberHash.toUpperCase(),
    timestamp,
    amount,
    heightSpan
  );
  return dispatch(postTxAsync(cosmosAPI, msg));
}

export const postMsgClaimSwap = (cosmosAPI, swapID, randomNumber) => async dispatch => {
  const sender = await cosmosAPI.getWalletAddress();
  const msg = Kava.msg.newMsgClaimAtomicSwap(
    sender,
    swapID.toUpperCase(),
    randomNumber.toUpperCase()
  );
  return dispatch(postTxAsync(cosmosAPI, msg));
}

export const postMsgRefundSwap = (cosmosAPI, swapID) => async dispatch => {
  const sender = await cosmosAPI.getWalletAddress();
  const msg = Kava.msg.newMsgRefundAtomicSwap(
    sender,
    swapID.toUpperCase()
  );
  return dispatch(postTxAsync(cosmosAPI, msg));
}

export const selectTxState = state => state.api.txState;
export const selectTxError = state => state.api.txError;
export const selectTxErrorState = state => state.api.txErrorState;

export default apiSlice.reducer;
