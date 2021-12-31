import React, { Fragment, useMemo, useState } from 'react'
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

    const value = useMemo(() => ({
      open,
      close
    }), [])

    return (
      <LoadingContext.Provider 
          value={value} >
          <Fragment>
            {props.children}
            <Backdrop open={showBackdrop}  className={classes.backdropCss}>
              <CircularProgress color="inherit" />
            </Backdrop> 
          </Fragment>
      </LoadingContext.Provider>
  )
}

export default LoadingProvider;