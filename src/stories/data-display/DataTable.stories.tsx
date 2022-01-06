import React from 'react';
import { Story } from '@storybook/react';
import { Column } from '../../components/data-display/SearchUI/types';
import { DataTable } from '../../components/data-display/DataTable';
import { DataTableProps } from '../../components/data-display/DataTable/DataTable';
import materialsRecords from '../constants/materialsRecords.json';

export default {
  component: DataTable,
  title: 'Data-Display/DataTable'
};

const Template: Story<React.PropsWithChildren<DataTableProps>> = (args) => <DataTable {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  disableRichColumnHeaders: true,
  data: materialsRecords,
  columns: [
    {
      title: 'Material ID',
      selector: 'material_id',
      formatType: 'LINK',
      formatOptions: {
        baseUrl: 'https://next-gen.materialsproject.org',
        target: '_blank'
      },
      minWidth: '100px'
    },
    {
      title: 'Formula',
      selector: 'formula_pretty',
      formatType: 'FORMULA',
      minWidth: '100px'
    },
    {
      title: 'Volume',
      selector: 'volume',
      formatType: 'FIXED_DECIMAL',
      formatOptions: {
        decimals: 2
      }
    },
    {
      title: 'Density',
      selector: 'density',
      formatType: 'FIXED_DECIMAL',
      formatOptions: {
        decimals: 2
      }
    },
    {
      title: 'Crystal System',
      selector: 'symmetry.crystal_system'
    },
    {
      title: 'Is Stable',
      selector: 'is_stable',
      formatType: 'BOOLEAN'
    }
  ] as Column[]
};

export const WithPagination = Template.bind({});
WithPagination.args = {
  ...Basic.args,
  pagination: true
};

export const WithExpandedPagination = Template.bind({});
WithExpandedPagination.args = {
  ...WithPagination.args,
  paginationIsExpanded: true
};

export const WithHeader = Template.bind({});
WithHeader.args = {
  ...WithPagination.args,
  hasHeader: true,
  resultLabel: 'material'
};
