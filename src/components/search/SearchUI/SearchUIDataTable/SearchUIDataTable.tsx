import React, { useEffect, useState } from 'react';
import { useSearchUIContext, useSearchUIContextActions } from '../SearchUIContextProvider';
import DataTable from 'react-data-table-component';
import { ActiveFilterButtons } from '../../../search/ActiveFilterButtons';
import NumberFormat from 'react-number-format';
import { FaAngleDown, FaCaretDown } from 'react-icons/fa';
import { Wrapper as MenuWrapper, Button, Menu, MenuItem } from 'react-aria-menubutton';
import { Paginator } from '../../Paginator';
import classNames from 'classnames';
import { pluralize } from '../../utils';

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
  // const [resultsPerPage, setResultsPerPage] = useState(state.resultsPerPage);
  const [allCollumnsSelected, setAllCollumnsSelected] = useState(() => {
    const anyNotSelected = columns.find((col) => col.omit);
    return !anyNotSelected;
  });

  const handlePageChange = (page: number) => {
    actions.setPage(page);
  };

  const handlePerRowsChange = (perPage: number) => {
    actions.setResultsPerPage(perPage);
    // setResultsPerPage(perPage);
  };

  const handleSort = (column, sortDirection) => {
    actions.setSort(column.selector, sortDirection);
  };

  const toggleColumn = (columnIndex: number) => {
    const newColumns = [...columns];
    const changedColumn = newColumns[columnIndex];
    if (changedColumn) changedColumn.omit = !changedColumn.omit;
    const anyNotSelected = newColumns.find((col) => col.omit);
    setAllCollumnsSelected(!anyNotSelected);
    setColumns(newColumns);
  };

  const toggleAllColumns = () => {
    const newAllColumnsSelected = !allCollumnsSelected;
    const newColumns = columns.map((col) => {
      col.omit = !newAllColumnsSelected;
      return col;
    });
    setAllCollumnsSelected(newAllColumnsSelected);
    setColumns(newColumns);
  }

  const TableHeaderTitle = () => {
    if (state.activeFilters.length === 0 && state.totalResults > 0 && !state.loading) {
      return (
        <p className="title is-4">
          All <NumberFormat value={state.totalResults} displayType={'text'} thousandSeparator={true} /> {pluralize(state.resultLabel)}
        </p>
      );
    } else if (state.activeFilters.length > 1 || state.activeFilters.length === 1 && !state.loading) {
      return (
        <p className="title is-4">
            <NumberFormat value={state.totalResults} displayType={'text'} thousandSeparator={true} />
            {`${state.totalResults === 1 
              ? ' ' + state.resultLabel + ' matches'
              : ' ' + pluralize(state.resultLabel) + ' match'} your search`}
        </p>
      );
    } else {
      return (
        <p className="title is-4">Loading {pluralize(state.resultLabel)}...</p>
      );
    }
  };

  const customStyles = {
    rows: {
      style: {
        minHeight: '3em', // override the row height
      }
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
          <MenuItem>
            <li className="dropdown-item">
              <label className="checkbox is-block">
                <input
                  type="checkbox"
                  role="checkbox"
                  checked={allCollumnsSelected}
                  aria-checked={allCollumnsSelected}
                  /**
                   * Use key-up event to allow toggling with the space bar
                   * Must use key-up instead of key-down to prevent double-firing in Firefox
                   */
                  onKeyUp={(e) => {
                    e.preventDefault();
                    if (e.keyCode === 32) toggleAllColumns();
                  }}
                  onChange={(e) => toggleAllColumns()}
                />
                <span><strong>Select all</strong></span>
              </label>
            </li>
          </MenuItem>
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
                      if (e.keyCode === 32) toggleColumn(i);
                    }}
                    onChange={(e) => toggleColumn(i)}
                  />
                  <span>{col.name}</span>
                </label>
              </li>
            </MenuItem>
          ))}
        </ul>
      </Menu>
    </MenuWrapper>;

  const resultsPerPageOptions = [10, 15, 30, 50, 75];
  const resultsPerPageMenu =
    <MenuWrapper 
      className='dropdown is-right is-active has-text-left mr-1'
      onSelection={handlePerRowsChange}
    >
      <div className="dropdown-trigger">
        <Button className='button'>
          <span>Results per page: {state.resultsPerPage}</span>
          <span className="icon"><FaAngleDown/></span>
        </Button>
      </div>
      <Menu className='dropdown-menu'>
        <ul className="dropdown-content">
          {resultsPerPageOptions.map((d, i) => (
            <MenuItem key={i} value={d}>
              <li className={classNames('dropdown-item', {'is-active': d === state.resultsPerPage})}>
                {d}
              </li>
            </MenuItem>
          ))}
        </ul>
      </Menu>
    </MenuWrapper>;

  const CustomPaginator = () => (
    <Paginator
      rowCount={state.totalResults}
      rowsPerPage={state.resultsPerPage}
      currentPage={state.page}
      onChangePage={handlePageChange}
      onChangeRowsPerPage={handlePerRowsChange}
    />
  );

  return (
    <div>
      <div className="columns mb-1">
        <div className="column pb-2">
          <div className="table-header">
            <div>
              <TableHeaderTitle />
            </div>
            <div className="progress-container">
              {state.loading &&
                <progress className="progress is-small is-primary" max="100"></progress>
              }
            </div>
            <div>
              {resultsPerPageMenu}
              {columnsMenu}
            </div>
          </div>
        </div>
      </div>
      <div className="columns mb-0">
        <div  className="column pb-0">
          <ActiveFilterButtons
            filters={state.activeFilters}
            onClick={(v, id) => actions.setFilterValue(v, id)}
          />
        </div>
      </div>
      <div className="columns">
        <div className="column react-data-table-container">
          <DataTable
            className="react-data-table"
            noHeader
            theme="material"
            columns={columns}
            data={state.results}
            highlightOnHover
            pagination
            paginationServer
            paginationComponent={CustomPaginator}
            sortServer
            sortIcon={<FaCaretDown/>}
            defaultSortField={state.sortField}
            defaultSortAsc={state.sortDirection === 'desc' ? false : true}
            onSort={handleSort}
            customStyles={customStyles}
          />
        </div>
      </div>
    </div>
  );
};
