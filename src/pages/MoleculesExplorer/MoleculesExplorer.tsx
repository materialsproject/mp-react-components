import React from 'react';
import { SearchUI } from '../../components/data-display/SearchUI';
import filterGroups from './filterGroups.json';
import columns from './columns.json';
import { FilterGroup } from '../../components/data-display/SearchUI/types';
import { PeriodicTableMode } from '../../components/data-entry/MaterialsInput/MaterialsInput';

/**
 * Component for testing the Molecules Explorer view
 */

export const MoleculesExplorer: React.FC = () => {
  return (
    <>
      <h1 className="title is-1">Molecules Explorer</h1>
      <SearchUI
        resultLabel="molecule"
        columns={columns}
        filterGroups={filterGroups as FilterGroup[]}
        baseUrl={
          process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL + '/molecules/' : ''
        }
        autocompleteFormulaUrl={
          process.env.REACT_APP_AUTOCOMPLETE_URL
            ? process.env.REACT_APP_AUTOCOMPLETE_URL
            : undefined
        }
        apiKey={undefined}
        searchBarTooltip="Type in a comma-separated list of element symbols (e.g. Ga, N), a chemical formula (e.g. C3N), or a material id (e.g. mp-10152). You can also click elements on the periodic table to add them to your search."
        searchBarPlaceholder="Search by elements, formula, or mp-id"
        searchBarPeriodicTableMode={PeriodicTableMode.TOGGLE}
        sortField="IE"
        sortAscending={false}
        allowViewSwitching
        cardOptions={{
          levelOneKey: 'task_id',
          levelTwoKey: 'formula_pretty'
        }}
      />
    </>
  );
};
