import React, { useReducer } from 'react';
import { PeriodicContext } from '../periodic-table/periodic-table-state/periodic-selection-context';
import { SelectableTable } from '../periodic-table/table-state';
import { TableLayout } from '../periodic-table/periodic-table-component/periodic-table.component';
import { ElementsInput } from './ElementsInput/ElementsInput';

const SearchFiltersContext = React.createContext<any | undefined>(undefined);

const getSearchFiltersStore = () => {
  const state = {
    elementsInputValue: 'quesadilla'
  };
  const actions = {
    changeElementsInput: () => {
      state.elementsInputValue = 'taco';
      console.log('test');
    }
  }
  return {
    state,
    actions
  };
}

const searchState = {
  elementsInputValue: 'quesadilla'
};

function searchReducer(state, action) {
  switch (action.type) {
    case 'taco': {
      return {elementsInputValue: 'taco'}
    }
    case 'burrito': {
      return {elementsInputValue: 'burrito'}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

export function SearchFiltersProvider({children}) {
  // const { state, actions } = getSearchFiltersStore();
  const [state, dispatch] = useReducer(searchReducer, searchState);
  return (
    <SearchFiltersContext.Provider value={{ state, dispatch }}>
      {children}
    </SearchFiltersContext.Provider>
  )
}

export function useSearchFilters() {
  const context = React.useContext(SearchFiltersContext)
  if (context === undefined) {
    throw new Error('useSearchFilters must be used within a SearchFilters')
  }
  return context
}