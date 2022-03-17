import React from 'react';
import {
  Column,
  FilterGroup,
  SearchUIViewType
} from '../../components/data-display/SearchUI/types';
import filterGroups from './filterGroups.json';
import columns from './columns.json';
import { PeriodicTableMode } from '../../components/data-entry/MaterialsInput/MaterialsInput';
import { SearchUIContainer } from '../../components/data-display/SearchUI/SearchUIContainer';
import { SearchUISearchBar } from '../../components/data-display/SearchUI/SearchUISearchBar';
import { SearchUIGrid } from '../../components/data-display/SearchUI/SearchUIGrid';

/**
 * Component for testing the Synthesis Explorer view
 */

export const SynthesisExplorer: React.FC = () => {
  return (
    <>
      <h1 className="title">Synthesis Explorer</h1>
      <SearchUIContainer
        resultLabel="synthesis recipe"
        columns={columns as Column[]}
        filterGroups={filterGroups as FilterGroup[]}
        apiEndpoint={
          process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL + '/synthesis/' : ''
        }
        apiKey={undefined}
        hasSortMenu={false}
        view={SearchUIViewType.SYNTHESIS}
      >
        <SearchUISearchBar
          allowedInputTypesMap={{
            formula: {
              field: 'target_formula'
            },
            text: {
              field: 'keywords'
            }
          }}
          periodicTableMode={PeriodicTableMode.TOGGLE}
          placeholder="Search recipes by keywords"
        />
        <SearchUIGrid />
      </SearchUIContainer>
    </>
  );
};
