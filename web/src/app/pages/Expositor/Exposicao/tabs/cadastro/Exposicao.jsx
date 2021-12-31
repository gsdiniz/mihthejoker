import React, { useCallback, useEffect, useState } from 'react';
import { Paper, Typography, makeStyles, Grid, IconButton, Tooltip } from "@material-ui/core"
import PlusOneIcon from "@material-ui/icons/PlusOne"
import useFeedback from "../../../../../hooks/useFeedback"
import useLoading from "../../../../../hooks/loading/useLoading"
import Confirm from "../../../../../components/Dialogs/Confirm"
import DataGrid from "../../../../../components/DataGridPageFixed"
import ExposicaoApi from "../../../../../api/Exposicao"
import useApi from "../../../../../hooks/api/useApi"
import UpsertDialog from './UpsertDialog';

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

const Exposicao = (props) => {
  const classes = useStyles()
  const feedback = useFeedback()
  const loading = useLoading()
  const api = useApi(ExposicaoApi)
  const [lista, setLista] = useState([])
  const colunas = [
    { field: 'nome', disableColumnMenu: true, disableClickEventBubbling: true, headerName: 'Nome', flex: 1 },
    { field: 'localidade', disableColumnMenu: true, disableClickEventBubbling: true, headerName: 'Local', flex: 1 },
  ]
  const [loadedLista, setLoadedLista] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [openUpsertDialog, setOpenUpsertDialog] = useState(false)
  const [exercicio, setExercicio] = useState(null)
  const [exclusao, setExclusao] = useState(null)
  const loadLista = useCallback(async () => {
    const listaBack = await api.fetch('getAll')
    setLista(listaBack.map(reg => {
      reg.id = reg._id
      return reg
    }))
    setLoadedLista(true)
  },[api])

  const openUpsertModal = () => {
    setExercicio(null)
    setOpenUpsertDialog(true)
  }

  const closeUpsertModal = () => {
    setExercicio(null)
    setOpenUpsertDialog(false)
  }

  const post = async (registro) => {
    await api.fetch('post', registro)
    await loadLista()
    feedback.showSuccess('Exposição inserido com sucesso')
  }

  const put = async (registro) => {
    await api.fetch('put', registro)
    await loadLista()
    feedback.showSuccess('Exposição alterado com sucesso')
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
      loadLista()
      loading.close()
    }
  }, [loadedLista, loadLista, loading])

  const handleEditar = (exercicio) => {
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
        await api.fetch('delete', exclusao)
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
              Minhas exposições
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
                acoes
                onEdit={handleEditar}
                onDelete={handleExcluir}
              />
          </Grid>
        </Grid>
      </Paper>
      <Confirm
        open={openConfirmDialog}
        titulo="Confirmar exclusão"
        onResponse={handleResposta}
        textoConfirmacao={`Atenção, deseja realmente excluir a exposição ${exclusao ? exclusao.nome : null}`}
       />
       <UpsertDialog 
        open={openUpsertDialog}
        onClose={closeUpsertModal}
        onSave={saveUpsert}
        exposicao={exercicio}
       />
    </React.Fragment>
  )
}
export default Exposicao;