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
      <h1>Phase Diagram</h1>
      <div className="container is-max-desktop">
        <MaterialsInput
          type={MaterialsInputType.CHEMICAL_SYSTEM}
          setProps={setState}
          label="Phase Diagram"
          showTypeDropdown={false}
          showSubmitButton={true}
          periodicTableMode={PeriodicTableMode.TOGGLE}
          allowedInputTypes={[MaterialsInputType.CHEMICAL_SYSTEM, MaterialsInputType.FORMULA]}
          maxElementSelectable={4}
        />
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
