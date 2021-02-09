import React, { useEffect, useState } from 'react';
import { SearchUIContextProvider } from './SearchUIContextProvider';
import { SearchUIFilters } from './SearchUIFilters';
import { SearchUIDataTable } from './SearchUIDataTable';
import { Column, FilterGroup } from './types';
import { SearchUISearchBar } from './SearchUISearchBar';
import './SearchUI.css';
import { BrowserRouter as Router } from 'react-router-dom';
import propertySearch from '../GroupSpaceSearch/property-search';
import axios from 'axios';

/**
 * Component for rendering advanced search interfaces for data in an API
 * Renders results in a data table alongside a set of filters that map to properties in the data.
 */

export interface SearchUIProps {
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
   * Optionally include a field to sort by on initial load
   * Must be a valid field and included in your list of columns
   */
  sortField?: string;
  /**
   * If including a sortField, set whether it should ascend by default
   * True for ascending, False for descending
   */
  sortAscending?: boolean;
  distributions?: any[];
}

export const SearchUI: React.FC<SearchUIProps> = (props) => {
  const [distributions, setDistributions] = useState<any[]>([]);
  console.log(props);
  console.log(distributions);
  // useEffect(() => {
  //   let requests: any = [];
  //   console.log(props.columns);
  //   props.columns.forEach((col, i) => {
  //     if (i === 0) {
  //       const request = axios.get('https://api.materialsproject.org/search/generate_statistics/', {
  //         params: {
  //           field: 'density',
  //           min_val: 1,
  //           max_val: 10,
  //           num_points: 100
  //         }
  //       });
  //       requests.push(request);
  //     } else if (i === 1) {
  //       const request = axios.get('https://api.materialsproject.org/search/generate_statistics/', {
  //         params: {
  //           field: 'volume',
  //           min_val: 1,
  //           max_val: 10000,
  //           num_points: 100
  //         }
  //       });
  //       requests.push(request);
  //     }
  //   });

  //   axios.all(requests)
  //   .then(axios.spread((...responses) => {
  //     // console.log(responses);
  //     const data = responses.map((d: any) => d.data);
  //     console.log(data);
  //     setDistributions(data);
  //   }))
  //   .catch((error) => {
  //     console.log(error);
  //   });
  // }, []);

  return (
    <div className="search-ui">
      <Router>
        <SearchUIContextProvider {...props}>
          <div className="columns">
            <div className="column is-narrow">
              <div className="columns mb-1">
                <div className="column pb-2">
                  <SearchUISearchBar />
                </div>
              </div>
              <div className="columns">
                <div className="column">
                  <SearchUIFilters />
                </div>
              </div>
            </div>
            <div className="column results-container">
              <SearchUIDataTable />
            </div>
          </div>
        </SearchUIContextProvider>
      </Router>
    </div>
  );
};

SearchUI.defaultProps = {
  resultLabel: 'results',
};
