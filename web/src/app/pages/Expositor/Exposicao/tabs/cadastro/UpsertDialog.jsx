import React, { useEffect, useState } from 'react';
import { makeStyles, Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, useTheme, useMediaQuery, TextField } from "@material-ui/core"

const useStylesDialog = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    width: '100%'
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}))

const UpsertDialog = (props) => {
  const registro = props.exposicao
  const classes = useStylesDialog()
  const [arquivoSelecionado, setArquivoSelecionado] = useState(null)
  const [nomeExpo, setNomeExpo] = useState('')
  const [localExpo, setLocalExpo] = useState('')
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleFileChange = (e) => {
    setArquivoSelecionado(e.target.files[0])
  }

  const clearInput = () => {
    setArquivoSelecionado(null)
    setNomeExpo('')
    setLocalExpo('')
  }

  const handleClose = () => {
    clearInput()
    props.onClose()
  }

  const handleSave = () => {
    let upsertReg = {
      nome: nomeExpo,
      localidade: localExpo,
      video: arquivoSelecionado
    }
    if (registro) {
      upsertReg = Object.assign({ ...registro }, upsertReg, { expositor: registro.expositor._id })
    }

    props.onSave(upsertReg)
  }

  useEffect(() => {
    if (registro) {
      setNomeExpo(registro.nome)
      setLocalExpo(registro.localidade)
    }
  }, [registro])

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth='lg'
      open={props.open}
      TransitionProps = {
        {
          onExited : handleClose
        }
      }
      aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{`${registro ? `Editar` : `Cadastrar`} Exposição`}</DialogTitle>
      <DialogContent>
        <form onSubmit={() => false}>
          <FormControl className={classes.formControl}>
            <TextField
              id="nome-expo"
              label="Nome"
              value={nomeExpo}
              onChange={e => setNomeExpo(e.target.value)}
              placeholder="Exposição XPTO"
              fullWidth
              required
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextField
              id="local-expo"
              label="Local"
              value={localExpo}
              onChange={e => setLocalExpo(e.target.value)}
              placeholder="Rua XPTO"
              fullWidth
              required
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextField
              type='file'
              id="video-expo"
              label="Exposição"
              fullWidth
              onChange={handleFileChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} >
          Cancelar
        </Button>
        <Button onClick={handleSave} color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UpsertDialog;