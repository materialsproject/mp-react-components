import React from 'react';
import { useMaterialsSearch } from './MaterialsSearchProvider';
import DataTable from 'react-data-table-component';

export const MaterialsDataTable = () => {
  const { state, dispatch, getData } = useMaterialsSearch();
  const columns = [
    {
      name: 'Material Id',
      selector: 'task_id',
      sortable: true
    },
    {
      name: 'Formula',
      selector: 'formula_pretty',
      sortable: true
    },
    {
      name: 'Volume',
      selector: 'volume',
      sortable: true
    }
  ];
  return (
    <DataTable
      title="Materials"
      theme="material"
      columns={columns}
      data={state.results}
      selectableRows
      highlightOnHover
    />
  );
}
