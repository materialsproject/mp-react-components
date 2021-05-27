import React from 'react';
import { useSearchUIContext, useSearchUIContextActions } from '../SearchUIContextProvider';
import { Paginator } from '../../Paginator';

/**
 *
 */
export const SearchUISynthesisRecipeCards: React.FC = () => {
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
    <div data-testid="mpc-synthesis-recipe-cards" className="mpc-synthesis-recipe-cards">
      <CustomPaginator />
      <div className="mpc-synthesis-recipe-cards-container">
        {state.results.map((d, i) => (
          // Custom result cards
          <div></div>
        ))}
      </div>
      <CustomPaginator />
    </div>
  );
};
