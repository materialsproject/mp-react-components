import React, { useState } from 'react';
import { useSearchUIContext, useSearchUIContextActions } from '../context/SearchUIContextProvider';
import DataTable from 'react-data-table-component';
import { ActiveFilterButtons } from '~/components/search/ActiveFilterButtons';

interface Props {
  className?: string;
}

export const SearchUIDataTable: React.FC<Props> = props => {
  const state = useSearchUIContext();
  const actions = useSearchUIContextActions();

  const handlePageChange = (page: number) => {
    actions.setPage(page);
  };

  const handlePerRowsChange = (perPage: number) => {
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
