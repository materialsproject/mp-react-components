import React, { useState } from 'react';
import { Story } from '@storybook/react';
import { Select } from '../../components/data-entry/Select';
import { SelectProps } from '../../components/data-entry/Select/Select';

export default {
  component: Select,
  title: 'Data-Entry/Select'
};

const Template: Story<React.PropsWithChildren<SelectProps>> = (args) => <Select {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  isClearable: true,
  value: 'NM',
  options: [
    {
      label: 'Ferromagnetic',
      value: 'FM'
    },
    {
      label: 'Non-magnetic',
      value: 'NM'
    },
    {
      label: 'Ferrimagnetic',
      value: 'FiM'
    },
    {
      label: 'Antiferromagnetic',
      value: 'AFM'
    },
    {
      label: 'Unknown',
      value: 'Unknown'
    }
  ]
};

export const Controlled: Story<React.PropsWithChildren<SelectProps>> = (args) => {
  const [state, setState] = useState({ value: 1 });
  return (
    <Select
      value={state.value}
      setProps={setState}
      options={[
        { label: 'One', value: 1 },
        { label: 'Two', value: 2 },
        { label: 'Three', value: 3 }
      ]}
    />
  );
};
