import React, { useEffect } from 'react';
import { Grid, withStyles } from "@material-ui/core"
import Exposicao from './Exposicao';

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2)
  }
})

const TabCadastro = (props) => {

  useEffect(() => {
    sessionStorage.setItem('exerCategoria', [])
    sessionStorage.setItem('exerGrpMuscular', [])
  }, [])

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Exposicao />
        </Grid>
      </Grid>
    </React.Fragment>
  )
}
export default withStyles(styles)(TabCadastro);