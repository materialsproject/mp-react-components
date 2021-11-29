import React from 'react';
import { Story } from '@storybook/react';
import { BibjsonCard } from '../../components/publications/BibjsonCard';
import { BibjsonCardProps } from '../../components/publications/BibjsonCard/BibjsonCard';

export default {
  component: BibjsonCard,
  title: 'Publications/BibjsonCard'
};

const Template: Story<React.PropsWithChildren<BibjsonCardProps>> = (args) => (
  <BibjsonCard {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  className: 'box',
  bibjsonEntry: {
    journal: 'Physical Review Letters',
    year: '2010',
    doi: '10.1103/PhysRevLett.105.196403',
    author: ['Chan, M. K Y', 'Ceder, G.'],
    title: 'Efficient Band Gap Prediction for Solids'
  }
};
