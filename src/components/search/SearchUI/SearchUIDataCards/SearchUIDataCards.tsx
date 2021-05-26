import React, { useEffect, useRef, useState } from 'react';
import { useSearchUIContext, useSearchUIContextActions } from '../SearchUIContextProvider';
import { Paginator } from '../../Paginator';
import { DataCard } from '../../DataCard';
import { getCustomCardComponent } from '../utils';

/**
 * Component for rendering data returned within a SearchUI component
 * Table data and interactions are hooked up to the SearchUIContext state and actions
 */

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

  const CustomPaginator = () => (
    <Paginator
      rowCount={state.totalResults}
      rowsPerPage={state.resultsPerPage}
      currentPage={state.page}
      onChangePage={handlePageChange}
    />
  );

  return (
    <div className="mpc-search-ui-data-cards">
      <CustomPaginator />
      <div
        data-testid="mpc-search-ui-data-cards-container"
        className="mpc-search-ui-data-cards-container"
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
                levelOneKey={state.cardOptions.levelOneKey}
                levelTwoKey={state.cardOptions.levelTwoKey}
                levelThreeKeys={state.cardOptions.levelThreeKeys}
                leftComponent={
                  <figure className="image is-128x128">
                    <img
                      src={state.cardOptions.imageBaseURL + d[state.cardOptions.imageKey] + '.png'}
                    />
                  </figure>
                }
              />
            );
          }
        })}
      </div>
      <CustomPaginator />
    </div>
  );
};
