import { createSlice } from '@reduxjs/toolkit';

export const balanceSlice = createSlice({
  name: 'balance',
  initialState: {
    isLoaded: false,
    kavaAmount: 0
  },
  reducers: {
    setKavaAmount: (state, action) => {
      state.kavaAmount = action.payload;
      state.isLoaded = true;
    }
  }
});

export const { setKavaAmount } = balanceSlice.actions;

export const setKavaAmountAsync = address => async dispatch => {
  const response = await fetch('https://kava3.data.kava.io/auth/accounts/' + address)
  const data = await response.json()

  const coins = data.result.value.coins;
  const ukava = coins.find(coin => coin.denom === 'ukava');

  dispatch(setKavaAmount(ukava.amount));
}

export const selectKavaAmount = state => state.balance.kavaAmount;
export const selectIsLoaded = state => state.balance.isLoaded;

export default balanceSlice.reducer;
