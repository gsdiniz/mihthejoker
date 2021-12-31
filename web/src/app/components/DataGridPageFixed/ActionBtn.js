import React from 'react'
import { IconButton, Tooltip } from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';


function ActionBtn (params, onEdit, onDelete) {
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
export default ActionBtn
