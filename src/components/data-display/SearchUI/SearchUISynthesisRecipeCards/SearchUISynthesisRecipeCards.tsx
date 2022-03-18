import React from 'react';
import { useSearchUIContext, useSearchUIContextActions } from '../SearchUIContextProvider';
import { Paginator } from '../../Paginator';
import { SynthesisRecipeCard } from '../../SynthesisRecipeCard';

/**
 *
 */
export const SearchUISynthesisRecipeCards: React.FC = () => {
  const { state, query } = useSearchUIContext();
  const actions = useSearchUIContextActions();
  const handlePageChange = (page: number) => {
    actions.setPage(page);
  };

  const CustomPaginator = ({ isTop = false }) => (
    <Paginator
      rowCount={state.totalResults!}
      rowsPerPage={query[state.limitKey]}
      currentPage={query[state.skipKey] / query[state.limitKey] + 1}
      onChangePage={handlePageChange}
      onChangeRowsPerPage={actions.setResultsPerPage}
      isTop={isTop}
    />
  );

  return (
    <div data-testid="mpc-synthesis-recipe-cards" className="mpc-synthesis-recipe-cards">
      <div className="mpc-synthesis-recipe-cards-container">
        {state.results!.map((d, i) => (
          // Custom result cards
          <SynthesisRecipeCard data={d} key={d.doi + '-' + i} />
        ))}
      </div>
      <CustomPaginator />
    </div>
  );
};
