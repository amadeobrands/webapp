import React from 'react';
import { Box, CircularProgress, Typography } from '@material-ui/core';

export function Loading({ message }) {
  return (
    <Box paddingTop={2}>
      <CircularProgress color="secondary" size={80}/>
      <Typography variant="h5" component="p" color="secondary">
        { message }
      </Typography>
    </Box>
  )
}
