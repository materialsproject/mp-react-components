import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import qs from 'qs';
import { usePrevious } from '../../../../utils/hooks';
import { Column, SearchContextValue, SearchState, SearchUIViewType } from '../types';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { useHistory } from 'react-router-dom';
import scrollIntoView from 'scroll-into-view-if-needed';
import {
  initQueryParams,
  isNotEmpty,
  initFilterGroups,
  preprocessQueryParams,
  getActiveFilters
} from '../utils';
import { useRef } from 'react';
import { useQueryParams } from 'use-query-params';
import { getRowValueFromSelectorString, initColumns } from '../../../../utils/table';

/**
 * Two contexts are invoked inside the SearchUI component
 * SearchUIContext exposes the search state to all of its consumers
 * SearchUIContextActions exposes the methods (i.e. actions) for modifying the search state
 */
const SearchUIContext = React.createContext<SearchContextValue | undefined>(undefined);
const SearchUIContextActions = React.createContext<any | undefined>(undefined);

/**
 * Component that wraps all of its children in providers for SearchUIContext and SearchUIContextActions
 * Accepts the same props as SearchUI and uses them to build the context state
 */
export const SearchUIContextProvider: React.FC<SearchState> = ({
  activeFilters = [],
  totalResults = 0,
  loading = false,
  error = false,
  searchBarValue = '',
  resultsRef = null,
  ...otherProps
}) => {
  let props = {
    activeFilters,
    totalResults,
    loading,
    error,
    searchBarValue,
    resultsRef,
    ...otherProps
  };
  const { children, ...propsWithoutChildren } = props;
  const queryParamConfig = useMemo(() => {
    return initQueryParams(props.filterGroups, props.sortKey, props.limitKey, props.skipKey);
  }, []);
  const [query, setQuery] = useQueryParams(queryParamConfig);
  const history = useHistory();
  const pathname = useMemo(() => {
    return history.location.pathname;
  }, []);
  const filterGroups = useMemo(() => {
    return initFilterGroups(props.filterGroups);
  }, []);
  const columns = useMemo(() => {
    return initColumns(props.columns, props.disableRichColumnHeaders);
  }, []);
  const [state, setState] = useState<SearchState>({
    ...propsWithoutChildren,
    filterGroups,
    columns
  });
  const defaultQuery = {
    [state.sortKey]: state.sortFields,
    [state.limitKey]: 15,
    [state.skipKey]: 0
  };
  /**
   * The fields param is ommitted from the url for brevity and
   * added to the query params internally in the get request
   */
  const fields = state.columns.map((c) => c.selector);
  const prevActiveFilters = usePrevious(state.activeFilters);

  const actions = {
    setPage: (page: number) => {
      setQuery({ [props.skipKey]: (page - 1) * query[props.limitKey] });
      const ref = state.resultsRef;
      if (ref && ref.current) {
        scrollIntoView(ref.current, {
          scrollMode: 'if-needed',
          block: 'start',
          behavior: 'smooth'
        });
      }
    },
    setResultsPerPage: (resultsPerPage: number) => {
      setQuery({ [props.limitKey]: resultsPerPage, [props.skipKey]: 0 });
    },
    setSort: (sortField: string, sortAscending: boolean) => {
      const sortFields = [...query[props.sortKey]];
      const directionPrefix = sortAscending ? '' : '-';
      sortFields[0] = directionPrefix + sortField;
      setQuery({ [props.sortKey]: sortFields, [props.skipKey]: 0 });
    },
    setSortField: (sortField: string) => {
      const sortFields = [...query[props.sortKey]];
      sortFields[0] = sortField;
      setQuery({
        [props.sortKey]: sortFields,
        [props.skipKey]: 0
      });
    },
    setSortAscending: function (sortAscending: boolean) {
      this.setSort(query[props.sortKey][0].replace('-', ''), sortAscending);
    },
    setView: (view: SearchUIViewType) => {
      setState((currentState) => ({ ...currentState, view }));
    },
    setColumns: (columns: Column[]) => {
      setState((currentState) => ({ ...currentState, columns }));
    },
    /**
     * Set one filter to a specified value.
     * Optionally include a list of filter id's that should be deactivated
     * if this filter is being set to an active value (e.g. "material_id" should override "formula" and "elements").
     * @param value new filter value
     * @param id property key for the filter (e.g. "formula")
     * @param overrideFields array of property keys to override
     */
    setFilterValue: (value: any, id: string, overrideFields?: string[]) => {
      const filterIsActivating = isNotEmpty(value);
      const newFilterValue = filterIsActivating ? value : undefined;
      const newQuery = {
        [id]: newFilterValue,
        [props.skipKey]: 0
      };
      if (overrideFields && filterIsActivating) {
        overrideFields.forEach((field) => {
          newQuery[field] = undefined;
        });
      }
      setQuery(newQuery);
    },
    setFilterValues: (values: any, params: string[] | string) => {
      const change = { [props.skipKey]: 0 };
      if (Array.isArray(params) && Array.isArray(values)) {
        params.forEach((p, i) => (change[p] = values[i]));
      } else if (typeof params === 'string') {
        change[params] = values;
      }
      setQuery(change);
    },
    removeFilter: (id: string) => {
      if (query.hasOwnProperty(id)) {
        setQuery({
          [id]: undefined,
          [props.skipKey]: 0
        });
      }
    },
    removeFilters: (params: string[] | string) => {
      const remove: any = { [props.skipKey]: 0 };
      if (Array.isArray(params)) {
        params.forEach((p) => (remove[p] = undefined));
      } else {
        remove[params] = undefined;
      }
      setQuery(remove);
    },
    resetFilters: () => {
      setQuery(
        {
          ...defaultQuery,
          [props.sortKey]: query[props.sortKey],
          [props.limitKey]: query[props.limitKey]
        },
        'push'
      );
    },
    setFilterProps: (props: any, filterName: string, groupId: string) => {
      const filterGroups = state.filterGroups;
      const group = filterGroups.find((g) => g.name === groupId);
      const filter = group?.filters.find((f) => f.name === filterName);
      if (filter) filter.props = { ...filter.props, ...props };
      setState({ ...state, filterGroups: filterGroups });
    },
    setSelectedRows: (selectedRows: any[]) => {
      props.setProps({ ...props, selectedRows });
      setState((currentState) => ({ ...currentState, selectedRows }));
    },
    getData: () => {
      /** Only show the loading icon if this is a filter change not on simple page change */
      const showLoading = state.activeFilters !== prevActiveFilters ? true : false;
      let isLoading = showLoading;
      let minLoadTime = 1000;
      let minLoadTimeReached = !showLoading;

      const params = preprocessQueryParams(
        { ...query, ...props.apiEndpointParams },
        state.filterGroups
      );
      params[props.fieldsKey] = fields;

      axios
        .get(props.apiEndpoint, {
          params: params,
          paramsSerializer: (p) => {
            return qs.stringify(p, { arrayFormat: 'comma' });
          },
          headers: props.apiKey ? { 'X-Api-Key': props.apiKey } : null
        })
        .then((result) => {
          isLoading = false;
          const loadingValue = minLoadTimeReached ? false : true;
          setState((currentState) => {
            const totalResults = getRowValueFromSelectorString(props.totalKey, result.data);
            return {
              ...currentState,
              results: result.data.data,
              totalResults: totalResults,
              loading: loadingValue,
              error: false
            };
          });
        })
        .catch((error) => {
          console.log(error);
          isLoading = false;
          const loadingValue = minLoadTimeReached ? false : true;
          setState((currentState) => {
            return {
              ...currentState,
              results: [],
              totalResults: 0,
              loading: loadingValue,
              error: true
            };
          });
        });

      if (showLoading) {
        setTimeout(() => {
          if (!isLoading) {
            setState((currentState) => {
              return { ...currentState, loading: false };
            });
          } else {
            minLoadTimeReached = true;
          }
        }, minLoadTime);
      }
    },
    setResultsRef: (resultsRef: React.RefObject<HTMLDivElement> | null) => {
      setState((currentState) => ({ ...currentState, resultsRef }));
    }
  };

  /**
   * When a filter or query param changes, compute the list of active filters.
   * Also, update the search bar value if one of its corresponding filters changes.
   *
   * If the default query params are missing (e.g. limit, skip, sort) then add them to the query.
   */
  useDeepCompareEffect(() => {
    console.log(history);
    console.log(pathname);
    if (history.location.pathname === pathname) {
      if (query[props.limitKey]) {
        const activeFilters = getActiveFilters(state.filterGroups, query);
        let searchBarValue = state.searchBarValue;
        const searchBarFieldFilter = activeFilters.find((f) => f.isSearchBarField === true);
        if (searchBarFieldFilter) {
          searchBarValue = searchBarFieldFilter.value;
        }
        setState({ ...state, activeFilters, searchBarValue });
      } else if (!query[props.skipKey] || !query[props.limitKey] || !query[props.sortKey]) {
        setQuery({ ...query, ...defaultQuery });
      }
    }
  }, [query]);

  /**
   * When the active filters change, fetch a new set of results.
   * This should also be run when the initial query fields are populated (on load).
   */
  useDeepCompareEffect(() => {
    if (query[props.limitKey]) {
      actions.getData();
    }
  }, [state.activeFilters, query[props.skipKey], query[props.limitKey], query[props.sortKey]]);

  /**
   * Ensure results props has up-to-date value.
   */
  useEffect(() => {
    props.setProps({ ...state, results: state.results });
  }, [state.results]);

  return (
    <SearchUIContext.Provider value={{ state, query }}>
      <SearchUIContextActions.Provider value={actions}>
        <div>{children}</div>
      </SearchUIContextActions.Provider>
    </SearchUIContext.Provider>
  );
};

/**
 * Custom hook for consuming the SearchUIContext
 * Must only be used by child components of SearchUIContextProvider
 * The context returns one property called "state"
 */
export const useSearchUIContext = () => {
  const context = React.useContext(SearchUIContext);
  if (context === undefined) {
    throw new Error('useMaterialsSearch must be used within a MaterialsSearchProvider');
  }
  return context;
};

/**
 * Custom hook for consuming the SearchUIContextActions
 * Must only be used by child components of SearchUIContextProvider
 * The context returns one property called "actions"
 */
export const useSearchUIContextActions = () => {
  const context = React.useContext(SearchUIContextActions);
  if (context === undefined) {
    throw new Error('useMaterialsSearch must be used within a MaterialsSearchProvider');
  }
  return context;
};
