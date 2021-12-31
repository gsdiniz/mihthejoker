import React from 'react';
import { AppBar, Grid, Toolbar, Typography, withStyles } from "@material-ui/core"

const styles = (theme) => ({})

const Header = (props) => {
  const { classes } = props
  return (
    <React.Fragment>
        <AppBar
      component="div"
      className={classes.secondaryBar}
      color="primary"
      position="static"
      elevation={0}
    >
      <Toolbar>
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs>
            <Typography color="inherit" variant="h5" component="h1">
              Exposição
            </Typography>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
    </React.Fragment>
  )
}
export default withStyles(styles)(Header);