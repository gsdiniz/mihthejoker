import React, { useCallback, useEffect, useState } from 'react'
import { DataGrid } from '@material-ui/data-grid'
import ActionBtn from './ActionBtn'
import Pagination from './Pagination'
import NoRows from './NoRows'

const DataGridPageFixed = (props) => {
  const [exercicioSelecionado, setExercicioSelecionado] = useState([])
  const [colunaAcoesAdd, setColunaAcoesAdd] = useState(false)
  const [colunasComOpts, setColunasComOpts] = useState(props.colunas)
  const { lista, colunas, acoes, onEdit, onDelete } = props

  const onEditClick = useCallback((row) => onEdit(row), [onEdit])
  const onDeleteClick = useCallback((row) => onDelete(row), [onDelete])

  useEffect(() => {
    if (acoes && !colunaAcoesAdd) {
      setColunasComOpts([...colunas, {
        field: 'acoes',
        headerAlign: 'center',
        disableClickEventBubbling: true,
        headerName: 'Ações',
        renderCell: (params) => ActionBtn(params, onEditClick, onDeleteClick),
        sortComparator: () => 0
      }])
      setColunaAcoesAdd(true)
    }
  }, [acoes, colunas, onDeleteClick, onEditClick, colunaAcoesAdd])

  return (
    <DataGrid
      rows={lista}
      columns={colunasComOpts}
      hideFooterSelectedRowCount
      pagination
      pageSize={20}
      onSelectionModelChange={(newSelection) => {
        setExercicioSelecionado(newSelection.selectionModel);
      }}
      components={{
        Pagination: Pagination,
        NoRowsOverlay: NoRows
      }}
      selectionModel={exercicioSelecionado}
    />
  )
}

export default DataGridPageFixed
