import { configureStore } from '@reduxjs/toolkit';
import balanceReducer from '../features/balance/balanceSlice';
import ledgerReducer from '../features/ledger/ledgerSlice';
import apiReducer from '../features/api/apiSlice';

export default configureStore({
  reducer: {
    balance: balanceReducer,
    ledger: ledgerReducer,
    api: apiReducer,
  },
});
