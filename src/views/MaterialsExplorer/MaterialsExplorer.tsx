import React from 'react';
import { SearchUI } from '../../components/search/SearchUI';
import { FilterGroup } from '../../components/search/SearchUI/types';
import filterGroups from './filterGroups.json';
import columns from './columns.json';

/**
 * Component for testing the Materials Explorer view
 */

export const MaterialsExplorer: React.FC = () => {
  return (
    <>
      <h1 className="title">Materials Explorer</h1>
      <SearchUI
        resultLabel="material"
        columns={columns}
        filterGroups={filterGroups as FilterGroup[]}
        baseURL={process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL + '/search/' : ''}
        autocompleteFormulaUrl={
          process.env.REACT_APP_AUTOCOMPLETE_URL
            ? process.env.REACT_APP_AUTOCOMPLETE_URL
            : undefined
        }
        apiKey={undefined}
        searchBarTooltip="Type in a comma-separated list of element symbols (e.g. Ga, N), a chemical formula (e.g. C3N), or a material id (e.g. mp-10152). You can also click elements on the periodic table to add them to your search."
        searchBarPlaceholder="Search by elements, formula, or mp-id"
        sortField="energy_above_hull"
        sortAscending={true}
        // conditionalRowStyles={[
        //   {
        //     selector: 'is_stable',
        //     value: true,
        //     style: {
        //       backgroundColor: '#DBE2FA',
        //       boxShadow: '4px 0px 0px 0px #000 inset',
        //     },
        //   },
        // ]}
      />
    </>
  );
};
