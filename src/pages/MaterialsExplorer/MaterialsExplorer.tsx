import React from 'react';
import { SearchUI } from '../../components/data-display/SearchUI';
import { FilterGroup } from '../../components/data-display/SearchUI/types';
import filterGroups from './filterGroups.json';
import columns from './columns.json';
import { SearchUIViewType } from '../../components/data-display/SearchUI/types';
import { PeriodicTableMode } from '../../components/data-entry/MaterialsInput/MaterialsInput';

/**
 * Component for testing the Materials Explorer view
 */

export const MaterialsExplorer: React.FC = () => {
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
      <SearchUI
        view={SearchUIViewType.TABLE}
        // allowViewSwitching
        // cardOptions={{
        //   imageBaseURL: 'https://next-gen.materialsproject.org/static/structures/',
        //   imageKey: 'material_id',
        //   levelOneKey: 'material_id',
        //   levelTwoKey: 'formula_pretty',
        //   levelThreeKeys: [
        //     { key: 'energy_above_hull', label: 'Energy Above Hull' },
        //     { key: 'formation_energy_per_atom', label: 'Formation Energy' }
        //   ]
        // }}
        resultLabel="material"
        columns={columns}
        filterGroups={filterGroups as FilterGroup[]}
        baseUrl={process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL + '/summary/' : ''}
        // baseUrl="test"
        autocompleteFormulaUrl={
          process.env.REACT_APP_AUTOCOMPLETE_URL
            ? process.env.REACT_APP_AUTOCOMPLETE_URL
            : undefined
        }
        apiKey={undefined}
        hasSortMenu={true}
        sortField="formula_pretty"
        sortAscending={true}
        searchBarTooltip="Type in a comma-separated list of element symbols (e.g. Ga, N), a chemical formula (e.g. C3N), or a material id (e.g. mp-10152). You can also click elements on the periodic table to add them to your search."
        searchBarPlaceholder="e.g. Li-Fe or Li,Fe or Li3Fe or mp-19017"
        // searchBarPlaceholder="Search by elements, formula, or Material ID"
        searchBarErrorMessage="Please enter a valid formula (e.g. CeZn5), list of elements (e.g. Ce, Zn or Ce-Zn), or ID (e.g. mp-394 or mol-54330)."
        searchBarPeriodicTableMode={PeriodicTableMode.TOGGLE}
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
        searchBarHelpItems={[
          {
            label: 'Search Examples'
          },
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
            label: 'Has formula plus wildcard atoms',
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
    </>
  );
};
