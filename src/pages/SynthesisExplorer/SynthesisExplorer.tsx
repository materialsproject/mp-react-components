import React from 'react';
import { SearchUI } from '../../components/data-display/SearchUI';
import {
  Column,
  FilterGroup,
  SearchUIViewType
} from '../../components/data-display/SearchUI/types';
import filterGroups from './filterGroups.json';
import columns from './columns.json';
import { PeriodicTableMode } from '../../components/data-entry/MaterialsInput/MaterialsInput';

/**
 * Component for testing the Synthesis Explorer view
 */

export const SynthesisExplorer: React.FC = () => {
  return (
    <>
      <h1 className="title">Synthesis Explorer</h1>
      <SearchUI
        resultLabel="synthesis recipe"
        columns={columns as Column[]}
        filterGroups={filterGroups as FilterGroup[]}
        apiEndpoint={
          process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL + '/synthesis/' : ''
        }
        apiKey={undefined}
        hasSortMenu={false}
        searchBarTooltip="Type in keywords for which you want to search the synthesis database. For example, try 'ball-milled' or 'impurities'."
        searchBarAllowedInputTypesMap={{
          formula: {
            field: 'target_formula'
          },
          text: {
            field: 'keywords'
          }
        }}
        searchBarPeriodicTableMode={PeriodicTableMode.TOGGLE}
        searchBarPlaceholder="Search recipes by keywords"
        view={SearchUIViewType.SYNTHESIS}
      />
    </>
  );
};
