import React, { useState } from 'react';
import { useSearchUIContext, useSearchUIContextActions } from '../SearchUIContextProvider';
import DataTable from 'react-data-table-component';
import { ActiveFilterButtons } from '../../../search/ActiveFilterButtons';
import NumberFormat from 'react-number-format';
import { Dropdown } from '../../Dropdown';
import { FaAngleDown } from 'react-icons/fa';

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
  const [columns, setColumns] = useState(state.columns);

  const handlePageChange = (page: number) => {
    actions.setPage(page);
  };

  const handlePerRowsChange = (perPage: number) => {
    actions.setResultsPerPage(perPage);
  };

  const handleSort = (column, sortDirection) => {
    return;
  };

  const toggleColumn = (checked, column) => {
    const newColumns = [...columns];
    const changedColumn = newColumns.find((col) => col.name === column.name);
    if (changedColumn) changedColumn.omit = !checked;
    setColumns(newColumns);
  };

  const TableHeaderTitle = () => {
    if (state.activeFilters.length === 0 && state.totalResults > 0 && !state.loading) {
      return (
        <p className="title is-4">
          All <NumberFormat value={state.totalResults} displayType={'text'} thousandSeparator={true} /> materials
        </p>
      );
    } else if (state.activeFilters.length > 1 || state.activeFilters.length === 1 && !state.loading) {
      return (
        <p className="title is-4">
            <NumberFormat value={state.totalResults} displayType={'text'} thousandSeparator={true} />
            {`${state.totalResults === 1 ? ' material matches' : ' materials match'} your search`}
        </p>
      );
    } else {
      return (
        <p className="title is-4">Loading materials...</p>
      );
    }
  };

  return (
    <div className={props.className}>
      <div className="columns mb-0">
        <div className="column is-narrow pb-0">
          <TableHeaderTitle />
        </div>
        {state.loading &&
          <div className="column pb-0 progress-container">
            <progress className="progress is-small is-primary" max="100"></progress>
          </div>
        }
        <div className="column pb-0 has-text-right">
          <Dropdown
            trigger={
              <button className="button">
                <span>Columns</span>
                <span className="icon"><FaAngleDown/></span>
              </button>
            }
            hideOnLinkClick={false}
            isAnimated={false}
            className="is-right"
          >
            {columns.map((col, i) => (
              <a href="#" className="dropdown-item" key={i}>
                <label className="checkbox is-block">
                  <input
                    type="checkbox"
                    checked={!col.omit}
                    onChange={(e) => toggleColumn(e.target.checked, col)}
                  />
                  <span>{col.name}</span>
                </label>
              </a>
            ))}
          </Dropdown>
        </div>
      </div>
      <ActiveFilterButtons
        filters={state.activeFilters}
        onClick={(v, id) => actions.setFilterValue(v, id)}
      />
      <DataTable
        noHeader
        theme="material"
        columns={columns}
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
        paginationTotalRows={state.totalResults}
        paginationPerPage={state.resultsPerPage}
      />
    </div>
  );
};
