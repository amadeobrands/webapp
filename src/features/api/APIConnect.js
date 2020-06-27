import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab/';
import { TrendingFlat, AttachMoney } from '@material-ui/icons';
import { selectIsPosted } from './apiSlice';
import { Transfer } from './Transfer';
import { CreateCDP } from './CreateCDP';

export function APIConnect({ cosmosAPI }) {
  const [view, setView] = useState('transfer');
  const posted = useSelector(selectIsPosted);
  const handleChange = (event, nextView) => {
    setView(nextView);
  };

  let component;

  if(!posted) {
    switch(view) {
      case 'transfer':
        component = <Transfer cosmosAPI={cosmosAPI} />
        break;
      case 'createCDP':
        component = <CreateCDP cosmosAPI={cosmosAPI} />
        break;
      default:
        break;
    }
  } else {
    component = (
      <Box paddingTop={1}>
        <p>Tx sent</p>
      </Box>
    )
  }

  return (
    <Box>
      <ToggleButtonGroup orientation="horizontal" value={view} exclusive onChange={handleChange}>
      <ToggleButton value="transfer" aria-label="transfer">
        <TrendingFlat />
      </ToggleButton>
      <ToggleButton value="createCDP" aria-label="createCDP">
        <AttachMoney />
      </ToggleButton>
      </ToggleButtonGroup>
      {component}
    </Box>
  )
}
