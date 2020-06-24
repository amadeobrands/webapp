import { createSlice } from '@reduxjs/toolkit';

export const status = {
  DISCONNECTED: 'disconnected',
  CONNECTED: 'connected',
  CONNECTING: 'connecting',
  FAILED: 'failed',
}

export const ledgerSlice = createSlice({
  name: 'ledger',
  initialState: {
    status: status.DISCONNECTED,
    error: '',
  },
  reducers: {
    connecting: state => {
      state.status = status.CONNECTING;
      state.error = '';
    },
    connected: state => {
      state.status = status.CONNECTED;
      state.error = '';
    },
    failed: (state, action) => {
      state.status = status.FAILED;
      state.error = action.payload;
    }
  }
});

export const { connecting, connected, failed } = ledgerSlice.actions;

export const connectAsync = ledger => async dispatch => {
  dispatch(connecting());
  try {
    await ledger.connect()
    dispatch(connected());
  } catch (e) {
    dispatch(failed(e.toString()));
  }
}

export const selectConnectionState = state => state.ledger.status;
export const selectConnectionError = state => state.ledger.error;

export default ledgerSlice.reducer;
