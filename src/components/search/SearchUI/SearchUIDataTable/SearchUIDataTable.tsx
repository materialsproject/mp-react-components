import React, { useState } from 'react';
import { useSearchUIContext, useSearchUIContextActions } from '../SearchUIContextProvider';
import DataTable from 'react-data-table-component';
import { ActiveFilterButtons } from '../../../search/ActiveFilterButtons';
import NumberFormat from 'react-number-format';

/**
 * Component for rendering data returned within a SearchUI component
 * Table data and interactions are hooked up to the SearchUIContext state and actions
 */

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

  const handleSort = (column, sortDirection) => {
    return;
  };

  const TableHeader = () => {
    if (state.loading) {
      return <p className="title is-4 mb-3">Searching materials...</p>;
    } else {
      return (
        <p className="title is-4 mb-3">
          <NumberFormat value={state.totalResults} displayType={'text'} thousandSeparator={true} />
          {`${state.totalResults === 1 ? ' material matches' : ' materials match'} your search`}
        </p>
      );
    }
  };

  return (
    <div className={props.className}>
      <TableHeader />
      <ActiveFilterButtons
        filters={state.activeFilters}
        onClick={(v, id) => actions.setFilterValue(v, id)}
      />
      <DataTable
        noHeader
        theme="material"
        columns={state.columns}
        data={state.results}
        selectableRows
        highlightOnHover
        pagination
        paginationServer
        sortServer
        onSort={handleSort}
        sortIcon={<span></span>}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePerRowsChange}
        progressPending={state.loading}
        paginationTotalRows={state.totalResults}
        paginationPerPage={state.resultsPerPage}
        progressComponent={
          <progress className="progress is-small is-primary mt-3" max="100">
            15%
          </progress>
        }
      />
    </div>
  );
};
