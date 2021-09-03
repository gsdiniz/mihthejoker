import React from 'react';
import { AppBar, Grid, Tab, Tabs, Toolbar, Typography, withStyles } from "@material-ui/core"

const styles = (theme) => ({})

const Header = (props) => {
  const { classes, tabs } = props
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
              Exercícios
            </Typography>
          </Grid>
          {/* <Grid item>
            <Tooltip title="Ajuda">
              <IconButton color="inherit">
                <HelpIcon />
              </IconButton>
            </Tooltip>
          </Grid> */}
        </Grid>
      </Toolbar>
    </AppBar>
    { tabs && tabs.size > 0 ? 
    <AppBar
      component="div"
      className={classes.secondaryBar}
      color="primary"
      position="static"
      elevation={0}
    >
      <Tabs value={[...tabs.keys()].indexOf(props.tabSelected)} textColor="inherit">
        { 
          [...tabs.entries()].map(entry => (<Tab
             key={entry[0]}
             textColor="inherit"
             label={entry[1].name}
             onClick={() => props.onClickTab(entry[1].slug)}
             />))
        }
      </Tabs>
    </AppBar>
    : null }
    </React.Fragment>
  )
}
export default withStyles(styles)(Header);