import React, { useEffect, useRef, useState } from 'react';
import { useSearchUIContext, useSearchUIContextActions } from '../SearchUIContextProvider';
import { Paginator } from '../../Paginator';
import { DataCard } from '../../DataCard';
import { getCustomCardComponent } from '../utils';
import { SearchUIDataTable } from '../SearchUIDataTable';
import { SearchUIDataCards } from '../SearchUIDataCards';
import { FaExclamationTriangle } from 'react-icons/fa';

/**
 * Component for rendering SearchUI data in a certain view
 * based on the current view state, error state, and number
 * of results.
 */
export const SearchUIDataView: React.FC = () => {
  const state = useSearchUIContext();

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
    } else if (state.view === 'table') {
      return <SearchUIDataTable />;
    } else if (state.view === 'cards') {
      return <SearchUIDataCards />;
    } else {
      return null;
    }
  };

  return <div className="mpc-search-ui-data-view">{getDataView()}</div>;
};
