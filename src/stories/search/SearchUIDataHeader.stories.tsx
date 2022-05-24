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
import { SearchUIDataHeader } from '../../components/data-display/SearchUI/SearchUIDataHeader';

export default {
  component: SearchUIDataHeader,
  title: 'Search UI/SearchUIDataHeader'
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
    <SearchUIDataHeader />
  </SearchUIContainer>
);

Basic.storyName = 'SearchUIDataHeader';
