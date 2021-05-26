import React, { useEffect, useRef, useState } from 'react';
import { useSearchUIContext, useSearchUIContextActions } from '../SearchUIContextProvider';
import { Paginator } from '../../Paginator';
import { DataCard } from '../../DataCard';
import { getCustomCardComponent } from '../utils';
import { SearchUIDataTable } from '../SearchUIDataTable';
import { SearchUIDataCards } from '../SearchUIDataCards';
import { FaExclamationTriangle } from 'react-icons/fa';

/**
 * Component for rendering data returned within a SearchUI component
 * Table data and interactions are hooked up to the SearchUIContext state and actions
 */

interface Props {
  className?: string;
}

export const SearchUIDataView: React.FC<Props> = (props) => {
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
