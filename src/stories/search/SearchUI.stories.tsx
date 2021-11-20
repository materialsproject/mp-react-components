import React from 'react';
import { Story } from '@storybook/react';
import {
  Title,
  Subtitle,
  Description,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY
} from '@storybook/addon-docs';
import { SearchUI, SearchUIProps } from '../../components/data-display/SearchUI';
import columns from '../constants/columns.json';
import filterGroups from '../constants/filterGroups.json';
import mofColumns from '../constants/mofColumns.json';
import mofFilterGroups from '../constants/mofFilterGroups.json';
import { Column, FilterGroup } from '../../components/data-display/SearchUI/types';
import { PeriodicTableMode } from '../../components/data-entry/MaterialsInput/MaterialsInput';

export default {
  component: SearchUI,
  title: 'Search UI/SearchUI Component',
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <ArgsTable story={PRIMARY_STORY} />
          <Stories />
        </>
      )
    }
  }
};

const Template: Story<SearchUIProps> = (args) => <SearchUI {...args} />;

export const FullyFeatured = Template.bind({});
FullyFeatured.args = {
  disableRichColumnHeaders: true,
  resultLabel: 'material',
  columns: columns as Column[],
  filterGroups: filterGroups as FilterGroup[],
  apiEndpoint: 'https://api.materialsproject.org/summary/',
  searchBarPeriodicTableMode: 'toggle' as PeriodicTableMode,
  searchBarPlaceholder: 'Search by elements, formula, or ID',
  searchBarErrorMessage: 'Invalid search value',
  searchBarAllowedInputTypesMap: {
    elements: {
      field: 'elements'
    },
    formula: {
      field: 'formula'
    },
    mpid: {
      field: 'material_ids'
    }
  },
  searchBarHelpItems: [
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
  ]
};

export const WithMPContribsData = Template.bind({});
WithMPContribsData.parameters = {
  docs: {
    storyDescription: `Imagine this to be a much longer block of text that spans several lines.`
  }
};
WithMPContribsData.args = {
  disableRichColumnHeaders: true,
  isContribs: true,
  resultLabel: 'contribution',
  columns: mofColumns as Column[],
  filterGroups: mofFilterGroups as FilterGroup[],
  apiEndpoint: 'https://contribs-api.materialsproject.org/contributions/',
  apiEndpointParams: { project: 'qmof' },
  hasSearchBar: false
};
