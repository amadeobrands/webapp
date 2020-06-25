import { createSlice } from '@reduxjs/toolkit';

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

export const postMsgAsync = (cosmosAPI, recipient, denom, amount) => async dispatch => {
  const sender = await cosmosAPI.getAccountAddress();
  const acc = await cosmosAPI.getAccount(sender);
  console.log("Ledger wallet account:", acc)

  // Build the Send msg
  const msg = cosmosAPI.MsgSend(sender, recipient, denom, amount);
  console.log("msg:", msg);

  // Sign and broadcast the transaction
  await cosmosAPI.broadcast(msg);

  dispatch(posted());
}

export const selectIsLoaded = state => state.api.isLoaded;
export const selectIsPosted = state => state.api.isPosted;

export default apiSlice.reducer;
