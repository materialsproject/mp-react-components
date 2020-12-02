import React, { useState, useEffect } from 'react';
import axios from 'axios';
import qs from 'qs';
import { useDeepCompareDebounce, usePrevious, useQuery } from '../../../../utils/hooks';
import {
  FilterGroup,
  FilterType,
  FilterId,
  ActiveFilter,
  SearchState,
  Column,
  initColumns,
  initFilterGroups,
  ColumnFormat
} from '../types';
import { SearchUIProps } from '../../SearchUI';
import { useHistory } from 'react-router-dom';
import { arrayToDelimitedString, crystalSystemOptions, getDelimiter, parseElements, spaceGroupNumberOptions, spaceGroupSymbolOptions } from '../../utils';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { spaceGroups } from '../../GroupSpaceSearch/space-groups';
import { Link } from '../../../navigation/Link';

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
  sortDirection: 'asc',
  topLevelSearchField: 'elements'
};

/**
 * Method for initializing and updating the search state's active filters.
 * Returns a full state object
 * Optionally accepts a filterValues argument which represents a new hash map
 * of values for building the activeFilters list.
 * The activeFilters list is recomputed whenever a filter is modified in the UI.
 */
const getState = (
  currentState: SearchState, 
  filterValues = { ...currentState.filterValues }
): SearchState => {
  const activeFilters: ActiveFilter[] = [];
  currentState.filterGroups.forEach(g => {
    g.filters.forEach(f => {
      switch (f.type) {
        case FilterType.SLIDER:
          if (
            filterValues[f.id][0] !== f.props.domain[0] ||
            filterValues[f.id][1] !== f.props.domain[1]
          ) {
            activeFilters.push({
              id: f.id,
              displayName: f.name ? f.name : f.id,
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
          if (filterValues[f.id] !== '') {
            /**
             * If the input controls the elements param,
             * parse the input's value into an array of valid elements.
             * Otherwise, use the raw input value for the param.
             */
            let parsedValue = filterValues[f.id];
            let filterDisplayName = f.props.field;
            if (f.id === 'elements') {
              const delimiter = getDelimiter(filterValues[f.id]);
              parsedValue = parseElements(filterValues[f.id], delimiter);
              filterDisplayName = 'contains elements';
              /**
               * If the input is a chemical system, merge elements to a dash-delimited string (e.g. Fe-Co-Si)
               * This will tell the API to return materials with this exact chemical system
               */
              // if (delimiter.toString() === new RegExp(/-/).toString()) {
              if (f.props.isChemSys) {
                parsedValue = arrayToDelimitedString(parsedValue, delimiter);
                filterDisplayName = 'contains only elements';
              }
              f.props.enabledElements = parsedValue;
            }
            activeFilters.push({
              id: f.id,
              displayName: filterDisplayName,
              value: parsedValue,
              defaultValue: '',
              searchParams: [
                {
                  field: f.props.field,
                  value: parsedValue
                }
              ]
            });
            /**
             * Expand the Material filter group by default if one of the
             * main filters are active
             */
            if (f.id === 'elements' || f.id === 'formula' || f.id === 'task_ids') {
              g.expanded = true;
            }
          }
          break;
        case FilterType.SELECT_SPACEGROUP_SYMBOL:
          if (
            filterValues[f.id] !== undefined && 
            filterValues[f.id] !== null &&
            filterValues[f.id] !== ''
          ) {
            const spaceGroup = spaceGroups.find(d => d["space-group.symbol"] === filterValues[f.id]);
            const formattedSymbol = spaceGroup ? spaceGroup["uni-symbol"] : filterValues[f.id];
            activeFilters.push({
              id: f.id,
              displayName: f.name ? f.name : f.id,
              value: formattedSymbol,
              defaultValue: undefined,
              searchParams: [
                {
                  field: f.id,
                  value: filterValues[f.id]
                }
              ]
            });
          }
          break;
        default:
          if (
            filterValues[f.id] !== undefined && 
            filterValues[f.id] !== null &&
            filterValues[f.id] !== ''
          ) {
            activeFilters.push({
              id: f.id,
              displayName: f.name ? f.name : f.id,
              value: filterValues[f.id],
              defaultValue: undefined,
              searchParams: [
                {
                  field: f.id,
                  value: filterValues[f.id]
                }
              ]
            });
            /**
             * Expand the Material filter group by default if one of the
             * main filters are active
             */
            if (f.id === 'elements' || f.id === 'formula' || f.id === 'task_ids') {
              g.expanded = true;
            }
          }
      }
    });
  });
  return { ...currentState, filterValues, activeFilters };
};

/**
 * Initialize columns with their proper format function
 * The "format" prop should initially be one of the ColumnFormat strings
 * which maps to one of the format (or cell) functions defined here.
 * FIXED_DECIMAL and SIGNIFICANT_FIGURES both expect another column property "formatArg"
 * that will specify how many decimals or figures to apply to the format.
 */
const initColumns = (columns: Column[]) => {
  return columns.map(c => {
    c.sortable = c.sortable !== undefined ? c.sortable : true;
    switch (c.format) {
      case ColumnFormat.FIXED_DECIMAL:
        const decimalPlaces = c.formatArg ? c.formatArg : 2;
        c.format = (row: any) => row[c.selector] ? row[c.selector].toFixed(decimalPlaces) : '';
        return c;
      case ColumnFormat.SIGNIFICANT_FIGURES:
        const sigFigs = c.formatArg ? c.formatArg : 5;
        c.format = (row: any) => row[c.selector] ? row[c.selector].toPrecision(sigFigs) : '';
        return c;
      case ColumnFormat.FORMULA:
        c.cell = (row: any) => {
          if (row[c.selector] && typeof row[c.selector] === 'string') {
            const splitFormula: string[] = row[c.selector].split(/([0-9]+)/g);
            const formulaItem = (str: string) => {
              if (parseInt(str)) {
                return <sub>{str}</sub>;
              } else {
                return <span>{str}</span>;
              }
            };
            return (
              <span>
                {splitFormula.map((s, i) => (
                  <span key={i}>{formulaItem(s)}</span>
                ))}
              </span>
            );
          } else {
            return <span></span>;
          }
        };
        return c;
      case ColumnFormat.LINK:
        c.cell = (row: any) => {
          const path = c.formatArg ? c.formatArg + row[c.selector] : row[c.selector];
          return (
            <Link href={path}>{row[c.selector]}</Link>
          );
        }
        return c;
      case ColumnFormat.BOOLEAN:
        const hasCustomLabels = c.formatArg && Array.isArray(c.formatArg);
        const truthyLabel = hasCustomLabels ? c.formatArg[0] : 'true';
        const falsyLabel = hasCustomLabels ? c.formatArg[1] : 'false';
        c.format = (row: any) => row[c.selector] ? truthyLabel : falsyLabel;
        return c;
      case ColumnFormat.SPACEGROUP_SYMBOL:
        c.format = (row: any) => {
          const selectors = c.selector.split('.');
          const rowValue = selectors.length === 1 ? row[selectors[0]] : row[selectors[0]][selectors[1]];
          const spaceGroup = spaceGroups.find(d => d["symbol"] === rowValue);
          const formattedSymbol = spaceGroup ? spaceGroup["symbol_unicode"] : rowValue;
          return formattedSymbol;
        }
      default:
        return c;
    }
  });
};

const initFilterGroups = (filterGroups: FilterGroup[], query: URLSearchParams) => {
  const initializedValues = {};
  const initializedGroups = filterGroups.map(g => {
    g.filters = g.filters.map(f => {
      let queryParamValue: any = query.get(f.id);
      switch (f.type) {
        case FilterType.SLIDER:
          const queryParamMinString = query.get(f.id + '_min');
          const queryParamMaxString = query.get(f.id + '_max');
          const queryParamMin = queryParamMinString ? parseFloat(queryParamMinString) : null;
          const queryParamMax = queryParamMaxString ? parseFloat(queryParamMaxString) : null;
          queryParamValue = queryParamMin && queryParamMax ? [queryParamMin, queryParamMax] : null;
          initializedValues[f.id] = queryParamValue ? queryParamValue : f.props.domain;
          return f;
        case FilterType.MATERIALS_INPUT:
          initializedValues[f.id] = queryParamValue ? queryParamValue : '';
          if (!f.hasOwnProperty('props')) f.props = { parsedValue: [] };
          if (f.hasOwnProperty('props') && !f.props.hasOwnProperty('parsedValue')) {
            f.props.parsedValue = [];
          }
          return f;
        case FilterType.SELECT_SPACEGROUP_SYMBOL:
          initializedValues[f.id] = queryParamValue ? queryParamValue : undefined;
          f.props = {options: spaceGroupSymbolOptions()};
          return f;
        case FilterType.SELECT_SPACEGROUP_NUMBER:
          initializedValues[f.id] = queryParamValue ? queryParamValue : undefined;
          f.props = {options: spaceGroupNumberOptions()};
          return f;
        case FilterType.SELECT_CRYSTAL_SYSTEM:
          initializedValues[f.id] = queryParamValue ? queryParamValue : undefined;
          f.props = {options: crystalSystemOptions()};
          return f;
        default:
          initializedValues[f.id] = queryParamValue ? queryParamValue : undefined;
          return f;
      }
    });
    return g;
  });
  return { initializedGroups, initializedValues}
}

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
export const SearchUIContextProvider: React.FC<SearchUIProps> = props => {
  const { children, ...propsWithoutChildren } = props;
  const query = useQuery();
  const history = useHistory();
  const [state, setState] = useState(() => {
    /**
     * Initial state is a combination of the defaultState values above
     * and all the values provided in props (except props.children)
     */
    const initialState: SearchState = {...defaultState, ...propsWithoutChildren};
    initialState.columns = initColumns(props.columns);
    const { initializedGroups, initializedValues } = initFilterGroups(props.filterGroups, query);
    const urlLimit = query.get('limit');
    const urlSkip = query.get('skip');
    const urlSortField = query.get('field');
    const urlAscending = query.get('ascending');
    if (urlLimit) initialState.resultsPerPage = parseInt(urlLimit);
    if (urlSkip) initialState.page = (parseInt(urlSkip) / initialState.resultsPerPage) + 1;
    if (urlSortField) initialState.sortField = urlSortField;
    if (urlAscending) initialState.sortDirection = urlAscending === 'true' ? 'asc' : 'desc';
    initialState.filterGroups = initializedGroups;
    initialState.filterValues = initializedValues;
    return getState(initialState);
  });
  const prevActiveFilters = usePrevious(state.activeFilters);
  const debouncedActiveFilters = useDeepCompareDebounce(state.activeFilters, 500);

  const actions = {
    setPage: (value: number) => {
      setState(currentState => ({ ...currentState, page: value }));
    },
    setResultsPerPage: (value: number) => {
      setState(currentState => ({ ...currentState, resultsPerPage: value }));
    },
    setSort: (field: string, direction: 'asc' | 'desc') => {
      setState(currentState => ({ ...currentState, sortField: field, sortDirection: direction}));
    },
    setFilterValue: (value: any, id: string) => {
      setState(currentState =>
        getState({ ...currentState, page: 1 }, { ...currentState.filterValues, [id]: value })
      );
    },
    setFilterWithOverrides: (value: any, id: string, overrideFields: string[]) => {
      setState(currentState => {
        let newFilterValues = {[id]: value};
        overrideFields.forEach((field) => {
          const activeFilter = currentState.activeFilters.find((a) => a.id === field);
          if (activeFilter) newFilterValues[field] = activeFilter.defaultValue;
        });
        let newFilterGroups = currentState.filterGroups.slice();
        newFilterGroups[0].expanded = true;
        return getState({ ...currentState, filterGroups: newFilterGroups }, { ...currentState.filterValues, ...newFilterValues });
      });
    },
    resetAllFiltersExcept: (value: any, id: string) => {
      setState(currentState => {
        const { activeFilters, filterValues } = getResetFiltersAndValues(currentState);
        return getState({ ...currentState, activeFilters }, { ...filterValues, [id]: value });
      });
    },
    setFilterProps: (props: any, filterId: string, groupId: string) => {
      setState(currentState => {
        const filterGroups = currentState.filterGroups;
        const group = filterGroups.find(g => g.name === groupId);
        const filter = group?.filters.find(f => f.id === filterId);
        if (filter) filter.props = { ...filter.props, ...props };
        const stateWithNewFilterProps = { ...currentState, filterGroups: filterGroups };
        // const newState =
        //   filter && filter.props.hasOwnProperty('parsedValue')
        //     ? getState(stateWithNewFilterProps)
        //     : stateWithNewFilterProps;
        const newFilterValues = props.hasOwnProperty('initialValues') ? { ...currentState.filterValues, [filterId]: props.initialValues } : undefined;
        return getState({ ...stateWithNewFilterProps }, newFilterValues);
      });
    },
    getData: () => {
      setState(currentState => {
        /**
         * Only show the loading icon if this is a filter change
         * not on simple page change
         */
        const showLoading = currentState.activeFilters !== prevActiveFilters ? true : false;
        let isLoading = showLoading;
        let minLoadTime = 1000;
        let minLoadTimeReached = !showLoading;
        let params: any = {};
        let query = new URLSearchParams();
        params.fields = currentState.columns.map(d => d.selector);
        params.limit = currentState.resultsPerPage;
        params.skip = (currentState.page - 1) * currentState.resultsPerPage;
        query.set('limit', params.limit);
        query.set('skip', params.skip);
        if (currentState.sortField) {
          params.field = currentState.sortField;
          params.ascending = currentState.sortDirection === 'desc' ? false : true;
          query.set('field', params.field);
          query.set('ascending', params.ascending);
        }
        currentState.activeFilters.forEach(a => {
          a.searchParams?.forEach(s => {
            let field = s.field;
            let value = s.value;
            /**
             * Elements values that are strings should be interpreted as formula fields
             * This lets the elements field handle chemical system searches (e.g. Fe-Co-Si)
             */
            if (field === 'elements' && typeof value === 'string') {
              field = 'formula';
            }
            params[field] = value;
            query.set(field, value)
          });
        });

        axios
          .get(props.baseURL, {
            params: params,
            paramsSerializer: p => {
              return qs.stringify(p, { arrayFormat: 'comma' });
            },
            headers: props.apiKey
              ? {
                  'X-Api-Key': props.apiKey,
                  'Access-Control-Allow-Origin': '*'
                }
              : null
          })
          .then(result => {
            console.log(result);
            history.push({search: query.toString()});
            isLoading = false;
            const loadingValue = minLoadTimeReached ? false : true;
            setState(currentState => {
              return {
                ...currentState,
                results: result.data.data,
                totalResults: result.data.meta.total,
                loading: loadingValue
              };
            });
          })
          .catch(error => {
            console.log(error);
            isLoading = false;
            const loadingValue = minLoadTimeReached ? false : true;
            setState(currentState => {
              return {
                ...currentState,
                results: [],
                totalResults: 0,
                loading: loadingValue
              };
            });
          });

        if (showLoading) {
          setTimeout(() => {
            if (!isLoading) {
              setState(currentState => {
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

  useDeepCompareEffect(() => {
      actions.getData();
  }, [state.activeFilters, state.resultsPerPage, state.page, state.sortField, state.sortDirection]);

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
