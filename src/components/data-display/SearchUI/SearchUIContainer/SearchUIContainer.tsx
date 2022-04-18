import React from 'react';
import { SearchUIContextProvider } from '../SearchUIContextProvider';
import { SearchUIContainerProps, SearchUIViewType } from '../types';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import classNames from 'classnames';
import { QueryParamProvider } from 'use-query-params';
import './SearchUIContainer.css';

/**
 * A component that can wrap around sub-components of `SearchUI` and ensure they are
 * all hooked up to the same context.
 * This allows you to use the state management functionality of `SearchUI` with the ability
 * to customize the inner layout and components.
 */
export const SearchUIContainer: React.FC<SearchUIContainerProps> = ({
  view = SearchUIViewType.TABLE,
  apiEndpoint = '',
  apiEndpointParams = {},
  resultLabel = 'result',
  hasSortMenu = true,
  sortFields = [],
  sortKey = '_sort_fields',
  limitKey = '_limit',
  skipKey = '_skip',
  fieldsKey = '_fields',
  totalKey = 'meta.total_doc',
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
    sortFields,
    sortKey,
    limitKey,
    skipKey,
    fieldsKey,
    totalKey,
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
