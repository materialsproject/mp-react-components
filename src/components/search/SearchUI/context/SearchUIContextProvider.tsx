import React, { useReducer, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import qs from 'qs';
import { MaterialsInputField } from '../../../search/MaterialsInput';
import { useDeepCompareDebounce } from '../../../../utils/hooks';
import {
  FilterGroup,
  FilterType,
  FilterValues,
  ActiveFilter,
  SearchState,
  SearchParam,
  Column,
  initColumns
} from '../constants';

const SearchUIContext = React.createContext<any | undefined>(undefined);
const SearchUIContextActions = React.createContext<any | undefined>(undefined);

interface Props {
  columns: Column[];
  filterGroups: FilterGroup[];
  baseURL: string;
  apiKey?: string;
}

const initialState: SearchState = {
  columns: [],
  filterGroups: [],
  filterValues: {},
  activeFilters: [],
  results: [],
  totalResults: 0,
  resultsPerPage: 15,
  page: 1,
  loading: false
};

const getState = (currentState: SearchState, filterValues = { ...currentState.filterValues }) => {
  const activeFilters: ActiveFilter[] = [];
  currentState.filterGroups.forEach(g => {
    g.filters.forEach(f => {
      switch (f.type) {
        case FilterType.SLIDER:
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
          if (filterValues[f.id]) {
            activeFilters.push({
              id: f.id,
              displayName: f.name,
              value: filterValues[f.id],
              defaultValue: '',
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

const initState = (state: SearchState, columns: Column[], filterGroups: FilterGroup[]) => {
  state.columns = initColumns(columns);
  state.filterGroups = filterGroups;
  return getState(state);
};

export const SearchUIContextProvider: React.FC<Props> = ({
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
      const filterGroups = state.filterGroups;
      const group = filterGroups.find(g => g.name === groupId);
      if (group) group.collapsed = !group.collapsed;
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
        const filterValues = currentState.filterValues;
        let activeFilters = currentState.activeFilters;
        activeFilters.forEach(a => {
          filterValues[a.id] = a.defaultValue;
        });
        activeFilters = [];
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

export const useSearchUIContext = () => {
  const context = React.useContext(SearchUIContext);
  if (context === undefined) {
    throw new Error('useMaterialsSearch must be used within a MaterialsSearchProvider');
  }
  return context;
};

export const useSearchUIContextActions = () => {
  const context = React.useContext(SearchUIContextActions);
  if (context === undefined) {
    throw new Error('useMaterialsSearch must be used within a MaterialsSearchProvider');
  }
  return context;
};

/**
 * Reducer version
 */

// enum ActionType {
//   SET_FILTER_VALUE = 'SET_FILTER_VALUE'
// }

// interface Action {
//   type: string;
//   payload: any;
// };

// const reducer = (state: SearchState, action: Action) => {
//   switch (action.type) {
//     case ActionType.SET_FILTER_VALUE:
//       return { ...state, filterValues: { ...state.filterValues, [action.payload.id]: action.payload.value } };
//     default:
//       return state;
//   }
// }
