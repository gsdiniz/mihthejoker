import React, { useState } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import { Box, Paper, TextField, makeStyles, Grid, Button, Typography } from '@material-ui/core';
import useLoading from '../../hooks/loading/useLoading';
import useFeedback from '../../hooks/useFeedback';
import User from '../../api/User'

import './style.css'

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

const ResetPassword = (props) => {
    const history = useHistory();
    const location = useLocation()
    const classes = useStyles();
    const loading = useLoading();
    const feedback = useFeedback()
    const [resetPassword, setResetPassword] = useState({ password: '', passwordCheck: '' })

    const handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        loading.open()
        try {
            await UserApi.resetPassword(resetPassword, new URLSearchParams(location.search).get('token'))
            feedback.showSuccess('Senha redefinida com sucesso')
            history.push('/login')
        } catch (err) {
            let message = err.message;
            if (err.errors && err.errors.length) {
                message = ''
                err.errors.forEach((error, idx) => {
                    message += `${idx + 1} - ${error.msg}`
                });
            }
            feedback.showError(message)
        } finally {
            loading.close()
        }
        return false;
    }

    const backToLogin = async (event) => {
        event.preventDefault()
        event.stopPropagation()
        history.push('/login')
    }

    return (
        <React.Fragment>
            <Box id="form-login">
                <Paper elevation={1}>
                    <form method="post" onSubmit={handleSubmit} className={classes.form} autoComplete="off">
                        <Typography variant='h5' align={"center"} gutterBottom>Redefinição de senha</Typography>
                        <TextField label="Nova senha" autoComplete={''} type="password" value={resetPassword.password} onChange={(e) => setResetPassword({...resetPassword, password: e.target.value})} variant="outlined" required />
                        <TextField label="Confirme a nova senha" autoComplete={''} type="password" value={resetPassword.passwordCheck} onChange={(e) => setResetPassword({...resetPassword, passwordCheck: e.target.value})} variant="outlined" required />
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Button fullWidth variant="contained" type="submit" color="primary">Redefinir</Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Button 
                                onClick={backToLogin}
                                fullWidth
                                type="link"
                                component='span'
                                color="secondary"
                                >Cancelar</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Box>
        </React.Fragment>
    );
}

export default ResetPassword;