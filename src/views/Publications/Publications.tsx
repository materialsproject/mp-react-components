import React from 'react';
import { BibjsonCard } from '../../components/search/BibjsonCard';
import { BibjsonFilter } from '../../components/search/BibjsonFilter';
import mpPapers from './mp-papers.json';

/**
 * Component for testing the Publications filter
 */

export const Publications: React.FC = () => {
  const bibjson = [
    {
      journal: 'Journal of Materials Chemistry A',
      title:
        'YCuTe2: a member of a new class of thermoelectric materials with CuTe4-based layered structure',
      author: [
        'Aydemir, Umut',
        'P\u00f6hls, Jan-Hendrik',
        'Zhu, Hong',
        'Hautier, Geoffroy',
        'Bajaj, Saurabh',
        'Gibbs, Zachary M.',
        'Chen, Wei',
        'Li, Guodong',
        'Ohno, Saneyuki',
        'Broberg, Danny',
        'Kang, Stephen Dongmin',
        'Asta, Mark',
        'Ceder, Gerbrand',
        'White, Mary Anne',
        'Persson, Kristin',
        'Jain, Anubhav',
        'Snyder, G. Jeffrey',
      ],
      pages: '2461--2472',
      number: '7',
      volume: '4',
      publisher: 'Royal Society of Chemistry (RSC)',
      year: '2016',
      url: 'https://doi.org/10.1039/c5ta10330d',
      doi: '10.1039/c5ta10330d',
      ENTRYTYPE: 'article',
      ID: 'Aydemir2016',
      link: [
        {
          url: 'https://doi.org/10.1039/c5ta10330d',
          anchor: 'doi',
        },
      ],
    },
    {},
  ];

  return (
    <>
      <h1 className="title">Publications</h1>
      <BibjsonFilter bibjson={mpPapers} sortField="year" resultClassName="box" />
    </>
  );
};
