import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab/';
import { TrendingFlat, AttachMoney } from '@material-ui/icons';

import { Loading } from '../common/Loading';
import { initApiAsync, selectIsLoaded, selectIsPosted} from './apiSlice';
import { Transfer } from './Transfer';
import { CreateCDP } from './CreateCDP';

export function APIConnect({ cosmosAPI }) {
  const dispatch = useDispatch();

  const [view, setView] = useState('transfer');

  const loaded = useSelector(selectIsLoaded);
  const posted = useSelector(selectIsPosted);

  const handleChange = (event, nextView) => {
    setView(nextView);
  };

  useEffect(() => {
    dispatch(initApiAsync(cosmosAPI));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let toggle;
  let component;
  switch(loaded) {
    case false:
        component = <Loading message="Initializing..."/>
        break
    case true:
        toggle = (
          <ToggleButtonGroup orientation="horizontal" value={view} exclusive onChange={handleChange}>
          <ToggleButton value="transfer" aria-label="transfer">
            <TrendingFlat />
          </ToggleButton>
          <ToggleButton value="createCDP" aria-label="createCDP">
            <AttachMoney />
          </ToggleButton>
          </ToggleButtonGroup>
        )
        if(!posted) {
          switch(view) {
            case 'transfer':
              component = <Transfer cosmosAPI={cosmosAPI} />
              break;
            case 'createCDP':
              component = <CreateCDP cosmosAPI={cosmosAPI} />
              break;
          }
        } else {
          component = (
            <Box paddingTop={1}>
              <p>Tx sent</p>
            </Box>
          )
        }
        break
      default:
        break
    }

  // Render
  return (
    <Box>
      {toggle}
      {component}
    </Box>
  )
}
