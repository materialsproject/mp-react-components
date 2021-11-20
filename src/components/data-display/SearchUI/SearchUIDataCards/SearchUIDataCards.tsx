import React, { useEffect, useRef, useState } from 'react';
import { useSearchUIContext, useSearchUIContextActions } from '../SearchUIContextProvider';
import { Paginator } from '../../Paginator';
import { DataCard } from '../../DataCard';

/**
 * NOT IMPLEMENTED
 * Component for rendering SearchUI results in the cards view
 * Will use the DataCard component to render results as a grid
 * of cards where each shows an image and a few select data properties.
 */
export const SearchUIDataCards: React.FC = () => {
  const state = useSearchUIContext();
  const actions = useSearchUIContextActions();
  const handlePageChange = (page: number) => {
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
    <div data-testid="mpc-search-ui-data-cards" className="mpc-search-ui-data-cards">
      <CustomPaginator />
      {/* <div className="mpc-search-ui-data-cards-container">
        {state.results.map((d, i) => (
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
        ))}
      </div> */}
      <CustomPaginator />
    </div>
  );
};
