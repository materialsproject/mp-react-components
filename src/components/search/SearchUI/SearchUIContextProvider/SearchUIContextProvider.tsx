import React, { useState, useEffect } from 'react';
import axios from 'axios';
import qs from 'qs';
import { usePrevious, useQuery } from '../../../../utils/hooks';
import { Column, SearchState, SearchUIViewType } from '../types';
import { SearchUIProps } from '../../SearchUI';
import { useHistory } from 'react-router-dom';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { useMediaQuery } from 'react-responsive';
import { MaterialsInputType } from '../../MaterialsInput';
import { getDefaultFiltersAndValues, getSearchState, initSearchState } from '../utils';
import { getPageCount } from '../../utils';

/**
 * Two contexts are invoked inside the SearchUI component
 * SearchUIContext exposes the search state to all of its consumers
 * SearchUIContextActions exposes the methods (i.e. actions) for modifying the search state
 */
const SearchUIContext = React.createContext<SearchState | undefined>(undefined);
const SearchUIContextActions = React.createContext<any | undefined>(undefined);

const defaultState: SearchState = {
  baseURL: '',
  columns: [],
  filterGroups: [],
  filterValues: {},
  activeFilters: [],
  results: [],
  totalResults: 0,
  resultsPerPage: 15,
  page: 1,
  loading: false,
  sortField: undefined,
  sortAscending: true,
  error: false
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
  const query = useQuery();
  const history = useHistory();
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const [state, setState] = useState(() =>
    initSearchState(defaultState, propsWithoutChildren, query, isDesktop)
  );
  const prevActiveFilters = usePrevious(state.activeFilters);

  const actions = {
    setPage: (page: number) => {
      setState((currentState) => ({ ...currentState, page }));
    },
    setResultsPerPage: (resultsPerPage: number) => {
      setState((currentState) => ({ ...currentState, resultsPerPage }));
    },
    setSort: (sortField: string, sortAscending: boolean) => {
      setState((currentState) => ({
        ...currentState,
        sortField,
        sortAscending,
        page: 1
      }));
    },
    setSortField: (sortField: string) => {
      setState((currentState) => ({
        ...currentState,
        sortField,
        page: 1
      }));
    },
    setSortAscending: (sortAscending: boolean) => {
      setState((currentState) => ({
        ...currentState,
        sortAscending,
        page: 1
      }));
    },
    setView: (view: SearchUIViewType) => {
      setState((currentState) => ({ ...currentState, view }));
    },
    setColumns: (columns: Column[]) => {
      setState((currentState) => ({ ...currentState, columns }));
    },
    setFilterValue: (value: any, id: string) => {
      setState((currentState) =>
        getSearchState({ ...currentState, page: 1 }, { ...currentState.filterValues, [id]: value })
      );
    },
    setFilterWithOverrides: (value: any, id: string, overrideFields: string[]) => {
      setState((currentState) => {
        let newFilterValues = {};
        overrideFields.forEach((field) => {
          const activeFilter = currentState.activeFilters.find((a) => a.id === field);
          if (activeFilter) newFilterValues[field] = activeFilter.defaultValue;
        });
        newFilterValues[id] = value;
        let newFilterGroups = currentState.filterGroups.slice();
        if (isDesktop) {
          newFilterGroups[0].expanded = true;
        }
        return getSearchState(
          { ...currentState, filterGroups: newFilterGroups, page: 1 },
          { ...currentState.filterValues, ...newFilterValues }
        );
      });
    },
    resetAllFiltersExcept: (value: any, id: string) => {
      setState((currentState) => {
        const { activeFilters, filterValues } = getDefaultFiltersAndValues(currentState);
        return getSearchState({ ...currentState, activeFilters }, { ...filterValues, [id]: value });
      });
    },
    setFilterProps: (props: any, filterId: string, groupId: string) => {
      setState((currentState) => {
        const filterGroups = currentState.filterGroups;
        const group = filterGroups.find((g) => g.name === groupId);
        const filter = group?.filters.find((f) => f.id === filterId);
        if (filter) filter.props = { ...filter.props, ...props };
        const stateWithNewFilterProps = { ...currentState, filterGroups: filterGroups };
        // const newState =
        //   filter && filter.props.hasOwnProperty('parsedValue')
        //     ? getSearchState(stateWithNewFilterProps)
        //     : stateWithNewFilterProps;
        const newFilterValues = props.hasOwnProperty('initialValues')
          ? { ...currentState.filterValues, [filterId]: props.initialValues }
          : undefined;
        return getSearchState({ ...stateWithNewFilterProps }, newFilterValues);
      });
    },
    setSelectedRows: (selectedRows: any[]) => {
      props.setProps({ ...props, selectedRows });
      setState((currentState) => ({ ...currentState, selectedRows }));
    },
    getData: () => {
      setState((currentState) => {
        /** Only show the loading icon if this is a filter change not on simple page change */
        const showLoading = currentState.activeFilters !== prevActiveFilters ? true : false;
        let isLoading = showLoading;
        let minLoadTime = 1000;
        let minLoadTimeReached = !showLoading;
        let params: any = {};
        let query = new URLSearchParams();
        params.fields = currentState.columns.map((d) => d.selector);
        params.limit = currentState.resultsPerPage;
        params.skip = (currentState.page - 1) * currentState.resultsPerPage;
        query.set('limit', params.limit);
        query.set('skip', params.skip);
        if (currentState.sortField) {
          params.sort_field = currentState.sortField;
          params.ascending = currentState.sortAscending;
          query.set('sort_field', params.field);
          query.set('ascending', params.ascending);
        }
        currentState.activeFilters.forEach((a) => {
          a.searchParams?.forEach((s) => {
            let field = s.field;
            let value = a.conversionFactor ? s.value * a.conversionFactor : s.value;
            /**
             * Elements values that are strings should be interpreted as formula fields
             * This lets the elements field handle chemical system searches (e.g. Fe-Co-Si)
             */
            if (field === 'elements' && typeof value === 'string') {
              field = 'formula';
            }
            params[field] = value;
            query.set(field, s.value);
          });
        });

        axios
          .get(props.baseURL, {
            params: params,
            paramsSerializer: (p) => {
              return qs.stringify(p, { arrayFormat: 'comma' });
            },
            headers: props.apiKey ? { 'X-Api-Key': props.apiKey } : null
          })
          .then((result) => {
            history.push({ search: query.toString() });
            isLoading = false;
            const loadingValue = minLoadTimeReached ? false : true;
            setState((currentState) => {
              const totalResults = result.data.meta.total_doc;
              const pageCount = getPageCount(totalResults, currentState.resultsPerPage);
              const page = currentState.page > pageCount ? pageCount : currentState.page;
              return {
                ...currentState,
                results: result.data.data,
                totalResults: totalResults,
                page: page,
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

        return {
          ...currentState,
          loading: showLoading
        };
      });
    },
    resetFilters: () => {
      setState((currentState) => {
        const { activeFilters, filterValues } = getDefaultFiltersAndValues(currentState);
        return {
          ...currentState,
          page: 1,
          filterValues,
          activeFilters
        };
      });
    }
  };

  useDeepCompareEffect(() => {
    actions.getData();
  }, [state.activeFilters, state.resultsPerPage, state.page, state.sortField, state.sortAscending]);

  return (
    <SearchUIContext.Provider value={state}>
      <SearchUIContextActions.Provider value={actions}>{children}</SearchUIContextActions.Provider>
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
