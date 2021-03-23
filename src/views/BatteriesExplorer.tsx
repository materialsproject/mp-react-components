import React from 'react';
import { SearchUI } from '../components/search/SearchUI';
import { batteriesColumns, batteriesGroups } from '../constants/batteries';

/**
 * Component for testing the Batteries Explorer view
 */

export const BatteriesExplorer: React.FC = () => {
  console.log(process.env.REACT_APP_API_KEY);
  return (
    <div className="p-4">
      <h1 className="title">Batteries Explorer</h1>
      <SearchUI
        resultLabel="material"
        columns={batteriesColumns}
        filterGroups={batteriesGroups}
        baseURL={
          process.env.REACT_APP_BASE_URL
            ? process.env.REACT_APP_BASE_URL + '/insertion_electrodes/'
            : ''
        }
        autocompleteFormulaUrl={
          process.env.REACT_APP_AUTOCOMPLETE_URL
            ? process.env.REACT_APP_AUTOCOMPLETE_URL
            : undefined
        }
        apiKey={process.env.REACT_APP_API_KEY}
        hasSearchBar={false}
        sortField="e_above_hull"
        sortAscending={true}
      />
    </div>
  );
};
