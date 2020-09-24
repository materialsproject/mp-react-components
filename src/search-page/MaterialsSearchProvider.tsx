import React, { useReducer, useState } from 'react';
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
  filters: Filter[];
  values: FilterValues;
  searchParams: SearchParam[];
  results: any[];
}

const initialState: SearchState = {
  filters: [
    {
      name: 'Elements',
      id: FilterId.ELEMENTS,
      type: FilterType.ELEMENTS_INPUT,
      props: {
        rawValue: '',
        type: ElementsInputType.ELEMENTS,
        delimiter: ','
      }
    },
    {
      name: 'Volume',
      id: FilterId.VOLUME,
      type: FilterType.SLIDER,
      props: {
        domain: [0, 200]
      }
    }
  ],
  values: {
    volume: [0,200],
    density: [1,5],
    elements: []
  },
  searchParams: [],
  results: []
};

const MaterialsSearchContext = React.createContext<any | undefined>(undefined);

export const MaterialsSearchProvider: React.FC = ({children}) => {
  const [state, setState] = useState(initialState);
  const actions = {
    setFilterValue: (value: any, id: string) => {
      setState({...state, values:{...state.values, [id]: value}});
    },
    setFilterProps: (props: Object, id: string) => {
      const filters = state.filters;
      const filter = filters.find(f => f.id === id);
      if(filter) filter.props = {...filter.props, ...props};
      setState({...state, filters: filters});
    },
    setSearchParams: () => {
      const searchParams: SearchParam[] = [];
      state.filters.forEach(f => {
        switch(f.type) {
          case FilterType.SLIDER:
            searchParams.push({
              field: f.id + '_min',
              value: state.values[f.id][0]
            });
            searchParams.push({
              field: f.id + '_max',
              value: state.values[f.id][1]
            });
            break;
          case FilterType.ELEMENTS_INPUT:
            searchParams.push({
              field: f.props.type,
              value: state.values[f.id]
            });
          default:
            if(state.values[f.id]) {
              searchParams.push({
                field: f.id,
                value: state.values[f.id]
              });
            }
        }
      });
      setState({...state, searchParams});
    },
    getData: () => {
      let paramsConfig: any = {};
      state.searchParams.forEach((d, i) => {
        paramsConfig[d.field] = d.value;
      });
      paramsConfig.fields = ['task_id', 'formula_pretty', 'volume'];
      axios.get('https://api.materialsproject.org/materials/', {
        params: paramsConfig,
        paramsSerializer: params => {
          return qs.stringify(params, {arrayFormat: 'comma'});
        }
      }).then((result) => {
        console.log(result);
        setState({...state, results: result.data.data});
      });
    },
    logFilters: () => {
      console.log(state.searchParams);
    },
    reset: () => {
      setState(initialState);
    }
  };

  return (
    <MaterialsSearchContext.Provider value={{ state, actions }}>
      {children}
    </MaterialsSearchContext.Provider>
  )
}

export function useMaterialsSearch() {
  const context = React.useContext(MaterialsSearchContext)
  if (context === undefined) {
    throw new Error('useMaterialsSearch must be used within a MaterialsSearchProvider')
  }
  return context
}