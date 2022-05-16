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
import { useQueryParams } from 'use-query-params';
import { getRowValueFromSelectorString, initColumns } from '../../../../utils/table';

/**
 * Two contexts are invoked inside the SearchUI component
 * SearchUIContext exposes the search state to all of its consumers
 * SearchUIContextActions exposes the methods (i.e. actions) for modifying the search state
 */
export const SearchUIContext = React.createContext<SearchContextValue | undefined>(undefined);
export const SearchUIContextActions = React.createContext<any | undefined>(undefined);

/**
 * Component that wraps all of its children in providers for SearchUIContext and SearchUIContextActions
 * Accepts the same props as SearchUI and uses them to build the context state
 */
export const SearchUIContextProvider: React.FC<SearchState> = ({
  defaultLimit = 15,
  defaultSkip = 0,
  activeFilters = [],
  totalResults = 0,
  loading = false,
  error = false,
  searchBarValue = '',
  resultsRef = null,
  ...otherProps
}) => {
  let props = {
    defaultLimit,
    defaultSkip,
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
  /**
   * These default param values are added to the API query if no value is present
   * for that param. These params are omitted from the URL if they are equal to the
   * default value. For example, if on page 1, there will be no skip param in the url.
   * This is important because it allows the empty path (with no query parameters) to be a
   * renderable UI. Otherwise, the default params would need to be added to the URL before the
   * UI could render. This pattern would create problems when trying to use the browser back button.
   */
  const defaultQuery = {
    [state.sortKey]: props.sortFields,
    [state.limitKey]: props.defaultLimit,
    [state.skipKey]: props.defaultSkip
  };
  /**
   * The fields param is ommitted from the URL for brevity and
   * added to the query params in the preprocessing step before the get request.
   */
  const fields = state.columns.map((c) => c.selector);
  const prevActiveFilters = usePrevious(state.activeFilters);

  const actions = {
    setPage: (page: number) => {
      const limit = query[props.limitKey] || defaultQuery[props.limitKey];
      if (page !== 1) {
        setQuery({ [props.skipKey]: (page - 1) * limit });
      } else {
        setQuery({ [props.skipKey]: undefined });
      }
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
      if (resultsPerPage !== props.defaultLimit) {
        setQuery({
          [props.limitKey]: resultsPerPage,
          [props.skipKey]: undefined
        });
      } else {
        setQuery({
          [props.limitKey]: undefined,
          [props.skipKey]: undefined
        });
      }
    },
    setSort: (sortField: string, sortAscending: boolean) => {
      const sortFields = [...query[props.sortKey]];
      const directionPrefix = sortAscending ? '' : '-';
      sortFields[0] = directionPrefix + sortField;
      setQuery({
        [props.sortKey]: sortFields,
        [props.skipKey]: undefined
      });
    },
    setSortField: (sortField: string) => {
      const sortFields = [...query[props.sortKey]];
      sortFields[0] = sortField;
      setQuery({
        [props.sortKey]: sortFields,
        [props.skipKey]: undefined
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
        [props.skipKey]: undefined
      };
      if (overrideFields && filterIsActivating) {
        overrideFields.forEach((field) => {
          newQuery[field] = undefined;
        });
      }
      if (newFilterValue != query[id]) {
        setQuery(newQuery);
      }
    },
    setFilterValues: (values: any, params: string[] | string) => {
      const change = { [props.skipKey]: undefined };
      let isDifferent = false;
      if (Array.isArray(params) && Array.isArray(values)) {
        params.forEach((p, i) => {
          change[p] = values[i];
          if (change[p] != query[p]) {
            isDifferent = true;
          }
        });
      } else if (typeof params === 'string') {
        change[params] = values;
        if (change[params] != query[params]) {
          isDifferent = true;
        }
      }
      if (isDifferent) {
        setQuery(change);
      }
    },
    removeFilter: (id: string) => {
      if (query.hasOwnProperty(id)) {
        setQuery({
          [id]: undefined,
          [props.skipKey]: undefined
        });
      }
    },
    removeFilters: (params: string[] | string) => {
      const remove: any = { [props.skipKey]: undefined };
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
          [props.skipKey]: undefined,
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
        state.filterGroups,
        defaultQuery
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

      setState((currentState) => {
        return { ...currentState, loading: isLoading };
      });
    },
    setResultsRef: (resultsRef: React.RefObject<HTMLDivElement> | null) => {
      setState((currentState) => ({ ...currentState, resultsRef }));
    }
  };

  /**
   * When a filter or query param changes, compute the list of active filters.
   * Also, update the search bar value if one of its corresponding filters changes.
   */
  useDeepCompareEffect(() => {
    /**
     * This pathname check exists as a precautionary measure to protect against accidental
     * requests when navigating between SearchUI pages in dash.
     */
    if (history.location.pathname === pathname) {
      const activeFilters = getActiveFilters(state.filterGroups, query);
      let searchBarValue = state.searchBarValue;
      const searchBarFieldFilter = activeFilters.find((f) => f.isSearchBarField === true);
      if (searchBarFieldFilter) {
        searchBarValue = searchBarFieldFilter.value;
      }
      setState({ ...state, activeFilters, searchBarValue });
    }
  }, [query]);

  /**
   * When the active filters change, fetch a new set of results.
   * This should also be run when the initial query fields are populated (on load).
   */
  useDeepCompareEffect(() => {
    actions.getData();
  }, [state.activeFilters, query[props.skipKey], query[props.limitKey], query[props.sortKey]]);

  /**
   * Use setProps to update props that should be
   * accessible by dash callbacks.
   */
  useEffect(() => {
    props.setProps({
      results: state.results,
      selectedRows: state.selectedRows
    });
  }, [state.results, state.selectedRows]);

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
