import React from 'react';
import { SearchUI } from '../../components/search/SearchUI';
import { FilterGroup, SearchUIViewType } from '../../components/search/SearchUI/types';
import filterGroups from './filterGroups.json';
import columns from './columns.json';
import { PeriodicTableMode } from '../../components/search/MaterialsInput/MaterialsInput';

/**
 * Component for testing the Synthesis Explorer view
 */

export const SynthesisExplorer: React.FC = () => {
  return (
    <>
      <h1 className="title">Synthesis Explorer</h1>
      <SearchUI
        resultLabel="synthesis recipe"
        columns={columns}
        filterGroups={filterGroups as FilterGroup[]}
        baseURL={
          process.env.REACT_APP_BASE_URL
            ? process.env.REACT_APP_BASE_URL + '/synthesis/recipes/'
            : ''
        }
        autocompleteFormulaUrl={
          process.env.REACT_APP_AUTOCOMPLETE_URL
            ? process.env.REACT_APP_AUTOCOMPLETE_URL
            : undefined
        }
        apiKey={undefined}
        hasSortMenu={false}
        searchBarTooltip="Type in keywords for which you want to search the synthesis database. For example, try 'ball-milled' or 'impurities'."
        searchBarAllowedInputTypesMap={{
          text: {
            field: 'keywords',
          },
        }}
        searchBarPeriodicTableMode={PeriodicTableMode.NONE}
        searchBarPlaceholder="Query recipes by keywords"
        view={SearchUIViewType.SYNTHESIS}
      />
    </>
  );
};
