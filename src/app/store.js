import { configureStore } from '@reduxjs/toolkit';
import ledgerReducer from '../features/ledger/ledgerSlice';
import apiReducer from '../features/api/apiSlice';
import walletReducer from '../features/wallet/walletSlice';
import cdpReducer from '../features/cdp/cdpSlice';

export default configureStore({
  reducer: {
    ledger: ledgerReducer,
    api: apiReducer,
    wallet: walletReducer,
    cdp: cdpReducer
  },
});
