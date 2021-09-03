import React, { useCallback, useEffect, useState } from 'react';
import { Paper, Typography, makeStyles, Grid, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem, Chip, Input, useTheme, useMediaQuery, TextField } from "@material-ui/core"
import PlusOneIcon from "@material-ui/icons/PlusOne"
import ImageViewer from '../../../../components/ImageViewer';
import DataGrid from '../../../../components/DataGridPageFixed';
import Confirm from '../../../../components/Dialogs/Confirm';
import useFeedback from '../../../../hooks/useFeedback';
import useLoading from '../../../../hooks/loading/useLoading';
import useApi from '../../../../hooks/api/useApi';
import Exercicio from '../../../../api/exercicio';

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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

const UpsertDialog = (props) => {
  const registro = props.exercicio
  const listaGrpMuscular = JSON.parse(sessionStorage.getItem('exerGrpMuscular') || '[]')
  const listaCatMuscular = JSON.parse(sessionStorage.getItem('exerCategoria') || '[]')
  const classes = useStylesDialog()
  const [gruposSelecionaddos, setGruposSelecionaddos] = useState([])
  const [catSelecionaddos, setCatSelecionaddos] = useState('')
  const [arquivoSelecionado, setArquivoSelecionado] = useState(null)
  const [nomeExercicio, setNomeExercicio] = useState('')
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleFileChange = (e) => {
    setArquivoSelecionado(e.target.files)
  }

  const handleGrpChange = (event) => {
    setGruposSelecionaddos(event.target.value)
  };

  const handleCatChange = (event) => {
    setCatSelecionaddos(event.target.value)
  };

  const clearInput = () => {
    setGruposSelecionaddos([])
    setCatSelecionaddos([])
    setArquivoSelecionado(null)
    setNomeExercicio('')
  }

  const handleClose = () => {
    clearInput()
    props.onClose()
  }

  const handleSave = () => {
    let upsertReg = {
      nome: nomeExercicio,
      categoria: catSelecionaddos,
      grupoMuscular: gruposSelecionaddos,
      gif: arquivoSelecionado
    }
    if (registro) {
      upsertReg = Object.assign({...registro}, upsertReg)
    }

    props.onSave(upsertReg)
  }

  useEffect(() => {
    if (registro) {
      setNomeExercicio(registro.nome)
      
      if (registro.categoria) {
        setCatSelecionaddos(registro.categoria._id)
      }

      if (registro.grupoMuscular) {
        const arrGrp = []
        registro.grupoMuscular.forEach(grp => {
          arrGrp.push(grp._id)
        })
        setGruposSelecionaddos(arrGrp)
      }
    }
  }, [registro])

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth='lg'
      open={props.open}
      onExit={clearInput}
      onClose={handleClose}
      aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{registro ? `Editar exercício` : `Cadastrar exercicio`}</DialogTitle>
      <DialogContent>
        <form onSubmit={() => false}>
          <FormControl className={classes.formControl}>
            <InputLabel id="label-lista-categoria">Categoria</InputLabel>
            <Select
              required
              autoWidth
              labelId="label-lista-categoria"
              id="lista-categoria"
              value={catSelecionaddos}
              onChange={handleCatChange}
            >
              {listaCatMuscular && listaCatMuscular.map((cat) => (
                <MenuItem key={cat._id} value={cat._id} >
                  {cat.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="label-lista-grupos-musculares">Grupos Musculares</InputLabel>
            <Select
              required
              autoWidth
              labelId="label-lista-grupos-musculares"
              id="lista-grupos-musculares"
              multiple
              value={gruposSelecionaddos}
              onChange={handleGrpChange}
              input={<Input id="item-grupos-musculares" />}
              renderValue={(gruposSelecionaddos) => (
                <div className={classes.chips}>
                  {gruposSelecionaddos.map((_id) => {
                    const grupo = listaGrpMuscular.filter(reg => reg._id === _id)
                    return grupo.length > 0 ? (<Chip key={grupo[0]._id} label={grupo[0].nome} className={classes.chip} />) : null
                  })}
                </div>
              )}
              MenuProps={MenuProps}
            >
              {listaGrpMuscular && listaGrpMuscular.map((grupo) => (
                <MenuItem key={grupo._id} value={grupo._id} >
                  {grupo.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextField
              id="nome-exercicio"
              label="Nome"
              value={nomeExercicio}
              onChange={e => setNomeExercicio(e.target.value)}
              placeholder="Nome do exercicio"
              fullWidth
              required
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextField
              type='file'
              id="gif-exercicio"
              label="Animação do exercício"
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

const useStyles = makeStyles (theme => ({
  paper: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2)
  },
  titleWrapper: {
    alignSelf: 'center',
  },
  title: {
    margin: theme.spacing(0),
  },
  plusIcon: {
    textAlign: 'end',
  },
  dataGridMinHeight: {
    minHeight: '500px',
  },
  dataGridWrapper: {
    overflow: 'scroll',
    width: '100%'
  }
}))

const imageViewerRender = (params) => {
  const imgPath = params.row[params.field]
  return imgPath ? <ImageViewer src={`${imgPath}`} /> : null
}

const catNameGetter = (params) => params.row[params.field].nome

const grpMuscularNameGetter = (params) => {
  const grupos = params.row[params.field].map(grp => grp.nome)
  return grupos.join(', ')
}

const Exercicios = (props) => {
  const classes = useStyles()
  const feedback = useFeedback()
  const loading = useLoading()
  const ExercicioApi = useApi(new Exercicio())
  const [lista, setLista] = useState([])
  const colunas = [
    { field: 'gif', disableClickEventBubbling: true, renderCell: imageViewerRender, headerName: 'Gif', flex: 0.5 },
    { field: 'nome', disableClickEventBubbling: true, headerName: 'Nome', flex: 1 },
    { field: 'categoria', disableClickEventBubbling: true, valueGetter: catNameGetter, headerName: 'Categoria', flex: 1 },
    { field: 'grupoMuscular', disableClickEventBubbling: true, valueGetter: grpMuscularNameGetter, headerName: 'Grupo Muscular', flex: 1 }
  ]
  const [loadedLista, setLoadedLista] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [openUpsertDialog, setOpenUpsertDialog] = useState(false)
  const [exercicio, setExercicio] = useState(null)
  const [exclusao, setExclusao] = useState(null)
  const loadLista = useCallback(async () => {
    const lista = await ExercicioApi.fetch('getAll')
    setLista(lista.map(reg => {
      reg.id = reg._id
      return reg
    }))
  },[ExercicioApi])

  const openUpsertModal = () => {
    setExercicio(null)
    setOpenUpsertDialog(true)
  }

  const closeUpsertModal = () => {
    setExercicio(null)
    setOpenUpsertDialog(false)
  }

  const post = async (registro) => {
    await ExercicioApi.fetch('post', registro)
    await loadLista()
    feedback.showSuccess('Exercício inserido com sucesso')
  }

  const put = async (registro) => {
    await ExercicioApi.fetch('put', registro)
    await loadLista()
    feedback.showSuccess('Exercício alterado com sucesso')
  }

  const saveUpsert = async (registro) => {
    loading.open()
    try {
      if (registro._id) {
        await put(registro)
      } else {
        await post(registro)
      }
      closeUpsertModal()
      setExercicio(null)
    } catch (err) {
      feedback.showError(err.message)
    } finally {
      loading.close()
    }
  }

  useEffect(() => {
    if (!loadedLista) {
      loading.open()
      setLoadedLista(true)
      loadLista()
      loading.close()
    }
  }, [loadedLista, loadLista, loading])

  const handleEditar = async (exercicio) => {
    setExercicio(exercicio)
    setOpenUpsertDialog(true)
  }

  const handleExcluir = (exercicio) => {
    setExclusao(exercicio)
    setOpenConfirmDialog(true)
  }

  const handleResposta = async (resposta)  => {
    if (resposta) {
      try {
        loading.open()
        await ExercicioApi.fetch('delete', exclusao)
        await loadLista()
      } catch (err) {
        feedback.showError(err.message)
      } finally {
        loading.close()
      }
    }
    setExclusao(null)
    setOpenConfirmDialog(false)
  }

  return (
    <React.Fragment>
      <Paper className={classes.paper}>
        <Grid container>
          <Grid item xs={11} className={classes.titleWrapper}>
            <Typography variant="h6" className={classes.title}>
              Exercicíos
            </Typography>
          </Grid>
          <Grid item xs={1} className={classes.plusIcon}>
            <Tooltip title='Adicionar'>
              <IconButton
                onClick={() => openUpsertModal()}
                edge="end"
                aria-label="add">
                <PlusOneIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs={12} className={classes.dataGridMinHeight}>
              <DataGrid 
                lista={lista}
                colunas={colunas}
                onEdit={handleEditar}
                onDelete={handleExcluir}
                acoes
              />
          </Grid>
        </Grid>
      </Paper>
      <Confirm
        open={openConfirmDialog}
        titulo="Confirmar exclusão"
        onResponse={handleResposta}
        textoConfirmacao={`Atenção, deseja realmente excluir o exercício ${exclusao ? exclusao.nome : null}`}
       />
       <UpsertDialog 
        open={openUpsertDialog}
        onClose={closeUpsertModal}
        onSave={saveUpsert}
        exercicio={exercicio}
       />
    </React.Fragment>
  )
}
export default Exercicios;