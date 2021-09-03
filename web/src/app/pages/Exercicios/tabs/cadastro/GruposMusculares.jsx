import React, { useState, useEffect, useCallback } from 'react';
import { Paper, makeStyles } from "@material-ui/core"
import SimpleCrud from '../../../../components/list/SimpleCrud';
import useFeedback from '../../../../hooks/useFeedback';
import useLoading from '../../../../hooks/loading/useLoading';
import { GrupoMuscular } from '../../../../api/exercicio'
import useApi from '../../../../hooks/api/useApi';

const useStyles = makeStyles (theme => ({
  paper: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2)
  }
}))

const GruposMusculares = (props) => {
  const feedback = useFeedback()
  const loading = useLoading()
  const classes = useStyles()
  const [listaCategorias, setListaCategorias] = useState([])
  const [loadedLista, setLoadedLista] = useState(false)
  const GrupoMuscularApi = useApi(new GrupoMuscular())

  const setStorageGrpMuscular = (lista) => {sessionStorage.setItem('exerGrpMuscular', lista ? JSON.stringify(lista) : [])}

  const loadCategorias = useCallback(async () => {
    const lista = await GrupoMuscularApi.fetch('getAll')
    setListaCategorias(lista)
    setStorageGrpMuscular(lista)
    loading.close()
  }, [loading, GrupoMuscularApi])

  useEffect(() => {
    if (!loadedLista) {
      loading.open()
      setLoadedLista(true)
      loadCategorias()
    }
  }, [loadedLista, loading, setLoadedLista, loadCategorias])

  const post = async (registro) => {
    const reg =  await GrupoMuscularApi.fetch('post', registro)
    setListaCategorias(listaCategorias.concat([reg]))
    setStorageGrpMuscular(listaCategorias.concat([reg]))
    feedback.showSuccess('Categoria criada com sucesso')
  }

  const put = async (registro) => {
    const reg =  await GrupoMuscularApi.fetch('put', registro)
    let idxSpĺice = false
    listaCategorias.forEach((cat, idx) => {
      if (cat._id === reg._id) {
        idxSpĺice = idx
      }
    })
    const atualLista = [...listaCategorias]
    atualLista.splice(idxSpĺice, 1, reg)
    setListaCategorias(atualLista)
    setStorageGrpMuscular(atualLista)
    feedback.showSuccess('Categoria alterado com sucesso')
  }

  const onSave = async (registro) => {
    loading.open()
    try{
      if (registro._id) {
        await put(registro)
      } else {
        await post(registro)
      }
      return true
    } catch (err) {
      feedback.showError(err.message)
      return false
    } finally {
      loading.close()
    }
  }

  const onDelete = async (registro) => {
    loading.open()
    try{
      await GrupoMuscularApi.fetch('delete', registro)
      let idxSpĺice = false
      listaCategorias.forEach((cat, idx) => {
        if (cat._id === registro._id) {
          idxSpĺice = idx
        }
      })
      const atualLista = [...listaCategorias]
      atualLista.splice(idxSpĺice, 1)
      setListaCategorias(atualLista)
      setStorageGrpMuscular(atualLista)
      feedback.showSuccess('Categoria removido com sucesso')
      return true
    } catch (err) {
      feedback.showError(err.message)
      return false
    } finally {
      loading.close()
    }
  }

  return (
    <Paper className={classes.paper}>
      <SimpleCrud
        titulo="Grupos Musculares"
        onSave={onSave}
        onDelete={onDelete}
        lista={listaCategorias}
        maxHeight={'200px'}
      />
    </Paper>
  )
}
export default GruposMusculares;