import React from 'react';
import { DialogTitle, DialogContent,  Dialog } from '@material-ui/core';

import FormRegister from './FormRegister';

function RegisterDialog (props) {
  const { open, onClose } = props

  const handleClose = (event, reason) => {
    if (reason === 'escapeKeyDown' || reason === 'backdropClick') {
        onClose()
    }
  }
  return (<Dialog
          onClose={handleClose}
          open={open}
          aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Formulário de cadastro</DialogTitle>
            <DialogContent>
                <FormRegister onClose={onClose} />
            </DialogContent>
      </Dialog>)
}

export default RegisterDialog
