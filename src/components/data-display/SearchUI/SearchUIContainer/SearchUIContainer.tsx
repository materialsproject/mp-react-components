import React, { useEffect } from 'react';
import { SearchUIContextProvider } from '../SearchUIContextProvider';
import {
  Column,
  FilterGroup,
  ConditionalRowStyle,
  SearchUIViewType,
  SearchParam,
  SearchParams
} from '../types';
import { BrowserRouter as Router } from 'react-router-dom';
import { PeriodicTableMode } from '../../../data-entry/MaterialsInput/MaterialsInput';
import { SearchUIProps } from '../SearchUI';

/**
 * Renders a complete search interface for fetching and filtering data from a REST API.
 * Results are rendered in a table alongside a set of filters that map to properties in the data.
 */
export const SearchUIContainer: React.FC<SearchUIProps> = (props) => {
  return (
    <div id={props.id} className="mpc-search-ui">
      <Router>
        <SearchUIContextProvider {...props}>{props.children}</SearchUIContextProvider>
      </Router>
    </div>
  );
};

SearchUIContainer.defaultProps = {
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
