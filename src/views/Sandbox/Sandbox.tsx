import React from 'react';
import { BibjsonCard } from '../../components/search/BibjsonCard';
import { BibFilter } from '../../components/search/BibFilter';
import { CrossrefCard } from '../../components/search/CrossrefCard';
import { DownloadButton } from '../../components/search/DownloadButton';
import { DownloadDropdown } from '../../components/search/DownloadDropdown';
import { OpenAccessButton } from '../../components/search/OpenAccessButton';
import crossref from './crossref.json';
import { DataBlock } from '../../components/search/DataBlock';

/**
 * View for testing out small new components
 */

export const Sandbox: React.FC = () => {
  const bibjsonEntry = [
    {
      journal: 'Journal of Materials Chemistry A',
      title:
        'AAAA YCuTe2: a member of a new class of thermoelectric materials with CuTe4-based layered structure',
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
      year: '2000',
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
  ];

  const crossrefEntries = [
    {
      DOI: '10.1557/mrc.2016.29',
      title: ['Frontiers in strain-engineered multifunctional ferroic materials'],
      author: [
        {
          given: 'Joshua C.',
          family: 'Agar',
          sequence: 'first',
          affiliation: [],
        },
        {
          given: 'Shishir',
          family: 'Pandya',
          sequence: 'additional',
          affiliation: [],
        },
        {
          given: 'Ruijuan',
          family: 'Xu',
          sequence: 'additional',
          affiliation: [],
        },
        {
          given: 'Ajay K.',
          family: 'Yadav',
          sequence: 'additional',
          affiliation: [],
        },
        {
          given: 'Zhiqi',
          family: 'Liu',
          sequence: 'additional',
          affiliation: [],
        },
        {
          given: 'Thomas',
          family: 'Angsten',
          sequence: 'additional',
          affiliation: [],
        },
        {
          given: 'Sahar',
          family: 'Saremi',
          sequence: 'additional',
          affiliation: [],
        },
        {
          given: 'Mark',
          family: 'Asta',
          sequence: 'additional',
          affiliation: [],
        },
        {
          given: 'R.',
          family: 'Ramesh',
          sequence: 'additional',
          affiliation: [],
        },
        {
          given: 'Lane W.',
          family: 'Martin',
          sequence: 'additional',
          affiliation: [],
        },
      ],
      created: {
        'date-parts': [[2016, 8, 18]],
        'date-time': '2016-08-18T10:25:31Z',
        timestamp: 1471515931000,
      },
      publisher: 'Springer Science and Business Media LLC',
      openAccessUrl:
        'https://www.cambridge.org/core/services/aop-cambridge-core/content/view/95E71B1B18C06C02A60359A580051DA3/S215968591600029Xa.pdf/div-class-title-frontiers-in-strain-engineered-multifunctional-ferroic-materials-div.pdf',
    },
  ];

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
        identifier="110.1039/c5ta10330d"
        errorMessage="Error"
        fetchOpenAccessUrl={true}
      />
      <BibjsonCard bibjsonEntry={bibjsonEntry} />
      <OpenAccessButton doi="10.1103/PhysRevB.95.174110" showLoadingText>
        PDF
      </OpenAccessButton>
      <DataBlock
        className="box"
        columns={[
          {
            name: 'Material ID',
            selector: 'material_id',
            format: 'LINK',
            formatArg: '/materials/',
          },
          {
            name: 'Formula',
            selector: 'formula_pretty',
            format: 'FORMULA',
          },
          {
            name: 'Volume',
            selector: 'volume',
            format: 'FIXED_DECIMAL',
            formatArg: 2,
          },
          {
            name: 'Data',
            selector: 'data',
            format: 'ARRAY',
            arrayTooltipsKey: 'dataTooltips',
          },
          {
            name: 'Tables',
            selector: 'tables',
            format: 'ARRAY',
            arrayTooltipsKey: 'tablesTooltips',
          },
        ]}
        data={{
          material_id: 'mp-777',
          formula_pretty: 'MnO2',
          volume: 34.88345346,
          data: [1, 2, 3, 1, 2, 3, 1, 2, 3],
          dataTooltips: ['test', 'test', 'test', 'test'],
          tables: [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3],
          tablesTooltips: ['test', 'test'],
        }}
      />
    </>
  );
};
