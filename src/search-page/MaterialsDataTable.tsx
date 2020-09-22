import React from 'react';
import { useMaterialsSearch } from './MaterialsSearchProvider';
import DataTable from 'react-data-table-component';

interface Props {
  className: string
}

export const MaterialsDataTable: React.FC<Props> = (props) => {
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
      className={props.className}
      title="Materials"
      theme="material"
      columns={columns}
      data={state.results}
      selectableRows
      highlightOnHover
    />
  );
}
