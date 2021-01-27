import React from 'react';
import { SearchUI } from '../components/search/SearchUI';
import { materialsColumns, materialsGroups } from '../constants/materials';

/**
 * Component for testing the Materials Explorer view
 */

export const MaterialsExplorer: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="title">Materials Explorer</h1>
      <SearchUI
        resultLabel="material"
        columns={materialsColumns}
        filterGroups={materialsGroups}
        baseURL={process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL + '/search/' : ''}
        autocompleteFormulaUrl={
          process.env.REACT_APP_AUTOCOMPLETE_URL
            ? process.env.REACT_APP_AUTOCOMPLETE_URL
            : undefined
        }
        apiKey={undefined}
        searchBarTooltip="Type in a comma-separated list of element symbols (e.g. Ga, N), a chemical formula (e.g. C3N), or a material id (e.g. mp-10152). You can also click elements on the periodic table to add them to your search."
        searchBarPlaceholder="Search by elements, formula, or mp-id"
        sortField="e_above_hull"
        sortAscending={true}
      />
    </div>
  );
};
