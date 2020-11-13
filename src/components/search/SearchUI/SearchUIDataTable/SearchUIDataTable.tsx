import React, { useState } from 'react';
import { useSearchUIContext, useSearchUIContextActions } from '../SearchUIContextProvider';
import DataTable from 'react-data-table-component';
import { ActiveFilterButtons } from '../../../search/ActiveFilterButtons';
import NumberFormat from 'react-number-format';
import { FaAngleDown } from 'react-icons/fa';
import { Wrapper as MenuWrapper, Button, Menu, MenuItem } from 'react-aria-menubutton';

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

  const toggleColumn = (column) => {
    const newColumns = [...columns];
    const changedColumn = newColumns.find((col) => col.name === column.name);
    if (changedColumn) changedColumn.omit = !changedColumn.omit;
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

  const columnsMenu =
    <MenuWrapper 
      className='dropdown is-right is-active has-text-left'
      closeOnSelection={false}
    >
      <div className="dropdown-trigger">
        <Button className='button'>
          <span>Columns</span>
          <span className="icon"><FaAngleDown/></span>
        </Button>
      </div>
      <Menu className='dropdown-menu'>
        <ul className="dropdown-content">
          {columns.map((col, i) => (
            <MenuItem key={i}>
              <li className="dropdown-item">
                <label className="checkbox is-block">
                  <input
                    type="checkbox"
                    role="checkbox"
                    checked={!col.omit}
                    aria-checked={!col.omit}
                    /**
                     * Use key-up event to allow toggling with the space bar
                     * Must use key-up instead of key-down to prevent double-firing in Firefox
                     */
                    onKeyUp={(e) => {
                      e.preventDefault();
                      if (e.keyCode === 32) toggleColumn(col);
                    }}
                    onChange={(e) => toggleColumn(col)}
                  />
                  <span>{col.name}</span>
                </label>
              </li>
            </MenuItem>
          ))}
        </ul>
      </Menu>
    </MenuWrapper>;

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
          {columnsMenu}
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
