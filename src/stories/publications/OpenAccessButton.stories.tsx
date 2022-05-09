import React from 'react';
import { Story } from '@storybook/react';
import { OpenAccessButton } from '../../components/publications/OpenAccessButton';
import { OpenAccessButtonProps } from '../../components/publications/OpenAccessButton/OpenAccessButton';

export default {
  component: OpenAccessButton,
  title: 'Publications/OpenAccessButton'
};

const Template: Story<React.PropsWithChildren<OpenAccessButtonProps>> = (args) => (
  <OpenAccessButton {...args} />
);

export const FromDOI = Template.bind({});
FromDOI.args = {
  doi: '10.1038/nphys4277'
};

export const FromURL = Template.bind({});
FromURL.args = {
  url: 'https://arxiv.org/pdf/1611.06860.pdf'
};

export const Compact = Template.bind({});
Compact.args = {
  doi: '10.1038/nphys4277',
  compact: true
};
