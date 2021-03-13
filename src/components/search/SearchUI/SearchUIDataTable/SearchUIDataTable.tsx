import React, { useEffect, useRef, useState } from 'react';
import { useSearchUIContext, useSearchUIContextActions } from '../SearchUIContextProvider';
import DataTable from 'react-data-table-component';
import { ActiveFilterButtons } from '../../../search/ActiveFilterButtons';
import NumberFormat from 'react-number-format';
import { FaAngleDown, FaCaretDown, FaExclamationTriangle, FaLink } from 'react-icons/fa';
import { Wrapper as MenuWrapper, Button, Menu, MenuItem } from 'react-aria-menubutton';
import { Paginator } from '../../Paginator';
import classNames from 'classnames';
import { pluralize } from '../../utils';
import { v4 as uuidv4 } from 'uuid';
import * as d3 from 'd3';

/**
 * Component for rendering data returned within a SearchUI component
 * Table data and interactions are hooked up to the SearchUIContext state and actions
 */

interface Props {
  className?: string;
}

const componentHtmlId = uuidv4();

const getLowerResultBound = (totalResults: number, resultsPerPage: number, page: number) => {
  if (totalResults === 0) {
    return 0;
  } else if (totalResults < resultsPerPage) {
    return 1;
  } else {
    return (page - 1) * resultsPerPage + 1;
  }
};

const getUpperResultBound = (
  totalResults: number,
  resultsPerPage: number,
  lowerResultBound: number
) => {
  if (totalResults < resultsPerPage) {
    return totalResults;
  } else {
    return lowerResultBound - 1 + resultsPerPage;
  }
};

export const SearchUIDataTable: React.FC<Props> = (props) => {
  const state = useSearchUIContext();
  const actions = useSearchUIContextActions();
  const [titleHover, setTitleHover] = useState(false);
  const [columns, setColumns] = useState(state.columns);
  const tableRef = useRef<HTMLDivElement>(null);
  const [allCollumnsSelected, setAllCollumnsSelected] = useState(() => {
    const anyNotSelected = columns.find((col) => col.omit);
    return !anyNotSelected;
  });
  const lowerResultBound = getLowerResultBound(
    state.totalResults,
    state.resultsPerPage,
    state.page
  );
  const upperResultBound = getUpperResultBound(
    state.totalResults,
    state.resultsPerPage,
    lowerResultBound
  );

  const handlePageChange = (page: number) => {
    /** Scroll table back to top when page changes */
    if (tableRef.current) {
      tableRef.current.children[0].scrollTop = 0;
    }
    actions.setPage(page);
  };

  const handlePerRowsChange = (perPage: number) => {
    actions.setResultsPerPage(perPage);
  };

  const handleSort = (column, sortDirection) => {
    const sortAscending = sortDirection === 'asc' ? true : false;
    actions.setSort(column.selector, sortAscending);
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
  };

  const TableHeaderTitle = () => {
    if (state.activeFilters.length === 0 && state.totalResults > 0 && !state.loading) {
      return (
        <div data-testid="data-table-title">
          <a
            href={'#' + componentHtmlId}
            className="title is-5"
            onMouseOver={() => setTitleHover(true)}
            onMouseLeave={() => setTitleHover(false)}
            onClick={() => setTitleHover(false)}
          >
            <span className="has-text-weight-normal">All </span>
            <span className="has-text-weight-bold">
              <NumberFormat
                value={state.totalResults}
                displayType={'text'}
                thousandSeparator={true}
              />{' '}
              {pluralize(state.resultLabel)}
            </span>
            {titleHover && <FaLink className="is-size-7 ml-1" />}
          </a>
        </div>
      );
    } else if (
      state.activeFilters.length > 1 ||
      (state.activeFilters.length === 1 && !state.loading)
    ) {
      return (
        <div data-testid="data-table-title">
          <a
            className="title is-5"
            href={'#' + componentHtmlId}
            onMouseOver={() => setTitleHover(true)}
            onMouseLeave={() => setTitleHover(false)}
            onClick={() => setTitleHover(false)}
          >
            <span className="has-text-weight-bold">{d3.format(',')(state.totalResults)}</span>
            {state.totalResults === 1 && (
              <span>
                <span className="has-text-weight-bold"> {state.resultLabel}</span>
                <span className="has-text-weight-normal"> matches</span>
              </span>
            )}
            {state.totalResults !== 1 && (
              <span>
                <span className="has-text-weight-bold"> {pluralize(state.resultLabel)}</span>
                <span className="has-text-weight-normal"> match</span>
              </span>
            )}
            <span className="has-text-weight-normal"> your search</span>
            {titleHover && <FaLink className="is-size-7 ml-1" />}
          </a>
        </div>
      );
    } else {
      return (
        <p data-testid="data-table-title" className="title is-5 has-text-weight-normal">
          Loading {pluralize(state.resultLabel)}...
        </p>
      );
    }
  };

  const customStyles = {
    rows: {
      style: {
        minHeight: '3em',
      },
    },
  };

  const columnsMenu = (
    <MenuWrapper
      data-testid="columns-menu"
      className="dropdown is-right is-active has-text-left"
      closeOnSelection={false}
    >
      <div className="dropdown-trigger">
        <Button className="button">
          <span>Columns</span>
          <span className="icon">
            <FaAngleDown />
          </span>
        </Button>
      </div>
      <Menu className="dropdown-menu">
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
                <span>
                  <strong>Select all</strong>
                </span>
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
                  <span>{col.nameString}</span>
                </label>
              </li>
            </MenuItem>
          ))}
        </ul>
      </Menu>
    </MenuWrapper>
  );

  const resultsPerPageOptions = [10, 15, 30, 50, 75];
  const resultsPerPageMenu = (
    <MenuWrapper
      data-testid="results-per-page-menu"
      className="dropdown is-right is-active has-text-left mr-1"
      onSelection={handlePerRowsChange}
    >
      <div className="dropdown-trigger">
        <Button className="button">
          <span>Results per page: {state.resultsPerPage}</span>
          <span className="icon">
            <FaAngleDown />
          </span>
        </Button>
      </div>
      <Menu className="dropdown-menu">
        <ul className="dropdown-content">
          {resultsPerPageOptions.map((d, i) => (
            <MenuItem key={i} value={d}>
              <li
                className={classNames('dropdown-item', { 'is-active': d === state.resultsPerPage })}
              >
                {d}
              </li>
            </MenuItem>
          ))}
        </ul>
      </Menu>
    </MenuWrapper>
  );

  const CustomPaginator = () => (
    <Paginator
      rowCount={state.totalResults}
      rowsPerPage={state.resultsPerPage}
      currentPage={state.page}
      onChangePage={handlePageChange}
      onChangeRowsPerPage={handlePerRowsChange}
    />
  );

  const NoDataMessage = () => {
    if (state.error) {
      return (
        <div className="react-data-table-message">
          <p>
            <FaExclamationTriangle /> There was an error with your search.
          </p>
          <p>
            You may have entered an invalid search value. Otherwise, the API may be temporarily
            unavailable.
          </p>
        </div>
      );
    } else {
      return (
        <div className="react-data-table-message">
          <p>No records match your search criteria</p>
        </div>
      );
    }
  };

  return (
    <div id={componentHtmlId} className="search-ui-data-table">
      <div className="columns mb-1">
        <div className="column pb-2">
          <div className="table-header">
            <div>
              <TableHeaderTitle />
              <p className="subtitle is-7">
                Showing {d3.format(',')(lowerResultBound)}-{d3.format(',')(upperResultBound)}
              </p>
            </div>
            <div className="progress-container">
              {state.loading && (
                <progress className="progress is-small is-primary" max="100"></progress>
              )}
            </div>
            <div>
              {resultsPerPageMenu}
              {columnsMenu}
            </div>
          </div>
        </div>
      </div>
      <div className="columns mb-0">
        <div className="column pb-0">
          <ActiveFilterButtons
            filters={state.activeFilters}
            onClick={(v, id) => actions.setFilterValue(v, id)}
          />
        </div>
      </div>
      <div className="columns react-data-table-outer-container">
        <div
          data-testid="react-data-table-container"
          className="column react-data-table-container"
          ref={tableRef}
        >
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
            sortIcon={<FaCaretDown />}
            defaultSortField={state.sortField}
            defaultSortAsc={state.sortAscending}
            onSort={handleSort}
            customStyles={customStyles}
            noDataComponent={<NoDataMessage />}
          />
        </div>
      </div>
    </div>
  );
};
