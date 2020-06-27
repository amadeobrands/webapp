import { createSlice } from '@reduxjs/toolkit';

export const apiSlice = createSlice({
  name: 'api',
  initialState: {
    isPosted: false,
  },
  reducers: {
    posted: state => {
      state.isPosted = true;
    }
  }
});

export const { posted } = apiSlice.actions;

export const postMsgSendAsync = (cosmosAPI, recipient, denom, amount) => async dispatch => {
  await cosmosAPI.MsgSend(recipient, denom, amount);
  dispatch(posted())
}

export const postMsgCreateCdpAsync = (
  cosmosAPI,
  collateralDenom,
  collateralAmount,
  principalDenom,
  principalAmount
) => async dispatch => {
  //const sender = await cosmosAPI.getAccountAddress();
  //const collateral = Kava.utils.formatCoins(collateralAmount, collateralDenom);
  //const principal = Kava.utils.formatCoins(principalAmount, principalDenom);
  //const msg = Kava.msg.newMsgCreateCDP(sender, principal, collateral);

  //// Sign and broadcast the transaction
  //await cosmosAPI.broadcast(msg);
  dispatch(posted());
}

export const selectIsPosted = state => state.api.isPosted;

export default apiSlice.reducer;
