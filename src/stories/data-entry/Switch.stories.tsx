import React, { useState } from 'react';
import { Story } from '@storybook/react';
import { Switch } from '../../components/data-entry/Switch';
import { SwitchProps } from '../../components/data-entry/Switch/Switch';

export default {
  component: Switch,
  title: 'Data-Entry/Switch'
};

export const Basic: Story<React.PropsWithChildren<SwitchProps>> = (args) => {
  const [state, setState] = useState({ value: false });
  return <Switch value={state.value} setProps={setState} />;
};

export const WithLabel: Story<React.PropsWithChildren<SwitchProps>> = (args) => {
  const [state, setState] = useState({ value: false });
  return <Switch value={state.value} setProps={setState} hasLabel={true} />;
};

export const WithCustomLabel: Story<React.PropsWithChildren<SwitchProps>> = (args) => {
  const [state, setState] = useState({ value: false });
  return (
    <Switch
      value={state.value}
      setProps={setState}
      hasLabel={true}
      truthyLabel="Enabled"
      falsyLabel="Disabled"
    />
  );
};
