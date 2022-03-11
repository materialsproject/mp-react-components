import React, { useState, useEffect, useLayoutEffect } from 'react';
import axios from 'axios';
import qs from 'qs';
import { usePrevious, useQuery } from '../../../../utils/hooks';
import { Column, SearchContextValue, SearchState, SearchUIViewType } from '../types';
import { SearchUIProps } from '../../SearchUI';
import { useHistory } from 'react-router-dom';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { useMediaQuery } from 'react-responsive';
import scrollIntoView from 'scroll-into-view-if-needed';
import { MaterialsInputType } from '../../../data-entry/MaterialsInput';
import {
  getDefaultFiltersAndValues,
  getSearchState,
  initQueryParams,
  initSearchState,
  isNotEmpty,
  newInitFilterGroups,
  updateActiveFilters
} from '../utils';
import { getPageCount } from '../../../data-entry/utils';
import { useRef } from 'react';
import { useQueryParams } from 'use-query-params';
import { initColumns } from '../../../../utils/table';

/**
 * Two contexts are invoked inside the SearchUI component
 * SearchUIContext exposes the search state to all of its consumers
 * SearchUIContextActions exposes the methods (i.e. actions) for modifying the search state
 */
const SearchUIContext = React.createContext<SearchContextValue | undefined>(undefined);
const SearchUIContextActions = React.createContext<any | undefined>(undefined);

const defaultState: SearchState = {
  apiEndpoint: '',
  apiEndpointParams: {},
  columns: [],
  filterGroups: [],
  activeFilters: [],
  results: [],
  totalResults: 0,
  loading: false,
  error: false,
  searchBarValue: '',
  resultsRef: null
};

/**
 * Component that wraps all of its children in providers for SearchUIContext and SearchUIContextActions
 * Accepts the same props as SearchUI and uses them to build the context state
 */
export const SearchUIContextProvider: React.FC<SearchUIProps> = ({
  resultLabel = 'results',
  hasSearchBar = true,
  conditionalRowStyles = [],
  setProps = () => null,
  ...otherProps
}) => {
  let props = { resultLabel, hasSearchBar, conditionalRowStyles, setProps, ...otherProps };
  const { children, ...propsWithoutChildren } = props;
  // const query = useQuery();
  // const history = useHistory();
  // const isDesktop = useMediaQuery({ minWidth: 1024 });
  // const [state, setState] = useState(() =>
  //   initSearchState(defaultState, propsWithoutChildren, query, isDesktop)
  // );
  const [query, setQuery] = useQueryParams(initQueryParams(props.filterGroups));
  const filterGroups = newInitFilterGroups(props.filterGroups);
  const columns = initColumns(props.columns, props.disableRichColumnHeaders);
  const [state, setState] = useState<SearchState>({
    ...defaultState,
    ...propsWithoutChildren,
    filterGroups,
    columns
  });
  const defaultQuery = {
    sort_fields: ['formula_pretty'],
    limit: 15,
    skip: 0
  };
  const fields = state.columns.map((c) => c.selector);
  // const queryParamToFilterMap = mapQueryParamsToFilter
  // const prevActiveFilters = usePrevious(state.activeFilters);

  const actions = {
    setPage: (page: number) => {
      setQuery({ skip: page * query.limit });
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
      setQuery({ limit: resultsPerPage });
      // if (ref.current) {
      //   scrollIntoView(ref.current, {
      //     scrollMode: 'if-needed',
      //     block: 'start',
      //     behavior: 'smooth'
      //   });
      // }
      // setState((currentState) => ({ ...currentState, resultsPerPage, page: 1 }));
    },
    setSort: (sortField: string, sortAscending: boolean) => {
      const sort_fields = [...query.sort_fields];
      const directionPrefix = sortAscending ? '' : '-';
      sort_fields[0] = directionPrefix + sortField;
      setQuery({ sort_fields, skip: 0 });
    },
    setSortField: (sortField: string) => {
      const sort_fields = [...query.sort_fields];
      sort_fields[0] = sortField;
      setQuery({ sort_fields, skip: 0 });
    },
    setSortAscending: function (sortAscending: boolean) {
      this.setSort(query.sort_fields[0].replace('-', ''), sortAscending);
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
      const newQuery = { [id]: filterIsActivating ? value : undefined };
      if (overrideFields && filterIsActivating) {
        overrideFields.forEach((field) => {
          newQuery[field] = undefined;
        });
      }
      setQuery(newQuery);
    },
    setFilterValues: (values: any, params: string[] | string) => {
      const change = {};
      if (Array.isArray(params) && Array.isArray(values)) {
        params.forEach((p, i) => (change[p] = values[i]));
      } else if (typeof params === 'string') {
        change[params] = values;
      }
      setQuery(change);
    },
    removeFilter: (id: string) => {
      if (query.hasOwnProperty(id)) {
        setQuery({ [id]: undefined });
      }
    },
    removeFilters: (params: string[] | string) => {
      const remove = {};
      if (Array.isArray(params)) {
        params.forEach((p) => (remove[p] = undefined));
      } else {
        remove[params] = undefined;
      }
      setQuery(remove);
    },
    resetAllFiltersExcept: (value: any, id: string) => {
      setState((currentState) => {
        const { activeFilters, filterValues } = getDefaultFiltersAndValues(currentState);
        return getSearchState({ ...currentState, activeFilters }, { ...filterValues, [id]: value });
      });
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
      // setState((currentState) => {
      /** Only show the loading icon if this is a filter change not on simple page change */
      // const showLoading = currentState.activeFilters !== prevActiveFilters ? true : false;
      // let isLoading = showLoading;
      // let minLoadTime = 1000;
      // let minLoadTimeReached = !showLoading;
      // let params = Object.assign({}, currentState.apiEndpointParams!);
      // let query = new URLSearchParams();

      // /** Resolve inconsistencies between mp-api and contribs-api */
      // const fieldsKey = currentState.isContribs ? '_fields' : 'fields';
      // const limitKey = currentState.isContribs ? '_limit' : 'limit';
      // const skipKey = currentState.isContribs ? '_skip' : 'skip';
      // const sortKey = currentState.isContribs ? '_sort' : 'sort_fields';

      // params[fieldsKey] = currentState.columns.map((d) => d.selector);
      // params[limitKey] = currentState.resultsPerPage;
      // params[skipKey] = (currentState.page - 1) * currentState.resultsPerPage;
      // query.set(limitKey, params[limitKey]);
      // query.set(skipKey, params[skipKey]);

      // /**
      //  * Convert sort props to syntax expected by API.
      //  * Descending fields are prepended with "-".
      //  * Secondary sort field is added with a comma separator.
      //  */
      // let secondarySort: string | undefined;
      // if (currentState.secondarySortField) {
      //   secondarySort = currentState.secondarySortAscending
      //     ? currentState.secondarySortField
      //     : `-${currentState.secondarySortField}`;
      // }

      // if (currentState.sortField) {
      //   let primarySort = currentState.sortAscending
      //     ? currentState.sortField
      //     : `-${currentState.sortField}`;
      //   params[sortKey] = secondarySort ? `${primarySort},${secondarySort}` : primarySort;
      //   query.set(sortKey, params[sortKey]);
      // }

      // currentState.activeFilters.forEach((a) => {
      //   a.searchParams?.forEach((s) => {
      //     let field = s.field;
      //     let value = a.conversionFactor ? s.value * a.conversionFactor : s.value;

      //     if (field === 'has_props' && params[field]) {
      //       params[field].push(value);
      //     }

      //     params[field] = value;
      //     query.set(field, s.value);
      //   });
      // });

      // if (params.formation_energy_per_atom) {
      //   params.formation_energy_per_atom_min = params.formation_energy_per_atom[0];
      //   params.formation_energy_per_atom_max = params.formation_energy_per_atom[1];
      //   delete params.formation_energy_per_atom;
      // }

      axios
        .get(props.apiEndpoint, {
          params: { ...query, fields },
          paramsSerializer: (p) => {
            return qs.stringify(p, { arrayFormat: 'comma' });
          },
          headers: props.apiKey ? { 'X-Api-Key': props.apiKey } : null
        })
        .then((result) => {
          // history.push({ search: query.toString() });
          // isLoading = false;
          // const loadingValue = minLoadTimeReached ? false : true;
          setState((currentState) => {
            const totalResults = props.isContribs
              ? result.data.total_count
              : result.data.meta.total_doc;
            // const pageCount = getPageCount(totalResults, currentState.resultsPerPage);
            // const page = currentState.page > pageCount ? pageCount : currentState.page;
            return {
              ...currentState,
              results: result.data.data,
              totalResults: totalResults,
              // page: page,
              // loading: loadingValue,
              error: false
            };
          });
        })
        .catch((error) => {
          console.log(error);
          // isLoading = false;
          // const loadingValue = minLoadTimeReached ? false : true;
          setState((currentState) => {
            return {
              ...currentState,
              results: [],
              totalResults: 0,
              // loading: loadingValue,
              error: true
            };
          });
        });

      // if (showLoading) {
      //   setTimeout(() => {
      //     if (!isLoading) {
      //       setState((currentState) => {
      //         return { ...currentState, loading: false };
      //       });
      //     } else {
      //       minLoadTimeReached = true;
      //     }
      //   }, minLoadTime);
      // }

      //   return {
      //     ...currentState,
      //     loading: showLoading
      //   };
      // });
    },
    resetFilters: () => {
      setQuery({ ...defaultQuery, sort: query.sort, limit: query.limit }, 'push');
      // setState((currentState) => {
      //   const { activeFilters, filterValues } = getDefaultFiltersAndValues(currentState);
      //   return {
      //     ...currentState,
      //     page: 1,
      //     filterValues,
      //     activeFilters
      //   };
      // });
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
    if (query.limit) {
      const activeFilters = updateActiveFilters(state.filterGroups, query);
      let searchBarValue = state.searchBarValue;
      const searchBarFieldFilter = activeFilters.find((f) => f.isSearchBarField === true);
      if (searchBarFieldFilter) {
        searchBarValue = searchBarFieldFilter.value;
      }
      setState({ ...state, activeFilters, searchBarValue });
    } else if (!query.skip || !query.limit || !query.sort_fields) {
      setQuery({ ...query, ...defaultQuery });
    }
  }, [query]);

  /**
   * When the active filters change, fetch a new set of results.
   * This should also be run when the initial query fields are populated (on load).
   */
  useDeepCompareEffect(() => {
    if (query.limit) {
      actions.getData();
    }
  }, [query.limit, state.activeFilters, query.sort_fields]);

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
