import React, { useEffect, useState } from 'react';
import { useSearchUIContext, useSearchUIContextActions } from '../SearchUIContextProvider';
import { ActiveFilterButtons } from '../../../data-display/ActiveFilterButtons';
import NumberFormat from 'react-number-format';
import { FaAngleDown, FaLink, FaTable, FaThLarge } from 'react-icons/fa';
import { Wrapper as MenuWrapper, Button, Menu, MenuItem } from 'react-aria-menubutton';
import classNames from 'classnames';
import { pluralize } from '../../../data-entry/utils';
import { v4 as uuidv4 } from 'uuid';
import * as d3 from 'd3';
import { SortDropdown } from '../../SortDropdown';
import { DropdownItem } from '../../SortDropdown/SortDropdown';
import { SearchUIViewType } from '../types';

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

/**
 * Render information about SearchUI results as well as controls
 * for modifying the data in the results view.
 */
export const SearchUIDataHeader: React.FC = () => {
  const state = useSearchUIContext();
  const actions = useSearchUIContextActions();
  const [titleHover, setTitleHover] = useState(false);
  const [columns, setColumns] = useState(state.columns.filter((c) => !c.hidden));
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

  const toggleColumn = (columnIndex: number) => {
    const newColumns = [...columns];
    const changedColumn = newColumns[columnIndex];
    if (changedColumn) changedColumn.omit = !changedColumn.omit;
    const anyNotSelected = newColumns.find((col) => col.omit);
    setAllCollumnsSelected(!anyNotSelected);
    actions.setColumns(newColumns);
  };

  const toggleAllColumns = () => {
    const newAllColumnsSelected = !allCollumnsSelected;
    const newColumns = columns.map((col) => {
      col.omit = !newAllColumnsSelected;
      return col;
    });
    setAllCollumnsSelected(newAllColumnsSelected);
    actions.setColumns(newColumns);
  };

  const handlePerRowsChange = (perPage: number) => {
    actions.setResultsPerPage(perPage);
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

  const columnsMenu =
    state.view === SearchUIViewType.TABLE ? (
      <MenuWrapper
        data-testid="columns-menu"
        className="dropdown is-right is-active"
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
    ) : null;

  const resultsPerPageOptions = [10, 15, 30, 50, 75];
  const resultsPerPageMenu = (
    <MenuWrapper
      data-testid="results-per-page-menu"
      className="dropdown is-right is-active"
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

  const sortMenu = state.hasSortMenu ? (
    <SortDropdown
      sortValues={state.results}
      sortOptions={state.columns
        .filter((c) => !c.hidden)
        .map((c) => {
          return { label: c.nameString, value: c.selector } as DropdownItem;
        })}
      sortField={state.sortField}
      setSortField={actions.setSortField}
      sortAscending={state.sortAscending}
      setSortAscending={actions.setSortAscending}
      sortFn={actions.setSort}
    />
  ) : null;

  const viewSwitcher = state.allowViewSwitching ? (
    <div className="field has-addons">
      <div className="control">
        <button
          onClick={() => actions.setView('table')}
          className={classNames('button', {
            'is-active': state.view === 'table'
          })}
        >
          <FaTable />
        </button>
      </div>
      <div className="control">
        <button
          onClick={() => actions.setView('cards')}
          className={classNames('button', {
            'is-active': state.view === 'cards'
          })}
        >
          <FaThLarge />
        </button>
      </div>
    </div>
  ) : null;

  return (
    <div id={componentHtmlId} className="mpc-search-ui-data-header box">
      <div className="mpc-search-ui-data-header-content">
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
        <div className="mpc-search-ui-data-header-controls">
          {viewSwitcher}
          {/* {sortMenu} */}
          {columnsMenu}
          {/* {resultsPerPageMenu} */}
        </div>
      </div>
      {state.activeFilters.length > 0 && (
        <ActiveFilterButtons
          filters={state.activeFilters}
          onClick={(v, id) => actions.setFilterValue(v, id)}
        />
      )}
    </div>
  );
};
