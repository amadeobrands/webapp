import { configureStore } from '@reduxjs/toolkit';
import balanceReducer from '../features/balance/balanceSlice';
import ledgerReducer from '../features/ledger/ledgerSlice';

export default configureStore({
  reducer: {
    balance: balanceReducer,
    ledger: ledgerReducer,
  },
});
