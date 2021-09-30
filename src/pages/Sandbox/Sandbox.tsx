import React from 'react';
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
import { Modal } from '../../components/data-display/Modal';

/**
 * View for testing out small new components
 */

export const Sandbox: React.FC = () => {
  return (
    <>
      <h1 className="title">Sandbox</h1>
      <Modal>
        <button className="button">Open Modal</button>
        <div className="panel">
          <div className="panel-heading">Panel</div>
          <div className="panel-block">content</div>
        </div>
      </Modal>
      <Markdown>
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
