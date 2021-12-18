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

/**
 * View for testing out small new components
 */

export const Sandbox: React.FC = () => {
  const [state, setState] = useState({ tabIndex: 1, active: false });
  return (
    <>
      <h1 className="title">Sandbox</h1>
      <Tabs labels={['Tab 1', 'Tab2']}>
        <div>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum excepturi dolor eveniet
          doloremque vero autem eaque magni. Quo quis maiores illo cum! Quasi cum fugit animi quis
          praesentium saepe veritatis.
        </div>
        <div>Content 2</div>
      </Tabs>
      <ReactTabs selectedTabClassName="is-active">
        <div className="tabs">
          <TabList>
            <ReactTab>
              <a>React 1</a>
            </ReactTab>
            <ReactTab>
              <a>React 2</a>
            </ReactTab>
          </TabList>
        </div>
        <TabPanel>Panel 1</TabPanel>
        <TabPanel>Panel 2</TabPanel>
      </ReactTabs>
      <button className="button" onClick={() => setState({ ...state, active: true })}>
        Out of context modal trigger
      </button>
      <ModalContextProvider active={state.active} forceAction={true} setProps={setState}>
        <ModalTrigger>
          <button className="button">Open Modal</button>
        </ModalTrigger>
        <Modal>
          <div className="panel">
            <div className="panel-heading">Panel</div>
            <div className="panel-block">content</div>
            <button className="button" onClick={() => setState({ ...state, active: false })}>
              Save
            </button>
          </div>
        </Modal>
      </ModalContextProvider>
      <Dropdown triggerIcon="fa fa-pizza-slice" isArrowless={true}>
        <div className="dropdown-item">One</div>
        <div className="dropdown-item">Two</div>
      </Dropdown>
      <Markdown>{`## Heading 2`}</Markdown>
      <Markdown style={{ height: '150vh' }}>
        {`
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
      `}
      </Markdown>
    </>
  );
};
