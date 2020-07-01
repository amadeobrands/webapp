// General imports
import React from 'react';

// Third party library imports
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';

// ------------------------------------------
//                   Styles
// ------------------------------------------

const useStyles = makeStyles((theme) => ({
    displayValue: {
        fontFamily: 'Arial',
        fontSize: 14,
        lineHeight: '0em',
        color: theme.palette.text.primary
    },
    rowText: {
        fontFamily: 'Arial',
        fontSize: 16,
        lineHeight: '0em',
        color: theme.palette.text
    },
  }));

// ------------------------------------------
//                Functionality
// ------------------------------------------

var usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

// ------------------------------------------
//               Row Component
// ------------------------------------------

export function Row({ rowText, value, valueTextSuffix }) {
    const classes = useStyles();

    if(valueTextSuffix.toLowerCase().includes("usd")) {
        const usdValue = usdFormatter.format(value);
        value = usdValue.slice(1, usdValue.length);
    }
    let displayValue = [value, valueTextSuffix].join('');

    return(
        <Box width={450} paddingTop={0.2} paddingBottom={0.2} display="flex" flexDirection="horizontal"
            justifyContent="space-between" alignItems="center">
            <Box marginLeft={2} marginRight={1}>
                <p className={classes.rowText}>
                    {rowText}
                </p>
            </Box>
            <Box marginLeft={1} marginRight={2}>
                <p className={classes.displayValue}>
                    {displayValue}
                </p>
            </Box>
        </Box>
    )
}