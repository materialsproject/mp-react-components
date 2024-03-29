import React from 'react';
import filterGroups from './filterGroups.json';
import columns from './columns.json';
import { Column, FilterGroup } from '../../components/data-display/SearchUI/types';
import { PeriodicTableMode } from '../../components/data-entry/MaterialsInput/MaterialsInput';
import { SearchUIContainer, SearchUIGrid, SearchUISearchBar } from '../..';

/**
 * Component for testing the Batteries Explorer view
 */

export const BatteryExplorer: React.FC = () => {
  console.log(process.env.REACT_APP_API_KEY);
  return (
    <>
      <h1 className="title is-1">Battery Explorer</h1>
      <SearchUIContainer
        resultLabel="battery"
        columns={columns as Column[]}
        filterGroups={filterGroups as FilterGroup[]}
        apiEndpoint={
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
        sortFields={['energy_above_hull']}
      >
        <SearchUISearchBar
          periodicTableMode={PeriodicTableMode.TOGGLE}
          allowedInputTypesMap={{
            chemical_system: { field: 'chemsys' },
            elements: { field: 'elements' },
            formula: { field: 'formula' }
          }}
        />
        <SearchUIGrid />
      </SearchUIContainer>
    </>
  );
};
