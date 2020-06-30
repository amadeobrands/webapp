// General imports
import React from 'react';

// Third party library imports
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button } from '@material-ui/core';

// ------------------------------------------
//                   Styles
// ------------------------------------------

const useStyles = makeStyles((theme) => ({
    collateralAmountText: {
        fontFamily: 'Arial',
        fontSize: 14,
        lineHeight: '0em',
        color: theme.palette.text.primary
        
    },
    usdAmountText: {
        fontFamily: 'Arial',
        fontSize: 12,
        lineHeight: '0em',
        color: theme.palette.text.secondary,
    },
    rowText: {
        fontFamily: 'Arial',
        fontSize: 16,
        lineHeight: '0em',
        color: theme.palette.text
    },
    buttonText: {
        fontFamily: 'Arial',
        fontSize: 14,
        lineHeight: '0em',
        color: theme.palette.text
    }
  }));

// ------------------------------------------
//                Functionality
// ------------------------------------------

var usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

// ------------------------------------------
//            RowButton Component
// ------------------------------------------

export function RowButton({ rowText, buttonText, denom, amount, price, displayUsdValue = true}) {
    const classes = useStyles();

    // Prepare displayed amount and USD value
    const roundedAmount = Number(amount).toFixed(4);
    const displayAmountText = roundedAmount.toString();
    const usdValue = usdFormatter.format(roundedAmount * price)
    const displayUsdValueText = usdValue.slice(1, usdValue.length);

    // Ensure denom is properly formatted
    denom = denom.toUpperCase();

    return(
        <Box width={450} paddingTop={0.2} paddingBottom={0.2} display="flex" flexDirection="horizontal"
            justifyContent="space-between" alignItems="center">
            <Box marginLeft={2} marginRight={1}>
                <p className={classes.rowText}>
                    {rowText}
                </p>
            </Box>
            <Box display="flex" flexDirection="horizontal" alignItems="center">
                {displayUsdValue ? 
                    (<Box display="flex" flexDirection="column" alignItems="flex-end" marginRight={1} marginLeft={1}>
                        <Box marginBottom={-1} marginTop={0}>
                            <p className={classes.collateralAmountText}>
                                {displayAmountText} {denom}
                            </p>
                        </Box>
                        <Box marginTop={-0.1} marginBottom={0}>
                            <p className={classes.usdAmountText}>
                                {displayUsdValueText} USD
                            </p>
                        </Box>
                    </Box>)
                    :
                    (<Box>
                        <p className={classes.collateralAmountText}>
                            {displayAmountText} {denom}
                        </p>
                    </Box>)
                }
                <Box marginRight={3} marginLeft={1}>
                    <Button
                        variant="contained"
                        color="default"
                        size="small"
                        fullWidth={true}
                        onClick={() => console.log(buttonText + " clicked!")}>
                            <p className={classes.buttonText}>
                                {buttonText}
                            </p>
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}