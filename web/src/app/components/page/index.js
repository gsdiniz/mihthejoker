import React, { useEffect } from 'react';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
  main: {
    margin: theme.spacing(2)
  },
  paper: {
    maxWidth: 936,
    margin: 'auto',
    overflow: 'hidden',
  },
})

const Page = (props) => {
    const { classes, pageName } = props
    useEffect(() => {
        document.title = `Personal App - ${pageName}`;
        document.head.querySelector('meta[name=description]').content = 'Personal App - ' + pageName;
    }, [pageName])

    return (
        <React.Fragment>
            {props.pageHeader}
            <article className={classes.main}>
              {props.pageBody}
            </article>
        </React.Fragment>
    );
}

export default withStyles(styles)(Page);