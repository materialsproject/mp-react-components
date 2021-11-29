import React from 'react';
import { Story } from '@storybook/react';
import { Tooltip } from '../../components/data-display/Tooltip';
import { TooltipProps } from '../../components/data-display/Tooltip/Tooltip';

export default {
  component: Tooltip,
  title: 'Data-Display/Tooltip'
};

const Template: Story<React.PropsWithChildren<TooltipProps>> = (args) => (
  <>
    <button className="button" data-tip data-for={args.id}>
      Tooltip Trigger
    </button>
    <Tooltip {...args} />
  </>
);

export const Basic = Template.bind({});
Basic.args = {
  id: 'Tooltip 1',
  children: 'This is a solid tooltip'
};

export const Floating = Template.bind({});
Floating.args = {
  id: 'Tooltip 2',
  effect: 'float',
  delayShow: 0,
  children: 'This is a floating tooltip'
};
