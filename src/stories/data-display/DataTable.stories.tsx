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

const columns = [
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
    title: 'Crystal System',
    selector: 'symmetry.crystal_system'
  },
  {
    title: 'Is Stable',
    selector: 'is_stable',
    formatType: 'BOOLEAN'
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
  }
] as Column[];

export const Basic = Template.bind({});
Basic.args = {
  disableRichColumnHeaders: true,
  data: materialsRecords,
  columns: columns
};

export const WithPagination = Template.bind({});
WithPagination.args = {
  ...Basic.args,
  columns: [...columns],
  pagination: true
};

export const WithExpandedPagination = Template.bind({});
WithExpandedPagination.args = {
  ...WithPagination.args,
  columns: [...columns],
  paginationIsExpanded: true
};

export const WithHeader = Template.bind({});
WithHeader.args = {
  ...WithPagination.args,
  columns: [...columns],
  hasHeader: true,
  resultLabel: 'material'
};

export const WithoutColumnDefinitions = Template.bind({});
WithoutColumnDefinitions.args = {
  disableRichColumnHeaders: true,
  data: materialsRecords,
  pagination: true
};
const descriptionWithOutColumnDefinitions = `
  You can generate a table without directly supplying column definitions. 
  In this case, the columns will be inferred from the properties in the first object in the data array.
`;
WithoutColumnDefinitions.parameters = {
  docs: {
    description: { story: descriptionWithOutColumnDefinitions }
  }
};

export const WithSelectableRows = Template.bind({});
WithSelectableRows.args = {
  ...WithPagination.args,
  columns: [...columns],
  selectableRows: true
};

export const WithSingleSelectableRows = Template.bind({});
WithSingleSelectableRows.args = {
  ...WithPagination.args,
  columns: [...columns],
  hasHeader: true,
  selectableRows: true,
  singleSelectableRows: true
};
