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
import { DataCard } from '../../DataCard';
import { BibCard } from '../../BibCard';

/**
 * Component for rendering data returned within a SearchUI component
 * Table data and interactions are hooked up to the SearchUIContext state and actions
 */

const customCardsMap = {
  synthesis: BibCard,
};

const getCustomCardComponent = (cardType?: string) => {
  if (cardType && customCardsMap.hasOwnProperty(cardType)) {
    return customCardsMap[cardType];
  } else {
    return null;
  }
};

interface Props {
  className?: string;
}

export const SearchUIDataCards: React.FC<Props> = (props) => {
  const state = useSearchUIContext();
  const actions = useSearchUIContextActions();
  const tableRef = useRef<HTMLDivElement>(null);
  const CustomCardComponent = getCustomCardComponent(state.customCardType);
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
    <div className="mpc-search-ui-data-table">
      {state.resultsPerPage > 15 && <CustomPaginator />}
      <div className="columns react-data-table-outer-container">
        <div
          data-testid="react-data-table-container"
          className="column react-data-table-container"
          ref={tableRef}
        >
          {state.results.map((d, i) => {
            if (CustomCardComponent) {
              return (
                <CustomCardComponent
                  key={`mpc-data-card-${i}`}
                  className="mpc-search-ui-custom-card"
                  data={d}
                />
              );
            } else {
              return (
                <DataCard
                  key={`mpc-data-card-${i}`}
                  className="box mpc-search-ui-data-card"
                  data={d}
                  levelOneKey="material_id"
                  levelTwoKey="formula_pretty"
                  levelThreeKeys={[
                    { key: 'energy_above_hull', label: 'Energy Above Hull' },
                    { key: 'nsites', label: 'n sites' },
                  ]}
                />
              );
            }
          })}
        </div>
      </div>
      <CustomPaginator />
    </div>
  );
};
