import React, { useState } from 'react';
import {
  useMaterialsSearchContext,
  useMaterialsSearchContextActions
} from './MaterialsSearchProvider';
import DataTable from 'react-data-table-component';
import { ActiveFilterButtons } from './ActiveFilterButtons';

interface Props {
  className?: string;
}

export const MaterialsDataTable: React.FC<Props> = props => {
  // const { state, actions } = useMaterialsSearch();
  const state = useMaterialsSearchContext();
  const actions = useMaterialsSearchContextActions();

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
        columns={state.columns}
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
