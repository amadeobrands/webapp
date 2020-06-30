// General imports
import { createSlice } from '@reduxjs/toolkit';
import Kava from '@kava-labs/javascript-sdk';

// Third party library imports

// Local imports
import { postTxAsync } from '../api/apiSlice';

// ------------------------------------------
//                 Slice
// ------------------------------------------

export const cdpSlice = createSlice({
  name: 'cdp',
  initialState: {
    address: '',
    balances: [],
    cdp: '',
    price: '',
  },
  reducers: {
    setAddress: (state, action) => {
        state.address = action.payload;
    },
    setBalances: (state, action) => {
        state.balances = action.payload;
    },
    setCdp: (state, action) => {
        state.cdp = action.payload;
    },
    setPrice: (state, action) => {
        state.price = action.payload;
    },
  }
});

// ------------------------------------------
//            Actions: GET and set
// ------------------------------------------

export const { setAddress, setBalances, setCdp, setPrice } = cdpSlice.actions;

export const setPriceAsync = (cosmosAPI, denom) => async dispatch => {
    const market = [denom, ':', 'usd'].join('');
    const response = await fetch(cosmosAPI.getUrl() + "/pricefeed/price/" + market);
    const data = await response.json();
    if(data.result) {
        const price = Number(data.result.price)
        dispatch(setPrice(price));
    }
}

export const setAddressAsync = (cosmosAPI) => async dispatch => {
  const address = await cosmosAPI.getWalletAddress();
  dispatch(setAddress(address));
}

export const setBalancesAsync = (cosmosAPI, address) => async dispatch => {
    const response = await fetch(cosmosAPI.getUrl() + "/auth/accounts/" + address)
    const data = await response.json()
    if(data.result) {
        const coins = data.result.value.coins;
        dispatch(setBalances(coins));
    }
}

export const setCdpAsync = (cosmosAPI, address, denom) => async dispatch => {
    const response = await fetch(cosmosAPI.getUrl() + "/cdp/cdps/cdp/" + address + "/" + denom)
    const data = await response.json()
    if(data.result) {
        const cdp = data.result.value;
        console.log("cdp:", cdp); // TODO: remove this
        dispatch(setCdp(cdp));
    }
}

// ------------------------------------------
//              Actions: POST
// ------------------------------------------

export const postMsgDepositAsync = (cosmosAPI, owner, collateralDenom, collateralAmount) => async dispatch => {
    const sender = await cosmosAPI.getWalletAddress();
    if(!owner) { owner = sender; }  // Default to sender's CDP
    const collateral = Kava.utils.formatCoin(collateralAmount, collateralDenom);
    const msg = Kava.msg.newMsgDeposit(owner, sender, collateral);
    return dispatch(postTxAsync(cosmosAPI, msg));
}
  
export const postMsgWithdrawAsync = (cosmosAPI, owner, collateralDenom, collateralAmount) => async dispatch => {
    const sender = await cosmosAPI.getWalletAddress();
    if(!owner) { owner = sender; }  // Default to sender's CDP
    const collateral = Kava.utils.formatCoin(collateralAmount, collateralDenom);
    const msg = Kava.msg.newMsgWithdraw(owner, sender, collateral);
    return dispatch(postTxAsync(cosmosAPI, msg));
}

export const postMsgDrawDebtAsync = (cosmosAPI, cdpDenom, principalDenom, principalAmount) => async dispatch => {
    const owner = await cosmosAPI.getWalletAddress();
    const principal = Kava.utils.formatCoin(principalAmount, principalDenom);
    const msg = Kava.msg.newMsgDrawDebt(owner, cdpDenom, principal);
    return dispatch(postTxAsync(cosmosAPI, msg));
  }
  
export const postMsgRepayDebtAsync = (cosmosAPI, cdpDenom, principalDenom, principalAmount) => async dispatch => {
    const owner = await cosmosAPI.getWalletAddress();
    const principal = Kava.utils.formatCoin(principalAmount, principalDenom);
    const msg = Kava.msg.msgRepayDebt(owner, principal, cdpDenom);
    return dispatch(postTxAsync(cosmosAPI, msg));
}

// ------------------------------------------
//                 Selectors
// ------------------------------------------

export const selectAddress = state => state.cdp.address;
export const selectBalances = state => state.cdp.balances;
export const selectCdp = state => state.cdp.cdp;
export const selectPrice = state => state.cdp.price;

export default cdpSlice.reducer;
