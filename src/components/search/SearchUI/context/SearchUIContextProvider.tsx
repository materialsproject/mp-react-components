import React, { useReducer, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import qs from 'qs';
import { ElementsInputType } from '~/components/search/ElementsInput';
import { useDeepCompareDebounce } from '~/utils/hooks';
import { FilterType, FilterValues, SearchParam, SearchState } from '../constants';

const SearchUIContext = React.createContext<any | undefined>(undefined);
const SearchUIContextActions = React.createContext<any | undefined>(undefined);

interface Props {
  columns: any[];
  groups: any[];
  values: FilterValues;
}

const initialState: SearchState = {
  groups: [],
  values: {},
  searchParams: [],
  activeFilters: [],
  results: [],
  totalResults: 0,
  resultsPerPage: 15,
  page: 1,
  loading: false
};

const getState = (currentState, values = { ...currentState.values }) => {
  const searchParams: SearchParam[] = [];
  const activeFilters: any[] = [];
  currentState.groups.forEach(g => {
    g.filters.forEach(f => {
      switch (f.type) {
        case FilterType.SLIDER:
          if (values[f.id][0] !== f.props.domain[0] || values[f.id][1] !== f.props.domain[1]) {
            activeFilters.push({
              id: f.id,
              value: values[f.id],
              defaultValue: f.props.domain
            });
            searchParams.push({
              field: f.id + '_min',
              value: values[f.id][0]
            });
            searchParams.push({
              field: f.id + '_max',
              value: values[f.id][1]
            });
          }
          break;
        case FilterType.ELEMENTS_INPUT:
          if (values[f.id] !== '') {
            activeFilters.push({
              id: f.id,
              displayName: f.props.type,
              value: f.props.parsedValue,
              defaultValue: ''
            });
            searchParams.push({
              field: f.props.type,
              value: f.props.parsedValue
            });
          }
          break;
        default:
          if (values[f.id]) {
            searchParams.push({
              field: f.id,
              value: values[f.id]
            });
          }
      }
    });
  });
  return { ...currentState, values, searchParams, activeFilters };
};

const initState = (state, columns, groups, values) => {
  state.columns = columns;
  state.groups = groups;
  state.values = values;
  return getState(state);
};

export const SearchUIContextProvider: React.FC<Props> = ({ columns, groups, values, children }) => {
  const [state, setState] = useState(() => initState(initialState, columns, groups, values));
  const debouncedActiveFilters = useDeepCompareDebounce(state.activeFilters, 1000);
  const actions = {
    setPage: (value: number) => {
      setState((currentState: SearchState) => ({ ...currentState, page: value }));
    },
    setResultsPerPage: (value: number) => {
      setState((currentState: SearchState) => ({ ...currentState, resultsPerPage: value }));
    },
    setFilterValue: (value: any, id: string) => {
      setState((currentState: SearchState) =>
        getState(currentState, { ...currentState.values, [id]: value })
      );
    },
    setFilterProps: (props: Object, filterId: string, groupId: string) => {
      const groups = state.groups;
      const group = groups.find(g => g.name === groupId);
      const filter = group.filters.find(f => f.id === filterId);
      if (filter) filter.props = { ...filter.props, ...props };
      const stateWithNewFilterProps = { ...state, groups: groups };
      const newState =
        filter && filter.hasParsedValue
          ? getState(stateWithNewFilterProps)
          : stateWithNewFilterProps;
      setState({ ...newState });
    },
    toggleGroup: (groupId: string) => {
      const groups = state.groups;
      const group = groups.find(g => g.name === groupId);
      group.collapsed = !group.collapsed;
      setState({ ...state, groups: groups });
    },
    getData: () => {
      setState((currentState: SearchState) => {
        let params: any = {};
        currentState.searchParams.forEach((d, i) => {
          params[d.field] = d.value;
        });
        params.fields = ['task_id', 'formula_pretty', 'volume', 'density'];
        params.limit = currentState.resultsPerPage;
        params.skip = (currentState.page - 1) * currentState.resultsPerPage;
        axios
          .get('https://api.materialsproject.org/materials/', {
            params: params,
            paramsSerializer: p => {
              return qs.stringify(p, { arrayFormat: 'comma' });
            },
            headers: {
              'X-Api-Key': 'a2lgLZnE18AdXlJ0mO3yIzcqmcCV8U5J'
            }
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
            setState((currentState: SearchState) => {
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
    logFilters: () => {
      console.log(state.searchParams);
    },
    reset: () => {
      setState(initialState);
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
//       return { ...state, values: { ...state.values, [action.payload.id]: action.payload.value } };
//     default:
//       return state;
//   }
// }
