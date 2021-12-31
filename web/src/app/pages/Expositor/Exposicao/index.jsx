import React, { useState } from 'react';
import { withStyles } from '@material-ui/core';
import Header from './Header'
import TabCadastro from './tabs/cadastro'
import Page from '../../../components/page';

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

const tabs = new Map();
tabs.set('exercicios', { slug: 'exercicios', name: 'Cadastrar', reactObj: <TabCadastro /> })


const Main = (props) => {
    const [tabSelected, setTabSelected] = useState('exercicios')

    const onClickTabHandler = (slug) => setTabSelected(slug)

    return (
        <Page
          pageName="Cadastro de Exercícios"
          pageHeader={
            <Header
            onClickTab={onClickTabHandler}
            tabSelected={tabSelected}
            tabs={tabs} />
          }
          pageBody={
            tabs.get(tabSelected).reactObj
          }
        />
    );
}

export default withStyles(styles)(Main);