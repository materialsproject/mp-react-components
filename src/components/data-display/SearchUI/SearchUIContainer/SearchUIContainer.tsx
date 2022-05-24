import React from 'react';
import { SearchUIContextProvider } from '../SearchUIContextProvider';
import { SearchUIContainerProps, SearchUIViewType } from '../types';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import classNames from 'classnames';
import { QueryParamProvider } from 'use-query-params';
import './SearchUIContainer.css';

/**
 * A component for building a customizable, integrated search interface that can fetch and filter data from a REST API.
 * This component generates a state context which can be shared by its inner components.
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
  selectedRows = [],
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
    selectedRows,
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
