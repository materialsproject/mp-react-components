import React, { useState } from 'react';
import { Story } from '@storybook/react';
import { RangeSlider } from '../../components/data-entry/RangeSlider';
import { RangeSliderProps } from '../../components/data-entry/RangeSlider/RangeSlider';

export default {
  component: RangeSlider,
  title: 'Data-Entry/RangeSlider'
};

const Template: Story<React.PropsWithChildren<RangeSliderProps>> = (args) => (
  <RangeSlider {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  domain: [0, 100],
  step: 1,
  value: 10
};

export const WithoutDebounce = Template.bind({});
WithoutDebounce.args = {
  ...Basic.args,
  debounce: 0
};

export const WithTicksOnLimitsOnly = Template.bind({});
WithTicksOnLimitsOnly.args = {
  ...Basic.args,
  ticks: 2
};

export const WithLogScale = Template.bind({});
WithLogScale.args = {
  ...Basic.args,
  domain: [-2, 3],
  value: -1,
  step: 0.01,
  isLogScale: true
};
