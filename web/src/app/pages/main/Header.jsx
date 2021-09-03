import React from 'react';
import { AppBar, 
  Grid,
  makeStyles,
  Toolbar,
  Typography
  // Tooltip,
  // IconButton,
  // withStyles
} from "@material-ui/core"
// import HelpIcon from "@material-ui/icons/Help"
// import useAuth from '../../hooks/auth/useAuth';

import useAuth from "../../hooks/auth/useAuth"

const useClasses = makeStyles(theme => ({}))

const Header = (props) => {
  const classes = useClasses()
  const user = useAuth().getUser()

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
                Be welcome, {user.displayName}! 
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
    </React.Fragment>
  )
}
export default (Header);