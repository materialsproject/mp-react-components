import React from 'react';
import { Story } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { SearchUI, SearchUIProps } from '../components/data-display/SearchUI';
import columns from './constants/columns.json';
import filterGroups from './constants/filterGroups.json';
import { FilterGroup } from '../components/data-display/SearchUI/types';

// export default {
//   component: SearchUI,
//   title: 'Data-Display/SearchUI',
// };

// const Template: Story<SearchUIProps> = (args) => <SearchUI {...args} />;

// export const Basic = Template.bind({});
// Basic.args = {
//   resultLabel: "material",
//   columns: columns,
//   filterGroups: filterGroups as FilterGroup[],
//   apiEndpoint: 'https://api.materialsproject.org/summary/'
// };
