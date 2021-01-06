import React from 'react';
import { GlobalSearchBar } from '../components/search/GlobalSearchBar';
import { NavbarDropdown } from '../components/navigation/NavbarDropdown';
import { SearchUI } from '../components/search/SearchUI';
import { materialsColumns, materialsGroups } from '../constants/materials';

/**
 * Component for testing the parts of the Home view
 * Includes navbar and global search bar
 */

export const Home: React.FC = () => {
  return (
    <>
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a className="navbar-item" href="https://bulma.io"></a>

          <a
            role="button"
            className="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-start">
            <a className="navbar-item">Home</a>

            <a className="navbar-item">Documentation</a>
            <NavbarDropdown
              className="has-background-danger-light	"
              label="Test"
              items={[
                {
                  text: 'One',
                  href: '/one',
                },
                {
                  text: 'Two',
                  href: '#two',
                },
                {
                  isDivider: true,
                },
                {
                  isMenuLabel: true,
                  text: 'Label',
                },
                {
                  text: 'Three',
                  href: '#three',
                },
              ]}
            />
          </div>
        </div>
      </nav>
      <div className="mp-home">
        <GlobalSearchBar
          redirectRoute="/materials"
          hidePeriodicTable={true}
          apiKey={process.env.REACT_APP_API_KEY}
          autocompleteFormulaUrl={
            process.env.REACT_APP_AUTOCOMPLETE_URL
              ? process.env.REACT_APP_AUTOCOMPLETE_URL
              : undefined
          }
          tooltip="Type in a comma-separated list of element symbols (e.g. Ga, N), a chemical formula (e.g. C3N), or a material id (e.g. mp-10152). You can also click elements on the periodic table to add them to your search."
          placeholder="Search by elements, SMILES, or mp-id"
        />
      </div>
    </>
  );
};
