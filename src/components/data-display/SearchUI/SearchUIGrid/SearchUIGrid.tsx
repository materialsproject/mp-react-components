import React from 'react';
import { SearchUIFilters } from '../SearchUIFilters';
import { SearchUIDataHeader } from '../SearchUIDataHeader';
import { SearchUIDataView } from '../SearchUIDataView';

/**
 * A component that combines the filters, data header, and data view
 * of a `SearchUI` into a common grid layout.
 * Note that this must be used within a `SearchUIContainer`.
 */
export const SearchUIGrid: React.FC = () => {
  return (
    <div className="mpc-search-ui-content columns">
      <div className="mpc-search-ui-left column is-narrow is-12-mobile">
        <SearchUIFilters />
      </div>
      <div className="mpc-search-ui-right column">
        <SearchUIDataHeader />
        <SearchUIDataView />
      </div>
    </div>
  );
};
