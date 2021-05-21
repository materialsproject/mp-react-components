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
import { ConditionalRowStyle } from '../types';
import { DownloadDropdown } from '../../DownloadDropdown';

/**
 * Render information about SearchUI results as well as controls
 * for modifying the data in the results view.
 * Information and interactions are hooked up to the SearchUIContext state and actions.
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

export const SearchUIDataHeader: React.FC<Props> = (props) => {
  const state = useSearchUIContext();
  const actions = useSearchUIContextActions();
  const [titleHover, setTitleHover] = useState(false);
  const [toggleClearRows, setToggleClearRows] = useState(false);
  const [columns, setColumns] = useState(state.columns.filter((c) => !c.hidden));
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

  // const getDataToDownload = () => {
  //   if (state.selectedRows && state.selectedRows.length > 0) {
  //     return state.selectedRows;
  //   } else {
  //     return state.results;
  //   }
  // };

  // const getDownloadFilename = () => {
  //   if (state.selectedRows && state.selectedRows.length > 0) {
  //     return `selected-results-${state.selectedRows.length}`;
  //   } else {
  //     return `results-${lowerResultBound}-${upperResultBound}`;
  //   }
  // };

  // const getDownloadTooltip = () => {
  //   if (state.selectedRows && state.selectedRows.length > 0) {
  //     return `Includes ${state.selectedRows.length} selected rows`;
  //   } else if (state.totalResults > state.resultsPerPage) {
  //     return 'Includes current page only';
  //   } else {
  //     return;
  //   }
  // };

  // const getDownloadLabel = () => {
  //   if (state.selectedRows && state.selectedRows.length > 0) {
  //     return 'Download selected as';
  //   } else {
  //     return 'Download as';
  //   }
  // };

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

  // const downloadDropdown = (
  //   <DownloadDropdown
  //     data={getDataToDownload()}
  //     filename={getDownloadFilename()}
  //     tooltip={getDownloadTooltip()}
  //   >
  //     {getDownloadLabel()}
  //   </DownloadDropdown>
  // );

  const columnsMenu = (
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
  );

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

  return (
    <div id={componentHtmlId} className="mpc-search-ui-data-table">
      <div className="mpc-table-header">
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
        <div className="mpc-search-ui-data-table-controls">
          {resultsPerPageMenu}
          {columnsMenu}
        </div>
      </div>
      <ActiveFilterButtons
        filters={state.activeFilters}
        onClick={(v, id) => actions.setFilterValue(v, id)}
      />
    </div>
  );
};
