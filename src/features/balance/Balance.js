import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectKavaAmount, setKavaAmountAsync, selectIsLoaded} from './balanceSlice';

export function Balance() {
  const isLoaded = useSelector(selectIsLoaded);
  const kavaAmount = useSelector(selectKavaAmount);
  const dispatch = useDispatch();
  const [address, setAddress] = useState('');

  return (
    <div>
      <p>Enter Your Kava Address</p>
      <input
        value={address}
        onChange={e => setAddress(e.target.value)}
      />
      <button
        onClick={() => dispatch(setKavaAmountAsync(address))}
      >
        Get Balance
      </button>
    <br/>
    { isLoaded &&
        <span>{kavaAmount}</span>
    }
    </div>
  )
}
