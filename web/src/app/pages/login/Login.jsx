import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Box, Paper, TextField, makeStyles, Grid, Button, Chip } from '@material-ui/core';
import useAuth from '../../hooks/auth/useAuth';
import useLoading from '../../hooks/loading/useLoading';
import User from '../../api/User'
import SenhaDialog from './SenhaDialog';

import './style.css'
import RegisterDialog from './RegisterDialog';

const UserApi = new User();
const useStyles = makeStyles((theme) => ({
    form: {
        padding: theme.spacing(2),
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(1),
            width: '100%'
        },
    }
}));

const Login = (props) => {
    const history = useHistory();
    const classes = useStyles();
    const loading = useLoading();
    const [login, setLogin] = useState({user: '', password: ''})
    const [msgError, setMsgError] = useState(null)
    const [openLostPasswordBox, setOpenLostPasswordBox] = useState(false)
    const [openRegisterBox, setOpenRegisterBox] = useState(false)
    
    const userAuth = useAuth()

    const loadProfile = async (userId) => {
        try {
            loading.open()
            const userProfile = await UserApi.getOne(userId)
            let isLoaded = false
            if (userProfile) {
                userAuth.setUser(userProfile)
                isLoaded = true
            }
            loading.close()
            return isLoaded
        } catch (err) {
            console.log(err)
            loading.close()
            return false
        }
    }

    useEffect(() => {
        document.title = `MihTheJoker 3D Tour - Login`;
        document.head.querySelector('meta[name=description]').content = 'Personal App';

        async function checkPayload() {
            loading.open()
            try {
                const userProfile = await UserApi.getOne(userAuth.getPayload().id)
                if (userProfile) {
                    userAuth.setUser(userProfile)
                    loading.close()
                    history.push('/dashboard')
                }
            } catch (err) {
                console.log(err)
                if ([401, 403].indexOf(err.code) > -1) {
                    await userAuth.refreshTokens()
                        .then(() => {
                            window.location.reload()
                        })
                        .catch(err => {
                            userAuth.clearTokens()
                            loading.close()
                        })
                }
            }
        }

        if (userAuth.getPayload()) {
            checkPayload()
        }

    }, [history, userAuth, loading])

    const handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        setMsgError(null)
        loading.open()
        const { ok, data, code } = await userAuth.login(login.user, login.password)
        if (ok) {
            userAuth.setTokens(data)
            loadProfile(userAuth.getPayload().id)
        } else {
            if ( code === 401 ) {
                setMsgError("Usuário/Senha inválidos")
            } else {
                setMsgError("Ocorreu um erro, tenta novamente")
            }
            
        }
        loading.close()
        return false;
    }

    

    return (
        <React.Fragment>
            <Box id="form-login">
                <Paper elevation={1}>
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            <Button fullWidth onClick={() => setOpenRegisterBox(true)}>Crie sua conta</Button>
                        </Grid>
                    </Grid>
                    <form method="post" onSubmit={handleSubmit} className={classes.form} autoComplete="off">
                        { msgError ? <Chip color="secondary" label={msgError} />: null }
                        <TextField label="Login" type="text" value={login.user} onChange={(e) => setLogin({...login, user: e.target.value})} variant="outlined" required />
                        <TextField label="Senha" type="password" value={login.password} onChange={(e) => setLogin({...login, password: e.target.value})} variant="outlined" required />
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Button fullWidth variant="contained" type="submit" color="primary">Entrar</Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Button 
                                    onClick={() => {setOpenLostPasswordBox(true); return false;}}
                                    fullWidth
                                    size="small"
                                    component='span'
                                    color="secondary"
                                >Esqueci a senha</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Box>
            <SenhaDialog open={openLostPasswordBox} onClose={() => setOpenLostPasswordBox(false)}/>
            <RegisterDialog open={openRegisterBox} onClose={() => setOpenRegisterBox(false)}/>
        </React.Fragment>
    );
}

export default Login;