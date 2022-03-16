import React, { useState } from 'react';
import { Column, FilterGroup } from '../../components/data-display/SearchUI/types';
import filterGroups from './filterGroups.json';
import columns from './columns.json';
import { SearchUIViewType } from '../../components/data-display/SearchUI/types';
import { PeriodicTableMode } from '../../components/data-entry/MaterialsInput/MaterialsInput';
import { SearchUIContainer, SearchUIDataView, SearchUIGrid, SearchUISearchBar } from '../..';

/**
 * Component for testing the Materials Explorer view
 */

export const MaterialsExplorer: React.FC = () => {
  const [state, setState] = useState({ results: [] });
  return (
    <>
      <h1
        className="title is-1"
        style={{
          height: '12rem',
          lineHeight: '12rem',
          borderBottom: '1px solid #ddd',
          textAlign: 'center'
        }}
      >
        Materials Explorer
      </h1>
      <SearchUIContainer
        view={SearchUIViewType.TABLE}
        setProps={setState}
        resultLabel="material"
        columns={columns as Column[]}
        // filterGroups={
        //   [
        //     {
        //       name: 'Composition',
        //       expanded: false,
        //       filters: [
        //         {
        //           name: 'Include Elements',
        //           params: ['elements'],
        //           overrides: ['material_ids', 'formula', 'chemsys'],
        //           isSearchBarField: true,
        //           tooltip:
        //             'Enter a " , " separated list of element symbols to find materials that contain at least these elements (e.g. "Ga,N").',
        //           type: 'MATERIALS_INPUT',
        //           props: {
        //             type: 'elements',
        //             periodicTableMode: 'none',
        //             errorMessage:
        //               'Please enter a valid list of element symbols separated by a comma.',
        //             helpItems: [
        //               {
        //                 label: 'Elements Examples'
        //               },
        //               {
        //                 label: null,
        //                 examples: ['Li,Fe', 'Al,Ge,O']
        //               }
        //             ]
        //           }
        //         }
        //       ]
        //     }
        //   ] as FilterGroup[]
        // }
        filterGroups={filterGroups as FilterGroup[]}
        apiEndpoint={
          process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL + '/summary/' : ''
        }
        autocompleteFormulaUrl={
          process.env.REACT_APP_AUTOCOMPLETE_URL
            ? process.env.REACT_APP_AUTOCOMPLETE_URL
            : undefined
        }
        apiKey={undefined}
        hasSortMenu={true}
        sortFields={['energy_above_hull', 'formula_pretty']}
      >
        <SearchUISearchBar
          periodicTableMode={PeriodicTableMode.TOGGLE}
          placeholder="e.g. Li-Fe or Li,Fe or Li3Fe or mp-19017"
          errorMessage="Please enter a valid formula (e.g. CeZn5), list of elements (e.g. Ce, Zn or Ce-Zn), or Material ID (e.g. mp-394)."
          chemicalSystemSelectHelpText="Select elements to search for materials with **only** these elements"
          elementsSelectHelpText="Select elements to search for materials with **at least** these elements"
          allowedInputTypesMap={{
            chemical_system: { field: 'chemsys' },
            elements: { field: 'elements' },
            formula: { field: 'formula' },
            mpid: { field: 'material_ids' }
          }}
          helpItems={[
            { label: 'Search Examples' },
            {
              label: 'Include at least elements',
              examples: ['Li,Fe', 'Si,O,K']
            },
            {
              label: 'Include only elements',
              examples: ['Li-Fe', 'Si-O-K']
            },
            {
              label: 'Include only elements plus wildcard elements',
              examples: ['Li-Fe-*-*', 'Si-Fe-*-*-*']
            },
            {
              label: 'Has exact formula',
              examples: ['Li3Fe', 'Eu2SiCl2O3']
            },
            {
              label: 'Has formula with wildcard atoms',
              examples: ['LiFe*2*', 'Si*']
            },
            {
              label: 'Has Material ID',
              examples: ['mp-149', 'mp-19326']
            },
            {
              label: 'Additional search options available in the filters panel.'
            }
          ]}
        />
        <SearchUIGrid />
      </SearchUIContainer>
    </>
  );
};
