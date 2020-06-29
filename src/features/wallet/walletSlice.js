import { createSlice } from '@reduxjs/toolkit';

export const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    address: '',
    price: '',
    collateralizationRatio: '',
    address: '',
    balances: [],
  },
  reducers: {
    setAddress: (state, action) => {
        state.address = action.payload;
    },
    setPrice: (state, action) => {
        state.price = action.payload;
    },
    setCollateralizationRatio: (state, action) => {
        state.collateralizationRatio = action.payload;
    },
    setAddress: (state, action) => {
        state.address = action.payload;
    },
    setBalances: (state, action) => {
        state.balances = action.payload;
    },
  }
});

export const { setAddress, setPrice, setCollateralizationRatio, setBalances } = walletSlice.actions;

export const setPriceAsync = (cosmosAPI, denom) => async dispatch => {
    const market = [denom, ':', 'usd'].join('');
    const response = await fetch(cosmosAPI.getUrl() + "/pricefeed/price/" + market);
    const data = await response.json();
    const price = Number(data.result.price)
    dispatch(setPrice(price));
}

export const setAddressAsync = (cosmosAPI) => async dispatch => {
  const address = await cosmosAPI.getWalletAddress();
  dispatch(setAddress(address));
}

export const setBalancesAsync = (cosmosAPI, address) => async dispatch => {
    const response = await fetch(cosmosAPI.getUrl() + "/auth/accounts/" + address)
    const data = await response.json()
    const coins = data.result.value.coins;
      dispatch(setBalances(coins));
  }
  
  export const selectBalances = state => state.wallet.balances;
  export const selectPrice = state => state.wallet.price;
  export const selectAddress = state => state.wallet.address;

export default walletSlice.reducer;