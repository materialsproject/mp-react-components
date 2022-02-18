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
import {
  Column,
  ColumnFormat,
  FilterGroup,
  SearchUIViewType
} from '../../components/data-display/SearchUI/types';
import { Enlargeable } from '../../components/data-display/Enlargeable';
import { RangeSlider } from '../../components/data-entry/RangeSlider';
import { DualRangeSlider } from '../../components/data-entry/DualRangeSlider';
import { Switch } from '../../components/data-entry/Switch';
import { SearchUIContainer } from '../../components/data-display/SearchUI/SearchUIContainer';
import filterGroups from '../MaterialsExplorer/filterGroups.json';
import columns from '../MaterialsExplorer/columns.json';
import { PeriodicTableMode } from '../../components/data-entry/MaterialsInput/MaterialsInput';
import { SearchUISearchBar } from '../../components/data-display/SearchUI/SearchUISearchBar';
import { SearchUIFilters } from '../../components/data-display/SearchUI/SearchUIFilters';
import { SearchUIDataHeader } from '../../components/data-display/SearchUI/SearchUIDataHeader';
import { SearchUIDataView } from '../../components/data-display/SearchUI/SearchUIDataView';

/**
 * View for testing out small new components
 */

export const Sandbox: React.FC = () => {
  const [state, setState] = useState({ value: [10, 45] });
  const [switchState, setSwitchState] = useState({ value: false });
  return (
    <>
      <h1 className="title">Sandbox</h1>
      <div>{state.value}</div>
      <div style={{ width: '300px' }}>
        {/* <RangeSlider value={-1} domain={[-2, 3]} step={0.01} isLogScale /> */}
      </div>
      <div style={{ width: '300px' }}>
        {/* <RangeSlider value={-1} domain={[-2, 3]} step={0.1} /> */}
      </div>
      <DualRangeSlider
        value={state.value}
        domain={[-97, 88]}
        step={1}
        setProps={setState}
        ticks={5}
      />
      {/* <DualRangeSlider value={[-1, 1]} domain={[-2, 3]} step={0.01} isLogScale /> */}
      <Switch
        value={switchState.value}
        setProps={setSwitchState}
        hasLabel
        truthyLabel="Enabled"
        falsyLabel="Disabled"
      />
      <SearchUIContainer
        view={SearchUIViewType.TABLE}
        resultLabel="material"
        columns={columns as Column[]}
        filterGroups={filterGroups as FilterGroup[]}
        apiEndpoint={
          process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL + '/summary/' : ''
        }
        autocompleteFormulaUrl={
          process.env.REACT_APP_AUTOCOMPLETE_URL
            ? process.env.REACT_APP_AUTOCOMPLETE_URL
            : undefined
        }
        apiKey={undefined}
        hasSortMenu={true}
        sortField="energy_above_hull"
        sortAscending={true}
        secondarySortField="formula_pretty"
        secondarySortAscending={true}
      >
        <SearchUISearchBar
          placeholder="e.g. Li-Fe or Li,Fe or Li3Fe or mp-19017"
          errorMessage="Please enter a valid formula (e.g. CeZn5), list of elements (e.g. Ce, Zn or Ce-Zn), or ID (e.g. mp-394 or mol-54330)."
          periodicTableMode={PeriodicTableMode.TOGGLE}
          chemicalSystemSelectHelpText="Select elements to search for materials with **only** these elements"
          elementsSelectHelpText="Select elements to search for materials with **at least** these elements"
          allowedInputTypesMap={{
            chemical_system: {
              field: 'chemsys'
            },
            elements: {
              field: 'elements'
            },
            formula: {
              field: 'formula'
            },
            mpid: {
              field: 'material_ids'
            }
          }}
          helpItems={[
            {
              label: 'Search Examples'
            },
            {
              label: 'Include at least elements',
              examples: ['Li,Fe', 'Si,O,K']
            },
            {
              label: 'Include only elements',
              examples: ['Li-Fe', 'Si-O-K']
            },
            {
              label: 'Include only elements plus wildcard elements',
              examples: ['Li-Fe-*-*', 'Si-Fe-*-*-*']
            },
            {
              label: 'Has exact formula',
              examples: ['Li3Fe', 'Eu2SiCl2O3']
            },
            {
              label: 'Has formula plus wildcard atoms',
              examples: ['LiFe*2*', 'Si*']
            },
            {
              label: 'Has Material ID',
              examples: ['mp-149', 'mp-19326']
            },
            {
              label: 'Additional search options available in the filters panel.'
            }
          ]}
        />
        <div className="mpc-search-ui-content columns">
          <div className="mpc-search-ui-left column is-narrow is-12-mobile">
            <SearchUIFilters />
          </div>
          <div className="mpc-search-ui-right column">
            <SearchUIDataHeader />
            <SearchUIDataView />
          </div>
        </div>
      </SearchUIContainer>
    </>
  );
};
