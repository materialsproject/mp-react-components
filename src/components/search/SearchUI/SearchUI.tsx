import React, { useEffect } from 'react';
import { SearchUIContextProvider } from './SearchUIContextProvider';
import { SearchUIFilters } from './SearchUIFilters';
import { SearchUIDataTable } from './SearchUIDataTable';
import { Column, FilterGroup, ConditionalRowStyle, SearchUIView } from './types';
import { SearchUISearchBar } from './SearchUISearchBar';
import './SearchUI.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { MaterialsInputType } from '../MaterialsInput';
import { MaterialsInputTypesMap } from '../MaterialsInput/utils';
import { SearchUIDataHeader } from './SearchUIDataHeader';
import { SearchUIDataCards } from './SearchUIDataCards';
import { SearchUIDataView } from './SearchUIDataView';
import { CustomCardType } from './utils';
import { PeriodicTableMode } from '../MaterialsInput/MaterialsInput';

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
   * An array of column definitions for the results in the SearchUIDataTable
   * Column properties are based on the react-data-table column settings (https://github.com/jbetancur/react-data-table-component#columns)
   * The "format" property must match a pre-defined one of these predefined strings: "TWO_DECIMALS"
   * example:
    [
        {
          name: 'Material Id',
          selector: 'task_id',
          sortable: true
        },
        {
          name: 'Volume',
          selector: 'volume',
          sortable: true,
          format: 'TWO_DECIMALS'
        }
    ]
   */
  columns: Column[];

  /**
   * An array of filter groups and their respective array of filters.
   * A filter group is a collapsible section of the filters panel that contains one or more filters.
   * A filter is a type of input element that filters the data based on its value.
   * Filter "type" must be one of these strings: "SLIDER", "MATERIALS_INPUT"
   * Filter "id" must be a queryable field
   * Filter props defines how that filter should be rendered. See example for props format based on filter type.
   * example:
    [
      {
        name: 'Material',
        collapsed: false,
        filters: [
          {
            name: 'Required Elements',
            id: 'elements',
            type: 'MATERIALS_INPUT',
            props: {
              field: 'elements'
            }
          }
        ]
      },
      {
        name: 'General',
        collapsed: false,
        filters: [
          {
            name: 'Volume',
            id: 'volume',
            type: 'SLIDER',
            props: {
              domain: [0, 200]
            }
          },
          {
            name: 'Density',
            id: 'density',
            type: 'SLIDER',
            props: {
              domain: [0, 200]
            }
          }
        ]
      }
    ]
   */
  filterGroups: FilterGroup[];

  /**
   * The base URL to the API that this search UI should query
   */
  baseURL: string;

  /**
   * The URL endpoint for fetching autocompletion results
   */
  autocompleteFormulaUrl?: string;

  /**
   * API key (if needed) that will be used when making queries
   */
  apiKey?: string;

  /**
   * A noun in singular form to describe what a result represents (default: "result")
   * e.g. "material"
   * Note that only some special plural mappings are handled automatically (e.g. battery -> batteries)
   * In all other cases, an "s" is appended to resultLabel
   */
  resultLabel?: string;

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
   * Keys must be one of these supported input types: "elements", "formula", "mpid", "smiles", "text"
   * Each key object must have a "field" property which maps the input type
   * to a valid data filter field in the API.
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
   */
  searchBarPeriodicTableMode?: PeriodicTableMode;

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
   * Optionally include/exclude the top search bar
   * Defaults to true
   */
  hasSearchBar?: boolean;

  /**
   * List of conditions for styling rows based on a property (selector) and a value
   * Accepts a list of "condition" objects which must specify a...
   *  selector: the name of the data property to use for the condition
   *  value: the value that meets the condition
   *  style: object of styles supplied in "CSS-in-JS" format
   * Note that this prop currently only supports checking for 
   * value equivalence (i.e. row[selector] === value)
   * example:
    [
      {
        selector: "myProperty",
        value: true,
        style: {
          backgroundColor: "#ddd"
        }
      }
    ]
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
   * SearchUI views: 'table' or 'cards'
   */
  view?: SearchUIView;

  /**
   * Optionally enable/disable switching between SearchUI result views
   */
  allowViewSwitching?: boolean;

  /**
   * Change type of card displayed in the card results view
   * Must be one of the values in the CustomCardType enum
   *
   * To add a custom card type, head to SearchUI/utils and add the name of the type to the
   * CustomCardType enum, then add a property in customCardsMap using the same name
   * you used for the type, then provide your custom component as the value.
   *
   * Note that custom card components must have these 3 (and only these 3) props: "data", "id", "className"
   * The "data" prop will be the individual row of data in the results for populating the card's content.
   */
  customCardType?: CustomCardType;

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
  cardOptions?: any;
}

/**
 * Component for rendering advanced search interfaces for data in an API
 * Renders results alongside a set of filters that map to properties in the data.
 */
export const SearchUI: React.FC<SearchUIProps> = (props) => {
  return (
    <div id={props.id} className="mpc-search-ui">
      <Router>
        <SearchUIContextProvider {...props}>
          <div className="columns">
            <div className="column is-4-desktop is-half-tablet ">
              {props.hasSearchBar && (
                <div className="columns mb-1">
                  <div className="column pb-2">
                    <SearchUISearchBar />
                  </div>
                </div>
              )}
              <div className="columns">
                <div className="column">
                  <SearchUIFilters />
                </div>
              </div>
            </div>
            <div className="column is-8-desktop is-half-tablet mpc-results-container">
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
  view: SearchUIView.TABLE,
  resultLabel: 'results',
  hasSearchBar: true,
  conditionalRowStyles: [],
  searchBarPeriodicTableMode: PeriodicTableMode.TOGGLE,
  searchBarAllowedInputTypesMap: {
    formula: {
      field: 'formula',
    },
    elements: {
      field: 'elements',
    },
    mpid: {
      field: 'material_ids',
    },
  },
  setProps: () => null,
};
