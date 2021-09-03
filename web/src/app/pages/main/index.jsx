import React, { useEffect } from 'react';
import { withStyles } from '@material-ui/core';
import Page from '../../components/page'
import Header from './Header'
import BodyVisitante from '../Visitante/dashboard/Body';
import BodyExpositor from '../Expositor/dashboard/Body';

import useAuth from "../../hooks/auth/useAuth"
import roles from '../../utils/roles';


const styles = theme => ({})

const Main = (props) => {
    const user = useAuth().getUser()

    const Body = user.role === roles.EXPOSITOR ? BodyExpositor : BodyVisitante

    useEffect(() => {
        document.title = `Dashboard`;
        document.head.querySelector('meta[name=description]').content = 'Dashboard';
    }, [])

    return (
        <Page
          pageName="Dashboard"
          pageHeader={<Header />}
          pageBody={<Body />}
        />
    );
}

export default withStyles(styles)(Main);