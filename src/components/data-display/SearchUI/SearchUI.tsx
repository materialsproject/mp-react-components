import React, { useEffect } from 'react';
import { SearchUIContextProvider } from './SearchUIContextProvider';
import { SearchUIFilters } from './SearchUIFilters';
import { SearchUIDataTable } from './SearchUIDataTable';
import {
  Column,
  FilterGroup,
  ConditionalRowStyle,
  SearchUIViewType,
  SearchParam,
  SearchParams
} from './types';
import { SearchUISearchBar } from './SearchUISearchBar';
import './SearchUI.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { MaterialsInputType } from '../../data-entry/MaterialsInput';
import { MaterialsInputTypesMap } from '../../data-entry/MaterialsInput/utils';
import { SearchUIDataHeader } from './SearchUIDataHeader';
import { SearchUIDataCards } from './SearchUIDataCards';
import { SearchUIDataView } from './SearchUIDataView';
import { PeriodicTableMode } from '../../data-entry/MaterialsInput/MaterialsInput';
import { InputHelpItem } from '../../data-entry/MaterialsInput/InputHelp/InputHelp';
import classNames from 'classnames';

/**
 * Renders a complete search interface for fetching and filtering data from a REST API.
 * Results are rendered in a table alongside a set of filters that map to properties in the data.
 */
export const SearchUI: React.FC<SearchUIProps> = (props) => {
  return (
    <div id={props.id} className={classNames('mpc-search-ui', props.className)}>
      <Router>
        <SearchUIContextProvider {...props}>
          {props.hasSearchBar && (
            <div className="container is-max-desktop">
              <SearchUISearchBar
                placeholder={props.searchBarPlaceholder}
                periodicTableMode={props.searchBarPeriodicTableMode}
                errorMessage={props.searchBarErrorMessage}
                chemicalSystemSelectHelpText={props.searchBarChemicalSystemSelectHelpText}
                elementsSelectHelpText={props.searchBarElementsSelectHelpText}
                allowedInputTypesMap={props.searchBarAllowedInputTypesMap}
                helpItems={props.searchBarHelpItems}
              />
            </div>
          )}
          <div className="mpc-search-ui-content columns">
            <div className="mpc-search-ui-left column is-narrow is-12-mobile">
              <SearchUIFilters />
            </div>
            <div className="mpc-search-ui-right column">
              <SearchUIDataHeader />
              <SearchUIDataView />
            </div>
          </div>
        </SearchUIContextProvider>
      </Router>
    </div>
  );
};

SearchUI.defaultProps = {
  view: SearchUIViewType.TABLE,
  apiEndpointParams: {},
  resultLabel: 'results',
  hasSortMenu: true,
  hasSearchBar: true,
  conditionalRowStyles: [],
  searchBarPeriodicTableMode: PeriodicTableMode.FOCUS,
  searchBarAllowedInputTypesMap: {
    elements: {
      field: 'elements'
    },
    formula: {
      field: 'formula'
    },
    mpid: {
      field: 'material_ids'
    }
  },
  setProps: () => null,
  debounce: 1000
};

/**
 * Experimental props that have not been fully implemented yet
 */

/**
 * Optionally enable/disable switching between SearchUI result views
 */
// allowViewSwitching?: boolean;

/**
   * Set of options for configuring what is displayed in the result cards
   * when in the cards view.
   * Must be an object with the following properties:
    {
      imageBaseURL: '', // Base of the URL to use to get images for the left side of the card
      imageKey: 'material_id', // Data key to use to append value to the base URL (i.e. the name of the image file). The .png extension is added automatically.
      levelOneKey: 'material_id', // Data key to use for the first line of text on the card
      levelTwoKey: 'formula_pretty', // Data key to use for the second line of text on the card
      levelThreeKeys: [ // List of data keys and labels to display under the first and second line of text
        { key: 'energy_above_hull', label: 'Energy Above Hull' },
        { key: 'formation_energy_per_atom', label: 'Formation Energy' },
      ],
    }
   */
// cardOptions?: any;
