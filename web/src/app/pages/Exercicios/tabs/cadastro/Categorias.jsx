import React, { useState, useEffect, useCallback } from 'react';
import { Paper, makeStyles } from "@material-ui/core"
import SimpleCrud from '../../../../components/list/SimpleCrud';
import useFeedback from '../../../../hooks/useFeedback';
import useLoading from '../../../../hooks/loading/useLoading';
import { Categoria } from '../../../../api/exercicio'
import useApi from '../../../../hooks/api/useApi';

const useStyles = makeStyles (theme => ({
  paper: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2)
  }
}))

const Categorias = (props) => {
  const feedback = useFeedback()
  const loading = useLoading()
  const classes = useStyles()
  const [listaCategorias, setListaCategorias] = useState([])
  const [loadedLista, setLoadedLista] = useState(false)
  const CategoriaApi = useApi(new Categoria())

  const setStorageCategoria = (lista) => {sessionStorage.setItem('exerCategoria', lista ? JSON.stringify(lista) : [])}

  const loadCategorias = useCallback(async () => {
    const lista = await CategoriaApi.fetch('getAll')
    setListaCategorias(lista)
    setStorageCategoria(lista)
    loading.close()
  }, [loading, CategoriaApi])

  useEffect(() => {
    if (!loadedLista) {
      loading.open()
      setLoadedLista(true)
      loadCategorias()
    }
  }, [loadedLista, loading, setLoadedLista, loadCategorias])

  const post = async (registro) => {
    const reg =  await CategoriaApi.fetch('post', registro)
    setListaCategorias(listaCategorias.concat([reg]))
    setStorageCategoria(listaCategorias.concat([reg]))
    feedback.showSuccess('Categoria criada com sucesso')
  }

  const put = async (registro) => {
    const reg =  await CategoriaApi.fetch('put', registro)
    let idxSpĺice = false
    listaCategorias.forEach((cat, idx) => {
      if (cat._id === reg._id) {
        idxSpĺice = idx
      }
    })
    const atualLista = [...listaCategorias]
    atualLista.splice(idxSpĺice, 1, reg)
    setListaCategorias(atualLista)
    setStorageCategoria(atualLista)
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
      await CategoriaApi.fetch('delete', registro)
      let idxSpĺice = false
      listaCategorias.forEach((cat, idx) => {
        if (cat._id === registro._id) {
          idxSpĺice = idx
        }
      })
      const atualLista = [...listaCategorias]
      atualLista.splice(idxSpĺice, 1)
      setListaCategorias(atualLista)
      setStorageCategoria(atualLista)
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
        titulo="Categorias"
        onSave={onSave}
        onDelete={onDelete}
        lista={listaCategorias}
        maxHeight={'200px'}
      />
    </Paper>
  )
}
export default Categorias;