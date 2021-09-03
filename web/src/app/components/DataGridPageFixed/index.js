import React, { useCallback, useEffect, useState } from 'react'
import { DataGrid } from '@material-ui/data-grid'
import { IconButton, makeStyles, Tooltip } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { Delete, Edit } from '@material-ui/icons';

const useStyles = makeStyles({
  root: {
    display: 'flex'
  },
});

function CustomPagination(props) {
  const { state, api } = props
  const classes = useStyles()

  return (
    <Pagination
      className={classes.root}
      color="primary"
      count={state.pagination.pageCount}
      page={state.pagination.page + 1}
      onChange={(event, value) => api.current.setPage(value - 1)}
    />
  );
}

function renderBotoesAcoes (params, onEdit, onDelete) {
  return (
    <span>
      <Tooltip title="Editar">
        <IconButton variant="contained" onClick={() => onEdit(params.row)}>
          <Edit />
        </IconButton>
      </Tooltip>
      <Tooltip title="Excluir">
        <IconButton  variant="contained" color="secondary" onClick={() => onDelete(params.row)}>
          <Delete />
        </IconButton>
      </Tooltip>
    </span>
  )
}

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
        renderCell: (params) => renderBotoesAcoes(params, onEditClick, onDeleteClick),
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
        Pagination: CustomPagination,
      }}
      selectionModel={exercicioSelecionado}
    />
  )
}

export default DataGridPageFixed
