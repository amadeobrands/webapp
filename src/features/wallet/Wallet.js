// General imports
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Third party library imports
import { Box, Button, Table, TableHead, TableContainer, TableBody, TableRow, TableCell, Paper } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
// Local imports
import { setAddressAsync, setBalancesAsync, setPriceAsync,
    selectAddress, selectBalances, selectPrice } from './walletSlice';

// ------------------------------------------
//                   Styles
// ------------------------------------------

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    ledgerIcon: {
        color: "#32CD32",
        paddingRight: 8,
        paddingLeft: 8,
        fontSize: 14,  /* icon size */
    },
    titleText: {
        fontSize: 16
    }
  }));

  const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.common.black,
      padding: 6,
    },
    body: {
      fontSize: 14,
      padding: 10,
    },
  }))(TableCell);
  
  const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
        padding: 12,
      },
    },
  }))(TableRow);

// ------------------------------------------
//                Functionality
// ------------------------------------------

var usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
  
function createData(assetDenom, balances, price) {
    const coin = balances.find(asset => asset.denom === assetDenom);
    let balance
    if(!coin) {
        balance = 0;
    } else {
        balance = coin.amount;
    }

    const usdValue = usdFormatter.format(balance * price)
    const displayDenom = assetDenom.toUpperCase();
 
    return { 
        assetDenom: displayDenom,
        balance: balance,
        usdValue: usdValue,
    };
}

// ------------------------------------------
//            Wallet Component
// ------------------------------------------

export function Wallet({ cosmosAPI }) {
    const classes = useStyles();
    const dispatch = useDispatch();

    // State
    let [collateralDenom, setCollateralDenom] = useState('bnb');
    let [principalDenom, setPrincipalDenom] = useState('usdx');

    // Selectors
    let balances = useSelector(selectBalances);
    let price = useSelector(selectPrice);
    let address = useSelector(selectAddress);

    // Effects
    useEffect(() => {
        dispatch(setAddressAsync(cosmosAPI));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        dispatch(setBalancesAsync(cosmosAPI, address));
        dispatch(setPriceAsync(cosmosAPI, collateralDenom));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address]);

    // Splice address for display
    const addrDisplayCharCount = 6
    let prefixChars = address.slice(0, addrDisplayCharCount);
    let suffixChars = address.slice(address.length-(addrDisplayCharCount), address.length);
    let displayAddr = [prefixChars, '...', suffixChars].join('');

    const rows = [
        createData(principalDenom, balances, 1),
        createData(collateralDenom, balances, price),
    ];

    // Render
    return (
        <Box paddingTop='1rem'>
            <Box border={1} borderRadius={5} borderColor={"#D3D3D3"}>
                <Box display="flex" flexDirection="horizontal" width={400} height={30}
                    justifyContent="space-between" alignItems="center"
                    borderBottom={1} borderBottomStyle={{color: "#D3D3D3"}}>
                    <Box display="flex" flexDirection="horizontal" alignItems="center">
                        <FiberManualRecordIcon className={classes.ledgerIcon}/>
                        <p> Ledger </p>
                    </Box>
                    <Box paddingRight={1.5} paddingLeft={0}>
                        <p>
                            {address ? displayAddr : null}    
                        </p> 
                    </Box>
                </Box>
                <Box>
                    <p className={classes.titleText}>
                        Wallet Balances
                    </p>   
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                            <StyledTableRow>
                                <StyledTableCell align="right">Asset</StyledTableCell>
                                <StyledTableCell align="right">Balance</StyledTableCell>
                                <StyledTableCell align="right">USD</StyledTableCell>
                                <StyledTableCell />
                            </StyledTableRow>
                            </TableHead>
                            <TableBody>
                            {rows.map((row) => (
                                <StyledTableRow key={row.name} alignItems="center">
                                    <StyledTableCell align="right">{row.assetDenom}</StyledTableCell>
                                    <StyledTableCell align="right">{row.balance}</StyledTableCell>
                                    <StyledTableCell align="right">{row.usdValue}</StyledTableCell>
                                    {row.assetDenom !== principalDenom.toUpperCase() ?
                                        (<Box marginTop={0.5}>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                size="small"
                                                fullWidth={false}
                                                onClick={() => console.log("Load clicked!")}>
                                                Load
                                            </Button>
                                        </Box>)
                                        :
                                        (<StyledTableCell/>)
                                    }
                                </StyledTableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </Box>
    )
}
