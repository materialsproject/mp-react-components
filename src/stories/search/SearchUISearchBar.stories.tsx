import React from 'react';
import { Story } from '@storybook/react';
import columns from '../constants/columns.json';
import filterGroups from '../constants/filterGroups.json';
import {
  Column,
  FilterGroup,
  SearchUIContainerProps
} from '../../components/data-display/SearchUI/types';
import { SearchUIContainer } from '../../components/data-display/SearchUI/SearchUIContainer';
import { SearchUISearchBar } from '../../components/data-display/SearchUI/SearchUISearchBar';
import { PeriodicTableMode } from '../../components/data-entry/MaterialsInput/MaterialsInput';

export default {
  component: SearchUISearchBar,
  title: 'Search UI/SearchUISearchBar'
};

export const Basic: Story<SearchUIContainerProps> = (args) => (
  <SearchUIContainer
    disableRichColumnHeaders
    resultLabel="material"
    columns={columns as Column[]}
    filterGroups={filterGroups as FilterGroup[]}
    apiEndpoint="https://api.materialsproject.org/summary/"
    autocompleteFormulaUrl="https://api.materialsproject.org/materials/formula_autocomplete/"
    apiKey={process.env.REACT_APP_API_KEY ? process.env.REACT_APP_API_KEY : undefined}
  >
    <SearchUISearchBar
      periodicTableMode={'toggle' as PeriodicTableMode}
      placeholder="Search by elements, formula, or ID"
      errorMessage="Invalid search value"
      allowedInputTypesMap={{
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
      helpItems={[
        {
          label: 'Search Examples'
        },
        {
          label: 'Include at least elements',
          examples: ['Li,Fe', 'Si,O,K']
        },
        {
          label: 'Has exact formula',
          examples: ['Li3Fe', 'Eu2SiCl2O3']
        },
        {
          label: 'Has Material ID',
          examples: ['mp-149', 'mp-19326']
        }
      ]}
    />
  </SearchUIContainer>
);

Basic.storyName = 'SearchUISearchBar';
