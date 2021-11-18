import React from 'react';
import { Story } from '@storybook/react';
import { SearchUI, SearchUIProps } from '../components/data-display/SearchUI';
import columns from './constants/columns.json';
import filterGroups from './constants/filterGroups.json';
import { FilterGroup } from '../components/data-display/SearchUI/types';

export default {
  component: SearchUI,
  title: 'Data-Display/SearchUI'
};

const Template: Story<SearchUIProps> = (args) => <SearchUI {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  disableRichColumnHeaders: true,
  resultLabel: 'material',
  columns: columns,
  filterGroups: filterGroups as FilterGroup[],
  apiEndpoint: 'https://api.materialsproject.org/summary/'
};

export const Other = Template.bind({});
Other.args = {
  disableRichColumnHeaders: true,
  resultLabel: 'raisin',
  columns: columns,
  filterGroups: filterGroups as FilterGroup[],
  apiEndpoint: 'https://api.materialsproject.org/summary/',
  hasSearchBar: false
};
