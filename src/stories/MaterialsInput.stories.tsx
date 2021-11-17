import React from 'react';
import { Story } from '@storybook/react';
import { MaterialsInput, MaterialsInputProps } from '../components/data-entry/MaterialsInput';
import {
  MaterialsInputType,
  PeriodicTableMode
} from '../components/data-entry/MaterialsInput/MaterialsInput';

export default {
  component: MaterialsInput,
  title: 'Data-Entry/MaterialsInput'
};

const Template: Story<MaterialsInputProps> = (args) => (
  <div style={{ width: '750px' }}>
    <MaterialsInput {...args} />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  periodicTableMode: 'toggle' as PeriodicTableMode,
  allowedInputTypes: [
    'elements' as MaterialsInputType,
    'formula' as MaterialsInputType,
    'mpid' as MaterialsInputType
  ]
};

export const Secondary = Template.bind({});
Secondary.args = { ...Primary.args };
