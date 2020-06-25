import { createSlice } from '@reduxjs/toolkit';
import Kava from '@kava-labs/javascript-sdk';

export const apiSlice = createSlice({
  name: 'api',
  initialState: {
    isLoaded: false,
    isPosted: false,
  },
  reducers: {
    connected: state => {
      state.isLoaded = true;
    },
    posted: state => {
      state.isPosted = true;
    }
  }
});

export const { connected, posted } = apiSlice.actions;

export const initApiAsync = cosmosAPI => async dispatch => {
  try {
    await cosmosAPI.init()
    dispatch(connected())
  } catch (e) {
    console.log("initialization error:", e.toString())
  }
}

export const postMsgSendAsync = (cosmosAPI, recipient, denom, amount) => async dispatch => {
  const sender = await cosmosAPI.getAccountAddress();
  const coins = Kava.utils.formatCoins(amount, denom);
  const msg = Kava.msg.newMsgSend(sender, recipient, coins);

  // Sign and broadcast the transaction
  await cosmosAPI.broadcast(msg);
  dispatch(posted());
}

export const postMsgCreateCdpAsync = (
  cosmosAPI,
  collateralDenom,
  collateralAmount,
  principalDenom,
  principalAmount
) => async dispatch => {
  const sender = await cosmosAPI.getAccountAddress();
  const collateral = Kava.utils.formatCoins(collateralAmount, collateralDenom);
  const principal = Kava.utils.formatCoins(principalAmount, principalDenom);
  const msg = Kava.msg.newMsgCreateCDP(sender, principal, collateral);

  // Sign and broadcast the transaction
  await cosmosAPI.broadcast(msg);
  dispatch(posted());
}

export const selectIsLoaded = state => state.api.isLoaded;
export const selectIsPosted = state => state.api.isPosted;

export default apiSlice.reducer;
