import React from 'react';
import { SearchUIContextProvider } from '../SearchUIContextProvider';
import { SearchUIViewType } from '../types';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { PeriodicTableMode } from '../../../data-entry/MaterialsInput/MaterialsInput';
import { SearchUIProps } from '../SearchUI';
import classNames from 'classnames';
import { QueryParamProvider } from 'use-query-params';

/**
 * A component that can wrap around sub-components of `SearchUI` and ensure they are
 * all hooked up to the same context.
 * This allows you to use the state management functionality of `SearchUI` with the ability
 * to customize the inner layout and components.
 */
export const SearchUIContainer: React.FC<SearchUIProps> = (props) => {
  return (
    <div id={props.id} className={classNames('mpc-search-ui', props.className)}>
      <Router>
        <QueryParamProvider ReactRouterRoute={Route}>
          <SearchUIContextProvider {...props}>{props.children}</SearchUIContextProvider>
        </QueryParamProvider>
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
  searchBarPeriodicTableMode: PeriodicTableMode.TOGGLE,
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
