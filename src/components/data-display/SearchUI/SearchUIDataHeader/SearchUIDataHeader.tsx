import React, { useEffect, useRef, useState } from 'react';
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
import { ColumnsMenu } from '../../DataTable/ColumnsMenu';

const componentHtmlId = uuidv4();

const getLowerResultBound = (totalResults: number, resultsPerPage: number, skip: number) => {
  if (totalResults === 0) {
    return 0;
  } else if (totalResults < resultsPerPage) {
    return 1;
  } else {
    return skip + 1;
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
  const { state, query } = useSearchUIContext();
  const actions = useSearchUIContextActions();
  const ref = useRef<HTMLDivElement>(null);
  const [titleHover, setTitleHover] = useState(false);
  const [columns, setColumns] = useState(state.columns.filter((c) => !c.hidden));
  const limit = query[state.limitKey] || state.defaultLimit;
  const skip = query[state.skipKey] || state.defaultSkip;
  const lowerResultBound = getLowerResultBound(state.totalResults!, limit, skip);
  const upperResultBound = getUpperResultBound(state.totalResults!, limit, lowerResultBound);

  const handlePerRowsChange = (perPage: number) => {
    actions.setResultsPerPage(perPage);
  };

  const TableHeaderTitle = () => {
    if (state.activeFilters!.length === 0 && state.totalResults! > 0 && !state.loading) {
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
      state.activeFilters!.length > 1 ||
      (state.activeFilters!.length === 1 && !state.loading)
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
      <ColumnsMenu columns={columns} setColumns={actions.setColumns} />
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
          <span>Results per page: {query[state.limitKey]}</span>
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
                className={classNames('dropdown-item', {
                  'is-active': d === query[state.limitKey]
                })}
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
      sortValues={state.results || []}
      sortOptions={state.columns
        .filter((c) => !c.hidden)
        .map((c) => {
          return { label: c.nameString, value: c.selector } as DropdownItem;
        })}
      sortField={state.sortFields && state.sortFields[0] ? state.sortFields[0] : undefined}
      setSortField={actions.setSortField}
      sortAscending={
        state.sortFields && state.sortFields[0] ? state.sortFields[0].indexOf('-') !== 0 : undefined
      }
      setSortAscending={actions.setSortAscending}
      sortFn={actions.setSort}
    />
  ) : null;

  // const viewSwitcher = state.allowViewSwitching ? (
  //   <div className="field has-addons">
  //     <div className="control">
  //       <button
  //         onClick={() => actions.setView('table')}
  //         className={classNames('button', {
  //           'is-active': state.view === 'table'
  //         })}
  //       >
  //         <FaTable />
  //       </button>
  //     </div>
  //     <div className="control">
  //       <button
  //         onClick={() => actions.setView('cards')}
  //         className={classNames('button', {
  //           'is-active': state.view === 'cards'
  //         })}
  //       >
  //         <FaThLarge />
  //       </button>
  //     </div>
  //   </div>
  // ) : null;

  useEffect(() => {
    actions.setResultsRef(ref);
  }, []);

  return (
    <div id={componentHtmlId} className="mpc-search-ui-data-header box" ref={ref}>
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
          {/* {viewSwitcher} */}
          {/* {sortMenu} */}
          {columnsMenu}
          {/* {resultsPerPageMenu} */}
        </div>
      </div>
      {state.activeFilters!.length > 0 && (
        <ActiveFilterButtons
          filters={state.activeFilters!}
          onClick={(params) => actions.removeFilters(params)}
        />
      )}
    </div>
  );
};
