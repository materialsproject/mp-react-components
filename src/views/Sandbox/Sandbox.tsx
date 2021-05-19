import React from 'react';
import { BibjsonCard } from '../../components/search/BibjsonCard';
import { BibFilter } from '../../components/search/BibFilter';
import { CrossrefCard } from '../../components/search/CrossrefCard';
import { DownloadButton } from '../../components/search/DownloadButton';
import { DownloadDropdown } from '../../components/search/DownloadDropdown';
import { OpenAccessLink } from '../../components/search/OpenAccessLink';
import crossref from './crossref.json';

/**
 * View for testing out small new components
 */

export const Sandbox: React.FC = () => {
  const bibjsonEntry = {
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
  };

  return (
    <>
      <h1 className="title">Sandbox</h1>
      <DownloadButton className="button" data={[{ test: 1 }]} filename="test">
        Download
      </DownloadButton>
      <DownloadDropdown data={[{ test: 1 }]} filename="test">
        Download as
      </DownloadDropdown>
      <CrossrefCard
        className="box"
        crossrefEntry={crossref.message[0]}
        doi="110.1039/c5ta10330d"
        errorMessage="Error"
        fetchOpenAccessUrl={true}
      />
      <BibjsonCard bibjsonEntry={bibjsonEntry} />
      <OpenAccessLink doi="10.1103/PhysRevB.95.174110" showLoadingText>
        PDF
      </OpenAccessLink>
      <BibFilter bibEntries={crossref.message} format="crossref" />
    </>
  );
};
