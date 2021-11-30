import React from 'react';
import { Story } from '@storybook/react';
import { Dropdown } from '../../components/navigation/Dropdown';
import { DropdownProps } from '../../components/navigation/Dropdown/Dropdown';

export default {
  component: Dropdown,
  title: 'Navigation/Dropdown'
};

const Template: Story<React.PropsWithChildren<DropdownProps>> = (args) => <Dropdown {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  items: ['One', 'Two', 'Three'],
  triggerLabel: 'Items'
};

export const ChildrenAsItems: Story<React.PropsWithChildren<DropdownProps>> = (args) => (
  <Dropdown triggerLabel="Buttons">
    <div className="button is-primary mb-1">One</div>
    <div className="button is-warning mb-1">Two</div>
    <div className="button is-danger">Three</div>
  </Dropdown>
);

export const IsUp = Template.bind({});
IsUp.args = {
  ...Basic.args,
  isUp: true,
  className: 'mt-10'
};

export const IsArrowless = Template.bind({});
IsArrowless.args = {
  ...Basic.args,
  isArrowless: true
};

export const StaysOpenOnSelection = Template.bind({});
StaysOpenOnSelection.args = {
  ...Basic.args,
  closeOnSelection: false
};
