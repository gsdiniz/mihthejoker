import React, { useState } from 'react';
import { TextField, Button, DialogTitle, DialogContent, DialogContentText, DialogActions, Dialog } from '@material-ui/core';
import useFeedback from '../../hooks/useFeedback';
import useLoading from '../../hooks/loading/useLoading';

import User from '../../api/User'
const UserApi = new User();

function SenhaDialog (props) {
  const { open, onClose } = props
  const [emailToReset, setEmailToReset] = useState('')
  const feedback = useFeedback()
  const loading = useLoading()


  const handleReset = async (event) => {
      event.preventDefault();
      event.stopPropagation();
      loading.open()
      try {
          const resposta = await UserApi.forgetPassword(emailToReset);
          feedback.showInfo(resposta.mensagem)
          onClose()
      } catch (err) {
          feedback.showError(err.message)
      } finally {
          loading.close()
      }
  }
  return (<Dialog
          TransitionProps = {
            {
              onExited : () => setEmailToReset('')
            }
          }
          open={open}
          aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Esqueci minha senha</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Informe o e-mail cadastrado para receber um e-mail com link para resetar a senha
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    onChange={(event) => setEmailToReset(event.target.value)}
                    label="E-mail"
                    type="text"
                    value={emailToReset}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    Cancelar
                </Button>
                <Button onClick={handleReset} color="primary">
                    Resetar senha
                </Button>
            </DialogActions>
      </Dialog>)
}

export default SenhaDialog
