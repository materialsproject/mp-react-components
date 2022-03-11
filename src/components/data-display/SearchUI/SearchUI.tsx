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

export interface SearchUIProps {
  /**
   * The ID used to identify this component in Dash callbacks
   */
  id?: string;

  /**
   * Dash-assigned callback that should be called whenever any of the
   * properties change
   */
  setProps?: (value: any) => any;

  /**
   * Class name(s) to add to in addition to the default top-level class
   */
  className?: string;

  /**
   * An array of column definition objects to control what is rendered in the results table.
   * See `Column` documentation for specifics on how to construct `Column` objects.
   */
  columns: Column[];

  /**
   * An array of filter groups and their respective array of filters.
   * A filter group is a collapsible section of the filters panel that contains one or more filters.
   * A filter is a type of input element that filters the data based on its value.
   * See `FilterGroup` documentation for specifics on how to construct `FilterGroup` and `Filter` objects.
   */
  filterGroups: FilterGroup[];

  /**
   * The URL endpoint to the API that this component should query
   */
  apiEndpoint: string;

  /**
   * Object of query params that will be automatically added for every search.
   * This can be used to scope down a SearchUI to a specific subset of a larger endpoint.
   *
   * e.g. `{ project: 'open_catalyst_project' }`
   */
  apiEndpointParams?: SearchParams;

  /**
   * The URL endpoint for fetching autocompletion results
   */
  autocompleteFormulaUrl?: string;

  /**
   * API key (if needed) that will be used when making queries
   */
  apiKey?: string;

  /**
   * A noun in singular form to describe what a result represents (e.g. "material").
   * Note that only some special plural mappings are handled automatically (e.g. "battery" --> "batteries").
   * In all other cases, an "s" is appended to `resultLabel`.
   */
  resultLabel?: string;

  /**
   * Optionally include/exclude the top search bar
   * @default true
   */
  hasSearchBar?: boolean;

  /**
   * Optionally add a help icon with a tooltip in the search bar
   * This should be used to provide instructions on how to use the search bar
   * e.g.
   *  "Type in a comma-separated list of element symbols (e.g. Ga, N),
   *  a chemical formula (e.g. C3N), or a material id (e.g. mp-10152).
   *  You can also click elements on the periodic table to add them to your search."
   */
  searchBarTooltip?: string;

  /**
   * Optionally add a string of text to show up in the top-level search bar
   */
  searchBarPlaceholder?: string;

  /**
   * Custom error message to display with the top-level search bar
   * if the user types an invalid value
   */
  searchBarErrorMessage?: string;

  /**
   * Object with keys of allowed input types for the top-level search bar.
   * Keys must be one of these supported input types: "elements", "formula", "mpid", "smiles", "text."
   * Each key object must have a "field" property which maps the input type
   * to a valid data filter field in the API.
   * 
   * e.g.
    
    {
      formula: {
        field: 'formula'
      },
      elements: {
        field: 'elements'
      },
      mpid: {
        field: 'material_ids'
      }
    }
   */
  searchBarAllowedInputTypesMap?: MaterialsInputTypesMap;

  /**
   * Modes for showing the periodic table with the top search bar
   * "toggle": render a button for toggling visibility of periodic table
   * "focus": show periodic table when input is focuses, hide on blur
   * "none": never show the periodic table for this input
   * @default 'toggle'
   */
  searchBarPeriodicTableMode?: PeriodicTableMode;

  /**
   * Search examples to include below the search bar input.
   * This will display when input is in focus and empty, or when the help button is clicked.
   * Expects an array of items with the following properties:
   * "label": text to display before examples. If only "label" and no "examples", text will render as small.
   * "examples": array of input examples. These will become clickable and will update the input value. 
   * e.g.
    [
      {
        label: 'Search Examples'
      },
      {
        label: 'Include at least elements',
        examples: ['Li,Fe', 'Si,O,K']
      }
    ]
   */
  searchBarHelpItems?: InputHelpItem[];

  /**
   * Text to display in the periodic table help box when
   * the chemical system selection mode is selected.
   * Supports markdown.
   */
  searchBarChemicalSystemSelectHelpText?: string;

  /**
   * Text to display in the periodic table help box when
   * the elements selection mode is selected.
   * Supports markdown.
   */
  searchBarElementsSelectHelpText?: string;

  /**
   * Optionally include/exclude the menu for dynamically controlling sort options
   * @default true
   */
  hasSortMenu?: boolean;

  /**
   * Optionally include a field to sort by on initial load
   * Must be a valid field and included in your list of columns
   */
  sortField?: string;

  /**
   * If including a sortField, set whether it should ascend by default
   * True for ascending, False for descending
   */
  sortAscending?: boolean;

  /**
   * Optionally include a secondary sort field. If the sortField ever becomes the same as
   * the secondarySortField, the secondary field is removed.
   * Must be a valid field and included in your list of columns.
   */
  secondarySortField?: string;

  /**
   * If including a secondarySortField, set whether it should ascend by default.
   * True for ascending, False for descending.
   */
  secondarySortAscending?: boolean;

  sortKey?: string;

  skipKey?: string;

  limitKey?: string;

  fieldsKey?: string;

  /**
   * List of conditions for styling rows based on a property (selector) and a value.
   * Note that this prop currently only supports checking for
   * value equivalence (i.e. row[selector] === value).
   * See `ConditionalRowStyle` documentation for how to construct `ConditionalRowStyle` conditions.
   */
  conditionalRowStyles?: ConditionalRowStyle[];

  /**
   * Optionally include/exclude checkboxes next to rows for selecting
   */
  selectableRows?: boolean;

  /**
   * Property to maintain the state of selected rows so that
   * they are accessible via Dash callback
   */
  selectedRows?: any[];

  /**
   * Set the initial results view to one of the preset
   * SearchUI views: 'table', or 'synthesis'.
   * Note that these options may expand in the future.
   */
  view?: SearchUIViewType;

  /**
   * Set to `true` if the `apiEndpoint` points to MPContribs. This allows the component to handle
   * small inconsistencies between the MPContribs API and the Materials Project API.
   */
  isContribs?: boolean;

  /**
   * Amount of time in milliseconds that should elapse between a user entering
   * a value in the filters panel and a new query being triggered.
   */
  debounce?: number;

  /**
   * This is a temporary solution to allow SearchUI's to render in Storybook.
   * There is an issue with the dynamic column header components that causes
   * Storybook to crash. Rendering column headers as plain strings fixes the problem.
   * Note that this will disable column tooltips and unit labels.
   */
  disableRichColumnHeaders?: boolean;

  /**
   *
   */
  results?: any[];
}

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
