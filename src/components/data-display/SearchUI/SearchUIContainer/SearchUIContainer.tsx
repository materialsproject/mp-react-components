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
export const SearchUIContainer: React.FC<SearchUIProps> = ({
  view = SearchUIViewType.TABLE,
  apiEndpoint = '',
  apiEndpointParams = {},
  resultLabel = 'result',
  hasSortMenu = true,
  hasSearchBar = true,
  sortKey = 'sort_fields',
  limitKey = 'limit',
  skipKey = 'skip',
  fieldsKey = 'fields',
  conditionalRowStyles = [],
  results = [],
  setProps = () => null,
  debounce = 1000,
  ...otherProps
}) => {
  const props = {
    view,
    apiEndpoint,
    apiEndpointParams,
    resultLabel,
    hasSortMenu,
    hasSearchBar,
    sortKey,
    limitKey,
    skipKey,
    fieldsKey,
    conditionalRowStyles,
    results,
    setProps,
    debounce,
    ...otherProps
  };
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
