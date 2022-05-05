import React, { useEffect, useRef } from 'react';
import { useSearchUIContext, useSearchUIContextActions } from '../SearchUIContextProvider';
import { searchUIViewsMap } from '../types';
import { FaExclamationTriangle } from 'react-icons/fa';

/**
 * Component for rendering SearchUI data in a certain view dynamically
 * based on the current view state, error state, and number
 * of results. The view is determined by the `SearchUIContainer`'s `view` prop.
 */
export const SearchUIDataView: React.FC = () => {
  const { state, query } = useSearchUIContext();

  const getDataView = () => {
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
    } else if (!state.results || state.results.length === 0) {
      return (
        <div className="react-data-table-message">
          <p>No records match your search criteria</p>
        </div>
      );
    } else {
      const SearchUIViewComponent = searchUIViewsMap[state.view!];
      return <SearchUIViewComponent />;
    }
  };

  return <div className="mpc-search-ui-data-view">{getDataView()}</div>;
};
