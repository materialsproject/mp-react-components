import React from 'react';
import { SearchUI } from '../../components/data-display/SearchUI';
import filterGroups from './filterGroups.json';
import columns from './columns.json';
import { FilterGroup } from '../../components/data-display/SearchUI/types';

/**
 * Component for testing the Batteries Explorer view
 */

export const BatteryExplorer: React.FC = () => {
  console.log(process.env.REACT_APP_API_KEY);
  return (
    <>
      <h1 className="title">Batteries Explorer</h1>
      <SearchUI
        resultLabel="battery"
        columns={columns}
        filterGroups={filterGroups as FilterGroup[]}
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
        hasSearchBar={true}
        sortField="energy_above_hull"
        sortAscending={true}
      />
    </>
  );
};
