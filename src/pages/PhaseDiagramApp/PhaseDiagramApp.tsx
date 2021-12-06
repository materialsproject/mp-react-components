import React from 'react';
import { SearchUI } from '../../components/data-display/SearchUI';
import { Column, FilterGroup } from '../../components/data-display/SearchUI/types';
import filterGroups from './filterGroups.json';
import columns from './columns.json';
import { SearchUIViewType } from '../../components/data-display/SearchUI/types';
import { PeriodicTableMode } from '../../components/data-entry/MaterialsInput/MaterialsInput';
import { SearchUIContainer } from '../../components/data-display/SearchUI/SearchUIContainer';
import { SearchUISearchBar } from '../../components/data-display/SearchUI/SearchUISearchBar';
import { SearchUIDataView } from '../../components/data-display/SearchUI/SearchUIDataView';

/**
 * Component for testing the Phase Diagram view
 */

export const PhaseDiagramApp: React.FC = () => {
  return (
    <>
      <h1>Phase Diagram</h1>
      <SearchUIContainer
        resultLabel="material"
        columns={columns as Column[]}
        filterGroups={filterGroups as FilterGroup[]}
        apiEndpoint={
          process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL + '/thermo/' : ''
        }
        apiKey={undefined}
        hasSortMenu={true}
        sortField="formula_pretty"
        sortAscending={true}
      >
        <SearchUISearchBar />
        <SearchUIDataView />
      </SearchUIContainer>
    </>
  );
};
