import React from 'react';
import { SearchUI } from '../../components/search/SearchUI';
import { FilterGroup, SearchUIView } from '../../components/search/SearchUI/types';
import filterGroups from './filterGroups.json';
import columns from './columns.json';
import { CustomCardType } from '../../components/search/SearchUI/utils';

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
        searchBarTooltip="Type in a comma-separated list of element symbols (e.g. Ga, N), a chemical formula (e.g. C3N), or a material id (e.g. mp-10152). You can also click elements on the periodic table to add them to your search."
        searchBarAllowedInputTypesMap={{
          text: {
            field: 'keywords',
          },
        }}
        searchBarPlaceholder="Query recipes by keywords"
        view={SearchUIView.CARDS}
        customCardType={CustomCardType.SYNTHESIS}
      />
    </>
  );
};
