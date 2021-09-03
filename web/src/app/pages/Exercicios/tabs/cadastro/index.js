import React, { useEffect } from 'react';
import { Grid, withStyles } from "@material-ui/core"
import Exercicios from './Exercicios';
import GruposMusculares from './GruposMusculares';
import Categorias from './Categorias';

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
        <Grid item md={6} xs={12}>
          <Categorias />
        </Grid>
        <Grid item md={6} xs={12}>
          <GruposMusculares />
        </Grid>
        <Grid item xs={12}>
          <Exercicios />
        </Grid>
      </Grid>
    </React.Fragment>
  )
}
export default withStyles(styles)(TabCadastro);