import React, { useCallback, useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Page from '../../../../components/page'
import Header from './Header'
import Lista from './Lista';
import useApi from "../../../../hooks/api/useApi"
import Exposicao from '../../../../api/Exposicao';
import useLoading from '../../../../hooks/loading/useLoading';

const styles = theme => ({
  main: {
    padding: theme.spacing(6, 4),
  },
  paper: {
    maxWidth: 936,
    margin: 'auto',
    overflow: 'hidden',
  },
})

const Main = (props) => {
    const api = useApi(Exposicao)
    const loading = useLoading();
    const [expoLista, setExpoLista] = useState([])

    useEffect(() => {
      loading.open()
      api.fetch('visitar')
      .then(resp => {
        console.log(resp)
        setExpoLista(resp)
        loading.close()
      })
      .catch(err => {
        console.log(err)
        loading.close()
      })
    },[loading, api])

    return (
        <Page
          pageName="Exposições"
          pageHeader={
            <Header />
          }
          pageBody={
            <Lista exposicoes={expoLista} />
          }
        />
    );
}

export default withStyles(styles)(Main);