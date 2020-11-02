import React, { useState, useEffect } from 'react';
import axios from 'axios';
import qs from 'qs';
import { useDeepCompareDebounce } from '../../../../utils/hooks';
import {
  FilterGroup,
  FilterType,
  FilterId,
  ActiveFilter,
  SearchState,
  Column,
  initColumns,
  initFilterGroups
} from '../constants';

import { SearchUIProps } from '../../SearchUI';

/**
 * Two contexts are invoked inside the SearchUI component
 * SearchUIContext exposes the search state to all of its consumers
 * SearchUIContextActions exposes the methods (i.e. actions) for modifying the search state
 */
const SearchUIContext = React.createContext<SearchState | undefined>(undefined);
const SearchUIContextActions = React.createContext<any | undefined>(undefined);

const initialState: SearchState = {
  columns: [],
  filterGroups: [],
  filterValues: {},
  activeFilters: [],
  results: [],
  totalResults: 0,
  resultsPerPage: 15,
  page: 1,
  loading: false,
  sortColumn: FilterId.MP_ID,
  sortDirection: 'asc'
};

/**
 * Method for initializing and updating the search state's active filters.
 * Returns a full state object
 * Optionally accepts a filterValues argument which represents a new hash map
 * of values for building the activeFilters list.
 * The activeFilters list is recomputed whenever a filter is modified in the UI.
 */
const getState = (currentState: SearchState, filterValues = { ...currentState.filterValues }): SearchState => {
  const activeFilters: ActiveFilter[] = [];
  currentState.filterGroups.forEach(g => {
    g.filters.forEach(f => {
      switch (f.type) {
        case FilterType.SLIDER:
          // if (!f.hasOwnProperty('props')) f.props = {domain: [0, 100]};
          // if (f.hasOwnProperty('props') && f.props.hasOwnProperty('domain')) f.props.domain = [0, 100];  
          if (!filterValues.hasOwnProperty(f.id)) filterValues[f.id] = f.props.domain;
          if (
            filterValues[f.id][0] !== f.props.domain[0] ||
            filterValues[f.id][1] !== f.props.domain[1]
          ) {
            activeFilters.push({
              id: f.id,
              value: filterValues[f.id],
              defaultValue: f.props.domain,
              searchParams: [
                {
                  field: f.id + '_min',
                  value: filterValues[f.id][0]
                },
                {
                  field: f.id + '_max',
                  value: filterValues[f.id][1]
                }
              ]
            });
          }
          break;
        case FilterType.MATERIALS_INPUT:
          if (!filterValues.hasOwnProperty(f.id)) filterValues[f.id] = '';
          if (!f.hasOwnProperty('props')) f.props = { parsedValue: [] };
          if (f.hasOwnProperty('props') && !f.props.hasOwnProperty('parsedValue'))
            f.props.parsedValue = [];
          if (filterValues[f.id] !== '') {
            activeFilters.push({
              id: f.id,
              displayName: f.props.field,
              value: f.props.parsedValue,
              defaultValue: '',
              searchParams: [
                {
                  field: f.props.field,
                  value: f.props.parsedValue
                }
              ]
            });
          }
          break;
        default:
          if (!filterValues.hasOwnProperty(f.id)) filterValues[f.id] = undefined;
          if (filterValues[f.id] !== undefined && filterValues[f.id] !== null ) {
            activeFilters.push({
              id: f.id,
              displayName: f.name,
              value: filterValues[f.id],
              defaultValue: undefined,
              searchParams: [
                {
                  field: f.id,
                  value: filterValues[f.id]
                }
              ]
            });
          }
      }
    });
  });
  return { ...currentState, filterValues, activeFilters };
};

const initState = (state: SearchState, columns: Column[], filterGroups: FilterGroup[]): SearchState => {
  state.columns = initColumns(columns);
  state.filterGroups = initFilterGroups(filterGroups);
  return getState(state);
};

const getResetFiltersAndValues = (state: SearchState) => {
  const filterValues = state.filterValues;
  let activeFilters = state.activeFilters;
  activeFilters.forEach(a => {
    filterValues[a.id] = a.defaultValue;
  });
  activeFilters = [];
  return {
    filterValues,
    activeFilters
  };
};

/**
 * Component that wraps all of its children in providers for SearchUIContext and SearchUIContextActions
 * Accepts the same props as SearchUI and uses them to build the context state
 */
export const SearchUIContextProvider: React.FC<SearchUIProps> = ({
  columns,
  filterGroups,
  baseURL,
  apiKey,
  children
}) => {
  const [state, setState] = useState(() => initState(initialState, columns, filterGroups));
  const debouncedActiveFilters = useDeepCompareDebounce(state.activeFilters, 1000);
  const actions = {
    setPage: (value: number) => {
      setState(currentState => ({ ...currentState, page: value }));
    },
    setResultsPerPage: (value: number) => {
      setState(currentState => ({ ...currentState, resultsPerPage: value }));
    },
    setFilterValue: (value: any, id: string) => {
      setState(currentState =>
        getState(currentState, { ...currentState.filterValues, [id]: value })
      );
    },
    setFilterWithOverrides: (value: any, id: string, overrideFields: string[]) => {
      setState(currentState => {
        let newFilterValues = {[id]: value};
        overrideFields.forEach((field) => {
          const activeFilter = currentState.activeFilters.find((a) => a.id === field);
          if (activeFilter) newFilterValues[field] = activeFilter.defaultValue;
        });
        return getState(currentState, { ...currentState.filterValues, ...newFilterValues });
      });
    },
    resetAllFiltersExcept: (value: any, id: string) => {
      setState(currentState => {
        const { activeFilters, filterValues } = getResetFiltersAndValues(currentState);
        return getState({ ...currentState, activeFilters }, { ...filterValues, [id]: value });
      });
    },
    setFilterProps: (props: Object, filterId: string, groupId: string) => {
      const filterGroups = state.filterGroups;
      const group = filterGroups.find(g => g.name === groupId);
      const filter = group?.filters.find(f => f.id === filterId);
      if (filter) filter.props = { ...filter.props, ...props };
      const stateWithNewFilterProps = { ...state, filterGroups: filterGroups };
      const newState =
        filter && filter.props.hasOwnProperty('parsedValue')
          ? getState(stateWithNewFilterProps)
          : stateWithNewFilterProps;
      setState({ ...newState });
    },
    toggleGroup: (groupId: string) => {
      const filterGroups = state.filterGroups.map((g) => {
        if (g.name !== groupId) {
          g.collapsed = true;
        } else {
          g.collapsed = !g.collapsed;
        }
        return g;
      });
      // const group = filterGroups.find(g => g.name === groupId);
      // if (group) group.collapsed = !group.collapsed;
      setState({ ...state, filterGroups: filterGroups });
    },
    getData: () => {
      setState(currentState => {
        let params: any = {};
        currentState.activeFilters.forEach(a => {
          a.searchParams?.forEach(s => {
            params[s.field] = s.value;
          });
        });
        params.fields = currentState.columns.map(d => d.selector);
        params.limit = currentState.resultsPerPage;
        params.skip = (currentState.page - 1) * currentState.resultsPerPage;
        axios
          .get(baseURL, {
            params: params,
            paramsSerializer: p => {
              return qs.stringify(p, { arrayFormat: 'comma' });
            },
            headers: apiKey
              ? {
                  'X-Api-Key': apiKey
                }
              : null
          })
          .then(result => {
            console.log(result);
            setState(currentState => {
              return {
                ...currentState,
                results: result.data.data,
                totalResults: result.data.meta.total,
                loading: false
              };
            });
          })
          .catch(error => {
            console.log(error);
            setState(currentState => {
              return {
                ...currentState,
                results: [],
                totalResults: 0,
                loading: false
              };
            });
          });
        return {
          ...currentState,
          loading: true
        };
      });
    },
    resetFilters: () => {
      setState(currentState => {
        const { activeFilters, filterValues } = getResetFiltersAndValues(currentState);
        return {
          ...currentState,
          filterValues,
          activeFilters
        };
      });
    }
  };

  useEffect(() => {
    actions.getData();
  }, [debouncedActiveFilters, state.resultsPerPage, state.page]);

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
