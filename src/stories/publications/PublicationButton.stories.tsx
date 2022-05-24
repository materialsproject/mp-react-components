import React from 'react';
import { Story } from '@storybook/react';
import { PublicationButton } from '../../components/publications/PublicationButton';
import { PublicationButtonProps } from '../../components/publications/PublicationButton/PublicationButton';

export default {
  component: PublicationButton,
  title: 'Publications/PublicationButton'
};

const Template: Story<React.PropsWithChildren<PublicationButtonProps>> = (args) => (
  <PublicationButton {...args} />
);

export const FromDOI = Template.bind({});
FromDOI.args = {
  doi: '10.1093/mnras/stu869'
};

export const FromURL = Template.bind({});
FromURL.args = {
  url: 'https://academic.oup.com/mnras/article/442/2/1319/980862'
};

export const FromURLWithCustomLabel = Template.bind({});
FromURLWithCustomLabel.args = {
  url: 'https://academic.oup.com/mnras/article/442/2/1319/980862',
  children: 'Cement Reference'
};

export const Compact = Template.bind({});
Compact.args = {
  doi: '10.1093/mnras/stu869',
  compact: true
};

export const WithBibTooltip = Template.bind({});
WithBibTooltip.args = {
  doi: '10.1093/mnras/stu869',
  showTooltip: true
};
