import React from 'react';
import { Story } from '@storybook/react';
import { CrossrefCard } from '../../components/publications/CrossrefCard';
import { CrossrefCardProps } from '../../components/publications/CrossrefCard/CrossrefCard';

export default {
  component: CrossrefCard,
  title: 'Publications/CrossrefCard'
};

const Template: Story<React.PropsWithChildren<CrossrefCardProps>> = (args) => (
  <CrossrefCard {...args} />
);

export const PreFetched = Template.bind({});
PreFetched.args = {
  className: 'box',
  crossrefEntry: {
    DOI: '10.1093/mnras/stu869',
    title: ['Do cement nanoparticles exist in space?'],
    author: [
      {
        given: 'G.',
        family: 'Bilalbegovi\u0107',
        sequence: 'first',
        affiliation: []
      },
      {
        given: 'A.',
        family: 'Maksimovi\u0107',
        sequence: 'additional',
        affiliation: []
      },
      {
        given: 'V.',
        family: 'Moha\u010dek-Gro\u0161ev',
        sequence: 'additional',
        affiliation: []
      }
    ],
    created: {
      'date-parts': [[2014, 6, 12]],
      'date-time': '2014-06-12T04:25:57Z',
      timestamp: 1402547157000
    },
    publisher: 'Oxford University Press (OUP)',
    'container-title': ['Monthly Notices of the Royal Astronomical Society'],
    openAccessUrl: 'https://academic.oup.com/mnras/article-pdf/442/2/1319/5699785/stu869.pdf'
  }
};

export const FromDOI = Template.bind({});
FromDOI.args = {
  className: 'box',
  identifier: '10.1093/mnras/stu869'
};
