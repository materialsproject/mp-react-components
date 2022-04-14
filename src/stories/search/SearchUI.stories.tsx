import React from 'react';
import { Story } from '@storybook/react';
import columns from '../constants/columns.json';
import filterGroups from '../constants/filterGroups.json';
import mofColumns from '../constants/mofColumns.json';
import mofFilterGroups from '../constants/mofFilterGroups.json';
import {
  Column,
  FilterGroup,
  SearchUIContainerProps
} from '../../components/data-display/SearchUI/types';
import { PeriodicTableMode } from '../../components/data-entry/MaterialsInput/MaterialsInput';
import { SearchUIContainer } from '../../components/data-display/SearchUI/SearchUIContainer';
import { SearchUISearchBar } from '../../components/data-display/SearchUI/SearchUISearchBar';
import { SearchUIGrid } from '../../components/data-display/SearchUI/SearchUIGrid';

export default {
  component: SearchUIContainer,
  title: 'Search UI/SearchUIContainer'
};

export const FullyFeatured: Story<SearchUIContainerProps> = (args) => (
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
    <SearchUIGrid />
  </SearchUIContainer>
);

export const WithMPContribsData: Story<SearchUIContainerProps> = (args) => (
  <SearchUIContainer
    disableRichColumnHeaders
    resultLabel="contribution"
    columns={mofColumns as Column[]}
    filterGroups={mofFilterGroups as FilterGroup[]}
    apiEndpoint="https://contribs-api.materialsproject.org/contributions/"
    apiKey={process.env.REACT_APP_API_KEY ? process.env.REACT_APP_API_KEY : undefined}
    apiEndpointParams={{ project: 'qmof' }}
    sortKey="_sort"
    totalKey="total_count"
    limitKey="_limit"
    skipKey="_skip"
    fieldsKey="_fields"
    sortFields={['data.natoms.value']}
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
    <SearchUIGrid />
  </SearchUIContainer>
);
