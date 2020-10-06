import React, { useState } from 'react';
import { useMaterialsSearch, useMaterialsSearchContextActions } from './MaterialsSearchProvider';
import DataTable from 'react-data-table-component';
import { ActiveFilterButtons } from './ActiveFilterButtons';

interface Props {
  className?: string;
}

export const MaterialsDataTable: React.FC<Props> = props => {
  // const { state, actions } = useMaterialsSearch();
  const state = useMaterialsSearch();
  const actions = useMaterialsSearchContextActions();

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
      sortable: true,
      format: (row: any) => row.volume.toFixed(2)
    },
    {
      name: 'Density',
      selector: 'density',
      sortable: true,
      format: (row: any) => row.density.toFixed(2)
    }
  ];

  const handlePageChange = async (page: number) => {
    actions.setPage(page);
  };

  const handlePerRowsChange = async (perPage: number) => {
    actions.setResultsPerPage(perPage);
  };

  return (
    <div className={props.className}>
      <DataTable
        title={
          <ActiveFilterButtons
            filters={state.activeFilters}
            onClick={(v, id) => actions.setFilterValue(v, id)}
          />
        }
        theme="material"
        columns={columns}
        data={state.results}
        selectableRows
        highlightOnHover
        pagination
        paginationServer
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePerRowsChange}
        progressPending={state.loading}
        paginationTotalRows={state.totalResults}
        paginationPerPage={state.resultsPerPage}
        progressComponent={
          <progress className="progress is-small is-primary" max="100">
            15%
          </progress>
        }
      />
    </div>
  );
};
