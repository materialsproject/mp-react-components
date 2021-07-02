import React from 'react';
import { BibjsonCard } from '../../components/publications/BibjsonCard';
import { BibFilter } from '../../components/publications/BibFilter';
import { CrossrefCard } from '../../components/publications/CrossrefCard';
import { DownloadButton } from '../../components/search/DownloadButton';
import { DownloadDropdown } from '../../components/search/DownloadDropdown';
import { PublicationButton } from '../../components/publications/PublicationButton';
import crossref from './crossref.json';
import { DataBlock } from '../../components/search/DataBlock';
import { NavbarDropdown } from '../../components/navigation/NavbarDropdown';
import { Markdown } from '../../components/data-display/Markdown';
import ReactMarkdown from 'react-markdown';

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
        'Snyder, G. Jeffrey'
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
          anchor: 'doi'
        }
      ]
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
        'Snyder, G. Jeffrey'
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
          anchor: 'doi'
        }
      ]
    }
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
          affiliation: []
        },
        {
          given: 'Shishir',
          family: 'Pandya',
          sequence: 'additional',
          affiliation: []
        },
        {
          given: 'Ruijuan',
          family: 'Xu',
          sequence: 'additional',
          affiliation: []
        },
        {
          given: 'Ajay K.',
          family: 'Yadav',
          sequence: 'additional',
          affiliation: []
        },
        {
          given: 'Zhiqi',
          family: 'Liu',
          sequence: 'additional',
          affiliation: []
        },
        {
          given: 'Thomas',
          family: 'Angsten',
          sequence: 'additional',
          affiliation: []
        },
        {
          given: 'Sahar',
          family: 'Saremi',
          sequence: 'additional',
          affiliation: []
        },
        {
          given: 'Mark',
          family: 'Asta',
          sequence: 'additional',
          affiliation: []
        },
        {
          given: 'R.',
          family: 'Ramesh',
          sequence: 'additional',
          affiliation: []
        },
        {
          given: 'Lane W.',
          family: 'Martin',
          sequence: 'additional',
          affiliation: []
        }
      ],
      created: {
        'date-parts': [[2016, 8, 18]],
        'date-time': '2016-08-18T10:25:31Z',
        timestamp: 1471515931000
      },
      publisher: 'Springer Science and Business Media LLC',
      openAccessUrl:
        'https://www.cambridge.org/core/services/aop-cambridge-core/content/view/95E71B1B18C06C02A60359A580051DA3/S215968591600029Xa.pdf/div-class-title-frontiers-in-strain-engineered-multifunctional-ferroic-materials-div.pdf'
    }
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
        preventOpenAccessFetch={false}
      />
      <CrossrefCard
        className="box"
        crossrefEntry={crossref.message[0]}
        identifier="110.1039/c5ta10330d"
        errorMessage="Error"
        preventOpenAccessFetch={true}
      />
      <BibjsonCard bibjsonEntry={bibjsonEntry} />
      <PublicationButton doi="10.1103/PhysRevB.95.174110" tagClassName="is-white" />
      <DataBlock
        className="box"
        columns={[
          {
            name: 'Material ID',
            selector: 'material_id',
            format: 'LINK',
            formatOptions: {
              baseUrl: 'https://lbl.gov',
              target: '_blank',
              linkLabelKey: 'formula_pretty'
            },
            minWidth: '300px',
            maxWidth: '300px',
            hiddenBottom: true
          },
          {
            name: 'Formula',
            selector: 'formula_pretty',
            format: 'FORMULA',
            minWidth: '300px',
            maxWidth: '300px',
            hiddenBottom: true
          },
          {
            name: 'Data',
            selector: 'data',
            format: 'ARRAY',
            formatOptions: {
              arrayTooltipsKey: 'dataTooltips'
            }
            // maxWidth: '200px'
          },
          {
            name: 'Tables',
            selector: 'tables',
            format: 'ARRAY',
            formatOptions: {
              arrayTooltipsKey: 'tablesTooltips',
              arrayLinksKey: 'tablesLinks',
              arrayLinksShowDownload: false,
              arrayChipType: 'dynamic-publications'
            }
            // maxWidth: '200px'
          },
          {
            name: 'Description',
            selector: 'description',
            hiddenTop: true
          }
        ]}
        data={{
          material_id: 'mp-777',
          formula_pretty: 'MnO2 MnO2 MnO2 MnO2 MnO2 MnO2',
          volume: 34.88345346,
          data: [1, 'LiAl(SiO3)2', 3, 1, 2, 3, 1, 2, 3, 1, 2],
          dataTooltips: ['test test test test test test test test test', 'test', 'test', 'test'],
          tables: [1, 2, 3],
          tablesTooltips: ['test', 'test'],
          tablesLinks: ['https://doi.org/10.1038/sdata.2017.85', 'https://lbl.gov'],
          description:
            'Ab-initio electronic transport database for inorganic materials. Here are reported the\naverage of the eigenvalues of conductivity effective mass (mₑᶜᵒⁿᵈ), the Seebeck coefficient (S),\nthe conductivity (σ), the electronic thermal conductivity (κₑ), and the Power Factor (PF) at a\ndoping level of 10¹⁸ cm⁻³ and at a temperature of 300 K for n- and p-type. Also, the maximum\nvalues for S, σ, PF, and the minimum value for κₑ chosen among the temperatures [100, 1300] K,\nthe doping levels [10¹⁶, 10²¹] cm⁻³, and doping types are reported. The properties that depend\non the relaxation time are reported divided by the constant value 10⁻¹⁴. The average of the\neigenvalues for all the properties at all the temperatures, doping levels, and doping types are\nreported in the tables for each entry. A legend of the columns of the table is provided below.'
        }}
      />
      <DataBlock
        className="box"
        data={{
          material_id: 'mp-777',
          formula_pretty: 'MnO2',
          volume: 34.88345346,
          data: [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3],
          tables: [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3],
          description:
            'Ab-initio electronic transport database for inorganic materials. Here are reported the\naverage of the eigenvalues of conductivity effective mass (mₑᶜᵒⁿᵈ), the Seebeck coefficient (S),\nthe conductivity (σ), the electronic thermal conductivity (κₑ), and the Power Factor (PF) at a\ndoping level of 10¹⁸ cm⁻³ and at a temperature of 300 K for n- and p-type. Also, the maximum\nvalues for S, σ, PF, and the minimum value for κₑ chosen among the temperatures [100, 1300] K,\nthe doping levels [10¹⁶, 10²¹] cm⁻³, and doping types are reported. The properties that depend\non the relaxation time are reported divided by the constant value 10⁻¹⁴. The average of the\neigenvalues for all the properties at all the temperatures, doping levels, and doping types are\nreported in the tables for each entry. A legend of the columns of the table is provided below.'
        }}
      />
      <Markdown>
        {`
        # This is a header
        
        And this is a paragraph

        ## This is a secondary header

        ~~~css
        h1 {
          color: red;
        }
        ~~~

        ~~~python

        from mp_api.matproj import MPRester

        with MPRester(api_key="your_api_key_here") as mpr:

            # search across basic materials information
            # for example, materials between 2 and 4 sites
            materials_docs = mpr.materials.search(nsites=[2, 4])

            # search for materials by thermodynamic properties
            # for example, energy above hull below 0.2 eV/atom
            thermo_docs = mpr.thermo.search(energy_above_hull_max=0.2)
            
        # access either the entire document
        print(materials_doc[0])
        
        # or individual fields
        print(thermo_docs[0].energy_above_hull)
        ~~~

        ~strike~
        
        Lift($L$) can be determined by Lift Coefficient ($C_L$) like the following equation.

        $$
        L = \\frac{1}{2} \\rho v^2 S C_L
        $$

        | Syntax      | Description |
        | ----------- | ----------- |
        | Header      | Title       |
        | Paragraph   | Text        |
        `}
      </Markdown>
    </>
  );
};
