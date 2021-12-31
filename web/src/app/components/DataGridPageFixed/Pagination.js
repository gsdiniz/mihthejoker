import React from 'react'
import { makeStyles } from '@material-ui/core';
import { useGridSlotComponentProps } from '@material-ui/data-grid'
import { Pagination as MUIPagination } from '@material-ui/lab';

const useStyles = makeStyles({
  root: {
    display: 'flex'
  },
});

const Pagination = () => {
  const { state, apiRef } = useGridSlotComponentProps();
  const classes = useStyles();

  return (
    <MUIPagination
      className={classes.root}
      color="primary"
      count={state.pagination.pageCount}
      page={state.pagination.page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}

export default Pagination
