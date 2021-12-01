import React, { useState } from 'react';
import { Story } from '@storybook/react';
import { DualRangeSlider } from '../../components/data-entry/DualRangeSlider';
import { DualRangeSliderProps } from '../../components/data-entry/DualRangeSlider/DualRangeSlider';
import { SelectableTable, SelectableTableProps } from '../../components/periodic-table/table-state';
import { PeriodicContext } from '../../components/periodic-table/periodic-table-state/periodic-selection-context';
import { TableLayout } from '../../components/periodic-table/periodic-table-component/periodic-table.component';

export default {
  component: SelectableTable,
  title: 'Data-Entry/PeriodicTable'
};

const Template: Story<React.PropsWithChildren<SelectableTableProps>> = (args) => (
  <PeriodicContext>
    <SelectableTable {...args} />
  </PeriodicContext>
);

export const Basic = Template.bind({});
Basic.args = {
  forceTableLayout: TableLayout.MINI,
  className: 'max-750'
};
