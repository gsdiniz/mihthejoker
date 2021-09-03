import React, { useEffect, useState } from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, TextField, Tooltip, Typography } from "@material-ui/core"
import EditIcon from "@material-ui/icons/Edit"
import PlusOneIcon from "@material-ui/icons/PlusOne"

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  titleWrapper: {
    alignSelf: 'center',
  },
  title: {
    margin: theme.spacing(0),
  },
  plusIcon: {
    textAlign: 'end',
  }
}))

const emptyReg = {nome: ''}

const CrudDialog = (props) => {
  const { onCancel, onSave, onDelete, registro } = props
  const [inputValue, setInputValue] = useState('')

  const handlerEdit = (event) => {
    setInputValue(event.target.value)
  }

  const closeModal = (cb) => {
    if (cb) {
      cb()
    }
  }

  const handleOnDelete = async () => {
    const result = await onDelete(registro)
    if (result) {
      onCancel()
    }
  }

  const handleOnSave = async () => {
    let reg = registro ? registro : emptyReg
    const result = await onSave(Object.assign({...reg}, { nome: inputValue}))
    if (result) {
      onCancel()
    }
  }

  useEffect(() => {
    if (registro) {
      setInputValue(registro.nome)
    }
  }, [registro])

  return (
  <Dialog open={props.open}
    onExited={() => setInputValue('')}
    onClose={() => closeModal(onCancel)} aria-labelledby="form-dialog-title">
    <DialogTitle id="form-dialog-title">{props.titulo || 'Cadastrar'}</DialogTitle>
    <DialogContent>
      <DialogContentText>
        {props.descricao || ''}
      </DialogContentText>
      <TextField
        autoFocus
        margin="dense"
        id="name"
        onChange={(event) => handlerEdit(event)}
        label={props.labelInput || 'Informe um valor'}
        type="text"
        value={inputValue}
        fullWidth
      />
    </DialogContent>
    <DialogActions>
      {registro ?
      <Button onClick={() => handleOnDelete()} color="secondary">
        Deletar
      </Button> : null}
      <Button onClick={() => closeModal(onCancel)}>
        Cancelar
      </Button>
      <Button onClick={() => handleOnSave()} color="primary">
        Salvar
      </Button>
    </DialogActions>
  </Dialog>)
}

const SimpleCrud = (props) => {

  const classes = useStyles()
  const [crudDialogOpen, setCrudDialogOpen] = useState(false)
  const [registro, setRegistro] = useState(null)

  const handlerOnClickAddListItem = () => {
    setCrudDialogOpen(true)
  }

  const handlerOnClickEditListItem = (item) => {
    setRegistro(item)
    setCrudDialogOpen(true)
  }

  const handlerCloseModal = () => {
    setRegistro(null)
    setCrudDialogOpen(false)
  }

  const handerDeleteReg = (cb) => {
    setCrudDialogOpen(false)
    return cb(registro)
  }

  return (
    <React.Fragment>
      <CrudDialog open={crudDialogOpen}
        onSave={props.onSave}
        onCancel={() => handlerCloseModal()}
        onDelete={() => handerDeleteReg(props.onDelete)}
        titulo={registro ? 'Editar registro' :  'Cadastrar registro'}
        labelInput={'Informe um valor'}
        registro={registro} />
      <Grid container>
        <Grid item xs={8} className={classes.titleWrapper}>
          <Typography variant="body2" className={classes.title}>
            {props.titulo}
          </Typography>
        </Grid>
        <Grid item xs={4} className={classes.plusIcon}>
        <Tooltip title="Adicionar">
            <IconButton
              onClick={() => handlerOnClickAddListItem()}
              edge="end"
              aria-label="add">
              <PlusOneIcon />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid className={classes.demo} item xs={12}>
          <List style={{ maxHeight: props.maxHeight || '100px', overflow: 'auto', width: '100%' }} dense>
            {props.lista && props.lista.length > 0 ? props.lista.map((item, key) => {
              return (<ListItem key={key} button>
                <ListItemText
                  primary={`${item.nome}`}
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Editar">
                    <IconButton
                      onClick={() => handlerOnClickEditListItem(item)}
                      edge="end"
                      aria-label="edit">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>)
            }) : null}
          </List>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default (SimpleCrud)
