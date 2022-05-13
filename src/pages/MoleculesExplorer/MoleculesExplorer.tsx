import React, { useEffect } from 'react';
import filterGroups from './filterGroups.json';
import columns from './columns.json';
import { Column, FilterGroup } from '../../components/data-display/SearchUI/types';
import { PeriodicTableMode } from '../../components/data-entry/MaterialsInput/MaterialsInput';
import { SearchUIContainer, SearchUIGrid, SearchUISearchBar } from '../..';

/**
 * Component for testing the Molecules Explorer view
 */

export const MoleculesExplorer: React.FC = () => {
  useEffect(() => {
    document.title = 'Molecules Explorer';
  }, []);

  return (
    <>
      <h1 className="title is-1">Molecules Explorer</h1>
      <SearchUIContainer
        resultLabel="molecule"
        columns={columns as Column[]}
        filterGroups={filterGroups as FilterGroup[]}
        apiEndpoint={
          process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL + '/molecules/' : ''
        }
        autocompleteFormulaUrl={
          process.env.REACT_APP_AUTOCOMPLETE_URL
            ? process.env.REACT_APP_AUTOCOMPLETE_URL
            : undefined
        }
        apiKey={process.env.REACT_APP_API_KEY ? process.env.REACT_APP_API_KEY : undefined}
        sortFields={['IE']}
      >
        <SearchUISearchBar
          placeholder="Search by elements, formula, or mp-id"
          periodicTableMode={PeriodicTableMode.TOGGLE}
          allowedInputTypesMap={{
            elements: { field: 'elements' },
            formula: { field: 'formula' },
            mpid: { field: 'task_ids' },
            smiles: { field: 'smiles' }
          }}
        />
        <SearchUIGrid />
      </SearchUIContainer>
    </>
  );
};
