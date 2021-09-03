import React, { useState } from 'react';
import {TextField, RadioGroup, Radio, FormControlLabel, FormControl, Button, Grid} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import LoginApi from '../../api/Login'
import useFeedback from '../../hooks/useFeedback';
import useLoading from '../../hooks/loading/useLoading';

const loginApi = new LoginApi();

const useStyles = makeStyles((theme) => ({
  root: {
    '& > .MuiFormControl-root': {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    }
  },
}))

const FormRegister = (props) => {

  const classes = useStyles()

  const [errors, setErrors] = useState({})
  const [displayName, setNomeExibicao] = useState("")
  const [email, setEmail] = useState("")
  const [password, setSenha] = useState("")
  const [senhaConfirmacao, setConfirmacao] = useState("")
  const [tpPerfil, setTpPerfil] = useState("0")

  const feedback = useFeedback()
  const loading = useLoading()

  const handleTpPerfilSelect = (event) => {
    setTpPerfil(event.target.value)
  }

  const handleRegister = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    loading.open()
    try {
      if (validateForm()) {
        await loginApi.register({
          displayName,
          email,
          password,
          role: tpPerfil,
        });
        feedback.showInfo(`Usuário registrado com sucesso, faça login com e-mail e senha informados`)
        props.onClose()
      }
    } catch (err) {
      feedback.showError(err.message)
    } finally {
      loading.close()
    }
  }

  const validateForm = () => {
    let validation = true
    let errorsTmp = {}
    setErrors(errorsTmp)

    if (displayName.length < 3) {
      validation = false
      errorsTmp.displayName = "Nome de exibição não informado ou inválido"
    }

    if (email.length < 3 || !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
      validation = false
      errorsTmp.email = "E-mail não informado ou inválido"
    }

    if (!/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])[a-zA-Z0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,}$/.test(password)) {
      validation = false
      errorsTmp.password = "Senha não confere com padrão"
    }

    if (password !== senhaConfirmacao) {
      validation = false
      errorsTmp.senhaConfirmacao = "Confirmação divergente de senha"
    }

    setErrors(errorsTmp)
    return validation
  }

  return (
    <form onSubmit={handleRegister} className={classes.root} autoComplete="off">
      <FormControl fullWidth>
        <TextField label="Nome de exibição"
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          onChange={event => setNomeExibicao(event.target.value)}
          error={errors.hasOwnProperty('displayName')}
          helperText={errors.hasOwnProperty('displayName') ? errors.displayName : null}
          value={displayName}
        />
      </FormControl>

      <FormControl fullWidth>
        <TextField label="E-mail"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={event => setEmail(event.target.value)}
          fullWidth
          type="email"
          error={errors.hasOwnProperty('email')}
          helperText={errors.hasOwnProperty('email') ? errors.email : null}
          value={email}
        />
      </FormControl>

      {/* <FormControl fullWidth>
        <TextField label="CPF"
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={
            {
              pattern: "[0-9]{11}",
              title: 'Informe o CPF, apenas dígitos'
            }
          }
          onChange={event => setCPF(event.target.value)}
          fullWidth
          type="text"
          error={errors.hasOwnProperty('cpf')}
          helperText={errors.hasOwnProperty('cpf') ? errors.cpf : null}
          value={cpf}
        />
      </FormControl> */}

      <Grid container spacing={1} justifyContent="flex-end">
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField label="Senha"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={event => setSenha(event.target.value)}
              type="password"
              error={errors.hasOwnProperty('password')}
              helperText={errors.hasOwnProperty('password') ? errors.password : null}
              value={password}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField label="Confirmação de Senha"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={event => setConfirmacao(event.target.value)}
              type="password"
              error={errors.hasOwnProperty('senhaConfirmacao')}
              helperText={errors.hasOwnProperty('senhaConfirmacao') ? errors.senhaConfirmacao : null}
              value={senhaConfirmacao}
            />
          </FormControl>
        </Grid>
      </Grid>

      <FormControl fullWidth>
        <RadioGroup row aria-label="tipoPerfil" name="tipoPerfil" value={tpPerfil} onChange={handleTpPerfilSelect} >
          <FormControlLabel
            value="0"
            control={<Radio />}
            label="Visitante"
            labelPlacement="end"
          />
          <FormControlLabel
            value="1"
            control={<Radio />}
            label="Expositor"
            labelPlacement="end"
          />
        </RadioGroup>
      </FormControl>
      
      <Grid container spacing={1} justifyContent="flex-end">
          <Grid item>
            <Button onClick={props.onClose}>
              Cancelar
            </Button>
          </Grid>
          <Grid item>
            <Button type="submit" variant="outlined" color="primary">
              Cadastrar
            </Button>
          </Grid>
      </Grid>
    </form>
  )
}

export default FormRegister
