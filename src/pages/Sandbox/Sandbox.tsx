import React, { useState } from 'react';
import { BibjsonCard } from '../../components/publications/BibjsonCard';
import { BibFilter } from '../../components/publications/BibFilter';
import { CrossrefCard } from '../../components/publications/CrossrefCard';
import { DownloadButton } from '../../components/data-display/DownloadButton';
import { DownloadDropdown } from '../../components/data-display/DownloadDropdown';
import { PublicationButton } from '../../components/publications/PublicationButton';
import crossref from './crossref.json';
import { DataBlock } from '../../components/data-display/DataBlock';
import { NavbarDropdown } from '../../components/navigation/NavbarDropdown';
import { Markdown } from '../../components/data-display/Markdown';
import ReactMarkdown from 'react-markdown';
import { Dropdown } from '../../components/navigation/Dropdown';
import { Select } from '../../components/data-entry/Select';
import { Link } from '../../components/navigation/Link';
import { Navbar } from '../../components/navigation/Navbar/Navbar';
import periodicTableImage from '../../assets/images/periodictable.png';
import { ModalContextProvider, Modal, ModalTrigger } from '../../components/data-display/Modal';
import { Tab as ReactTab, Tabs as ReactTabs, TabList, TabPanel } from 'react-tabs';
import { Tabs } from '../../components/navigation/Tabs';
import { DataTable } from '../../components/data-display/DataTable';
import { ColumnFormat } from '../../components/data-display/SearchUI/types';

/**
 * View for testing out small new components
 */

export const Sandbox: React.FC = () => {
  const [state, setState] = useState({
    selectedRows: [],
    clickedRow: null,
    data: [
      { a: 1, b: 2 },
      { a: 3, b: 7 },
      { a: 1, b: 2 },
      { a: 3, b: 7 },
      { a: 3, b: 7 },
      { a: 3, b: 7 },
      { a: 1, b: 99 },
      { a: 3, b: 7 },
      { a: 1, b: 44 },
      { a: 3, b: 7 },
      { a: 1, b: 321 },
      { a: 6, b: 7 },
      { a: 45, b: 2 },
      { a: 3, b: 7 },
      { a: 2341, b: 88 },
      { a: 3, b: 7 },
      { a: 1, b: 2 },
      { a: 3, b: 45 },
      { a: 1, b: 2 },
      { a: 345, b: 7 },
      { a: 1, b: 2 },
      { a: 567, b: 77564 },
      { a: 1, b: 756 },
      { a: 67, b: 7 },
      { a: 1, b: 2 },
      { a: 3, b: 7 },
      { a: 1, b: 65 },
      { a: 668, b: 7 },
      { a: 1, b: 2 },
      { a: 3, b: 7 },
      { a: 1, b: 2 },
      { a: 3, b: 7 },
      { a: 3, b: 7 },
      { a: 3, b: 7 },
      { a: 1, b: 99 },
      { a: 3, b: 7 },
      { a: 1, b: 44 },
      { a: 3, b: 7 },
      { a: 1, b: 321 },
      { a: 6, b: 7 },
      { a: 45, b: 2 },
      { a: 3, b: 7 },
      { a: 2341, b: 88 },
      { a: 3, b: 7 },
      { a: 1, b: 2 },
      { a: 3, b: 45 },
      { a: 1, b: 2 },
      { a: 345, b: 7 },
      { a: 1, b: 2 },
      { a: 567, b: 77564 },
      { a: 1, b: 756 },
      { a: 67, b: 7 },
      { a: 1, b: 2 },
      { a: 3, b: 7 },
      { a: 1, b: 65 },
      { a: 668, b: 7 },
      { a: 1, b: 2 },
      { a: 3, b: 7 },
      { a: 1, b: 2 },
      { a: 3, b: 7 },
      { a: 3, b: 7 },
      { a: 3, b: 7 },
      { a: 1, b: 99 },
      { a: 3, b: 7 },
      { a: 1, b: 44 },
      { a: 3, b: 7 },
      { a: 1, b: 321 },
      { a: 6, b: 7 },
      { a: 45, b: 2 },
      { a: 3, b: 7 },
      { a: 2341, b: 88 },
      { a: 3, b: 7 },
      { a: 1, b: 2 },
      { a: 3, b: 45 },
      { a: 1, b: 2 },
      { a: 345, b: 7 },
      { a: 1, b: 2 },
      { a: 567, b: 77564 },
      { a: 1, b: 756 },
      { a: 67, b: 7 },
      { a: 1, b: 2 },
      { a: 3, b: 7 },
      { a: 1, b: 65 },
      { a: 668, b: 7 }
    ]
  });
  const [rows, setRows] = useState([]);
  return (
    <>
      <h1 className="title">Sandbox</h1>
      <p>{JSON.stringify(state.selectedRows)}</p>
      <DataTable
        setProps={setState}
        selectableRows
        singleSelectableRows
        pagination
        paginationIsExpanded
        hasHeader
        footer="This is the footer"
        columns={[
          {
            selector: 'a',
            title: 'A',
            tooltip:
              'Esse non proident non quis et nostrud aliqua occaecat. Tempor velit do mollit sint non. Adipisicing id laborum enim commodo aliqua consequat sint aute ad aliqua ipsum nisi. Mollit eu proident occaecat pariatur do est ut pariatur quis eu. Non tempor aliquip aute laborum adipisicing culpa labore labore reprehenderit.',
            units: 'cm',
            formatType: ColumnFormat.FIXED_DECIMAL,
            formatOptions: {
              decimals: 2
            },
            right: false
          },
          {
            selector: 'b',
            title: 'B',
            units: 'cm',
            formatType: ColumnFormat.FIXED_DECIMAL,
            formatOptions: {
              decimals: 2
            }
          }
        ]}
        data={state.data}
      />
    </>
  );
};
