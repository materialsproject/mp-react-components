import React, { useReducer, useState, useEffect } from 'react';
import axios from 'axios';
import qs from 'qs';
import { ElementsInputType } from './ElementsInput/ElementsInput';

export enum FilterId {
  ELEMENTS = 'elements',
  VOLUME = 'volume',
  DENSITY = 'density'
}

export enum FilterType {
  SLIDER,
  ELEMENTS_INPUT
}

interface Filter {
  name: string;
  id: FilterId;
  type: FilterType;
  props?: any;
}

type FilterValues = Partial<Record<FilterId, any>>;

interface SearchParam {
  field: string;
  value: any;
}

interface SearchState {
  groups: any[];
  values: FilterValues;
  searchParams: SearchParam[];
  activeFilters: any;
  results: any[];
  totalResults: number;
  resultsPerPage: number;
  page: number;
  loading: boolean;
}

const initialState: SearchState = {
  groups: [
    {
      name: 'Elements',
      collapsed: false,
      filters: [
        {
          name: 'Elements',
          id: FilterId.ELEMENTS,
          type: FilterType.ELEMENTS_INPUT,
          props: {
            parsedValue: [],
            type: ElementsInputType.ELEMENTS,
            delimiter: ','
          }
        }
      ]
    },
    {
      name: 'General',
      collapsed: false,
      filters: [
        {
          name: 'Volume',
          id: FilterId.VOLUME,
          type: FilterType.SLIDER,
          props: {
            domain: [0, 200]
          }
        },
        {
          name: 'Density',
          id: FilterId.DENSITY,
          type: FilterType.SLIDER,
          props: {
            domain: [0, 200]
          }
        }
      ]
    }
  ],
  values: {
    volume: [0, 200],
    density: [10, 50],
    elements: ''
  },
  searchParams: [],
  activeFilters: [],
  results: [],
  totalResults: 0,
  resultsPerPage: 10,
  page: 1,
  loading: false
};

const MaterialsSearchContext = React.createContext<any | undefined>(undefined);

export const MaterialsSearchProvider: React.FC = ({ children }) => {
  const [state, setState] = useState(initialState);
  const actions = {
    setFilterValue: (value: any, id: string) => {
      setState({ ...state, values: { ...state.values, [id]: value } });
    },
    setFilterProps: (props: Object, filterId: string, groupId: string) => {
      const groups = state.groups;
      const group = groups.find(g => g.name === groupId);
      const filter = group.filters.find(f => f.id === filterId);
      if (filter) filter.props = { ...filter.props, ...props };
      setState({ ...state, groups: groups });
    },
    toggleGroup: (groupId: string) => {
      const groups = state.groups;
      const group = groups.find(g => g.name === groupId);
      group.collapsed = !group.collapsed;
      setState({ ...state, groups: groups });
    },
    setSearchParams: () => {
      const searchParams: SearchParam[] = [];
      const activeFilters: any[] = [];
      state.groups.forEach(g => {
        g.filters.forEach(f => {
          switch (f.type) {
            case FilterType.SLIDER:
              if (
                state.values[f.id][0] !== f.props.domain[0] ||
                state.values[f.id][1] !== f.props.domain[1]
              ) {
                activeFilters.push({
                  id: f.id,
                  value: state.values[f.id],
                  defaultValue: f.props.domain
                });
                searchParams.push({
                  field: f.id + '_min',
                  value: state.values[f.id][0]
                });
                searchParams.push({
                  field: f.id + '_max',
                  value: state.values[f.id][1]
                });
              }
              break;
            case FilterType.ELEMENTS_INPUT:
              if (state.values[f.id] !== '') {
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
              if (state.values[f.id]) {
                searchParams.push({
                  field: f.id,
                  value: state.values[f.id]
                });
              }
          }
        });
      });
      setState({ ...state, searchParams, activeFilters });
    },
    getData: (page = state.page) => {
      setState({
        ...state,
        page: page,
        loading: true
      });
      let params: any = {};
      state.searchParams.forEach((d, i) => {
        params[d.field] = d.value;
      });
      params.fields = ['task_id', 'formula_pretty', 'volume', 'density'];
      params.limit = state.resultsPerPage;
      params.skip = (page - 1) * state.resultsPerPage;
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
          setState({
            ...state,
            results: result.data.data,
            totalResults: result.data.meta.total,
            loading: false
          });
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
    console.log('filter changed');
    console.log(state);
    actions.setSearchParams();
  }, [state.values]);

  useEffect(() => {
    actions.setSearchParams();
    actions.getData();
  }, []);

  return (
    <MaterialsSearchContext.Provider value={{ state, actions }}>
      {children}
    </MaterialsSearchContext.Provider>
  );
};

export const useMaterialsSearch = () => {
  const context = React.useContext(MaterialsSearchContext);
  if (context === undefined) {
    throw new Error('useMaterialsSearch must be used within a MaterialsSearchProvider');
  }
  return context;
};
