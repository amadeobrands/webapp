import React from 'react';
import logo from './logo.svg';
import { Balance } from './features/balance/Balance';
import './App.css';

function App() {
  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <Balance />
    </div>
  );
}

export default App;
