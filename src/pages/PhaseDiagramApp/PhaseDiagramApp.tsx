import React, { useState } from 'react';
import { SearchUI } from '../../components/data-display/SearchUI';
import { Column, FilterGroup } from '../../components/data-display/SearchUI/types';
import filterGroups from './filterGroups.json';
import columns from './columns.json';
import { SearchUIViewType } from '../../components/data-display/SearchUI/types';
import {
  MaterialsInput,
  MaterialsInputType,
  PeriodicTableMode
} from '../../components/data-entry/MaterialsInput/MaterialsInput';
import { SearchUIContainer } from '../../components/data-display/SearchUI/SearchUIContainer';
import { SearchUISearchBar } from '../../components/data-display/SearchUI/SearchUISearchBar';
import { SearchUIDataView } from '../../components/data-display/SearchUI/SearchUIDataView';

/**
 * Component for testing the Phase Diagram view
 */
export const PhaseDiagramApp: React.FC = () => {
  const [state, setState] = useState({
    value: '',
    type: 'test'
  });

  return (
    <>
      <h1>Phase Diagram Test</h1>
      <div className="container is-max-desktop">
        <MaterialsInput
          type={MaterialsInputType.CHEMICAL_SYSTEM}
          setProps={setState}
          label="Phase Diagram"
          showTypeDropdown={false}
          showSubmitButton={true}
          submitButtonText="Generate"
          periodicTableMode={PeriodicTableMode.TOGGLE}
          allowedInputTypes={[MaterialsInputType.CHEMICAL_SYSTEM]}
          maxElementSelectable={4}
          hideWildcardButton={true}
          chemicalSystemSelectHelpText={
            'Select up to 4 elements to build a phase diagram with **only** these elements.'
          }
        />
        {/* <MaterialsInput
          type={'elements' as MaterialsInputType}
          allowedInputTypes={['elements' as MaterialsInputType, 'formula' as MaterialsInputType]}
          periodicTableMode={PeriodicTableMode.TOGGLE}
          showSubmitButton={true}
          helpItems={[{ label: 'Search Help' }]}
          autocompleteFormulaUrl={process.env.REACT_APP_AUTOCOMPLETE_URL}
          autocompleteApiKey={process.env.REACT_APP_API_KEY}
        /> */}
      </div>
      <div>
        <h2>{state.value}</h2>
        <h3>{state.type}</h3>
      </div>
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
        searchBarAllowedInputTypesMap={{
          elements: {
            field: 'elements'
          },
          formula: {
            field: 'formula'
          },
          mpid: {
            field: 'material_ids'
          }
        }}
      >
        <SearchUIDataView />
      </SearchUIContainer>
    </>
  );
};
