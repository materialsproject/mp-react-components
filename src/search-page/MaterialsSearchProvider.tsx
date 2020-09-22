import React, { useReducer, useState } from 'react';
import axios from 'axios';
import qs from 'qs';

const MaterialsSearchContext = React.createContext<any | undefined>(undefined);

interface Filter {
  field: string;
  value: any;
}

interface SearchState {
  elementsFilter: Object;
  activeFilters: Filter[];
  results: any[];
};

const initialState: SearchState = {
  elementsFilter: {
    value: '',
    type: '',
    delimiter: ''
  },
  activeFilters: [],
  results: []
};

export function MaterialsSearchProvider({children}) {
  const [state, setState] = useState(initialState);
  const actions = {
    setElementsFilter: (data) => {
      setState({...state, elementsFilter: data});
    },
    getData: () => {
      let searchParams: any = {};
      state.activeFilters.forEach((d, i) => {
        searchParams[d.field] = d.value;
      });
      searchParams.fields = ['task_id', 'formula_pretty', 'volume'];
      axios.get('https://api.materialsproject.cloud/materials/', {
        params: searchParams,
        paramsSerializer: params => {
          return qs.stringify(params, {arrayFormat: 'comma'});
        }
      }).then((result) => {
        console.log(result);
        setState({...state, results: result.data.data});
      });
    },
    addFilter: (filter: Filter) => {
      const current = state.activeFilters.find((d) => d.field === filter.field);
      if(current) {
        current.value = filter.value;
      } else {
        state.activeFilters.push(filter);
      }
      
      if(filter.field === 'elements') {
        state.activeFilters = state.activeFilters.filter((d) => d.field !== 'formula');
      } else if(filter.field === 'formula') {
        state.activeFilters = state.activeFilters.filter((d) => d.field !== 'elements');
      }

      setState({...state, activeFilters: state.activeFilters});
    },
    logFilters: () => {
      console.log(state.activeFilters);
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