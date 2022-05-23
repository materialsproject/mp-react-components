import React from 'react';
import { Story } from '@storybook/react';
import { BibCard } from '../../components/publications/BibCard';
import { BibCardProps } from '../../components/publications/BibCard/BibCard';

export default {
  component: BibCard,
  title: 'Publications/BibCard'
};

const Template: Story<React.PropsWithChildren<BibCardProps>> = (args) => <BibCard {...args} />;
const data = {
  journal: 'Physical Review B',
  year: '2017',
  issn: '24699969',
  doi: '10.1103/PhysRevB.95.174110',
  author: ['Angsten, Thomas', 'Martin, Lane W.', 'Asta, Mark'],
  title:
    'Orientation-Dependent Properties of Epitaxially Strained Perovskite Oxide Thin Films: Insights from First-Principles Calculations',
  ENTRYTYPE: 'article',
  ID: 'angsten2017',
  openAccessUrl: 'https://lbl.gov',
  link: [
    {
      url: 'https://doi.org/10.1103/PhysRevB.95.174110',
      anchor: 'doi'
    }
  ]
};

export const Basic = Template.bind({});
Basic.args = {
  className: 'box',
  title:
    'Orientation-Dependent Properties of Epitaxially Strained Perovskite Oxide Thin Films: Insights from First-Principles Calculations',
  author: ['Angsten, Thomas', 'Martin, Lane W.', 'Asta, Mark'],
  journal: 'Physical Review B',
  doi: '10.1103/PhysRevB.95.174110',
  year: '2017'
};
