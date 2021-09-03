import React, { useState } from 'react'
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import LoadingContext from './LoadingContext';

const useStyles = makeStyles((theme) => ({
  backdropCss: {
      zIndex: 9999
  }
}));

const LoadingProvider = (props) => {
    const [showBackdrop, setShowBackdrop] = useState(false)
    const classes = useStyles();

    const open = () => setShowBackdrop(true)
    const close = () => setShowBackdrop(false)

    return (
      <LoadingContext.Provider 
          value={{
            open,
            close,
            current: showBackdrop
          }} >
          <Backdrop open={showBackdrop}  className={classes.backdropCss}>
            <CircularProgress color="inherit" />
          </Backdrop> 
          {props.children}
      </LoadingContext.Provider>
  )
}

export default LoadingProvider;