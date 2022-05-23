import React from 'react';
import { Story } from '@storybook/react';
import { Formula } from '../../components/data-display/Formula';
import { FormulaProps } from '../../components/data-display/Formula/Formula';

export default {
  component: Formula,
  title: 'Data-Display/Formula'
};

const Template: Story<React.PropsWithChildren<FormulaProps>> = (args) => <Formula {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: 'MnO2'
};

export const WithDecimals = Template.bind({});
WithDecimals.args = {
  children: 'Ba0.98La0.02SnO3'
};

export const WithVariableRanges = Template.bind({});
WithVariableRanges.args = {
  children: 'Ba1-xEuxSi2O2N2'
};
