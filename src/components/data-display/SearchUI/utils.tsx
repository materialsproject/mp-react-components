import React from 'react';
import classNames from 'classnames';
import {
  crystalSystemOptions,
  formatFormula,
  formatPointGroup,
  pointGroupOptions,
  spaceGroupNumberOptions,
  spaceGroupSymbolOptions
} from '../../data-entry/utils';
import {
  ActiveFilter,
  Column,
  ColumnFormat,
  FilterGroup,
  FilterType,
  SearchParam,
  SearchState
} from './types';
import { Link } from '../../navigation/Link';
import { spaceGroups } from '../../../constants/spaceGroups';
import { MaterialsInputType } from '../../data-entry/MaterialsInput';
import { MaterialsInputTypesMap, validateElements } from '../../data-entry/MaterialsInput/utils';
import { SearchUIProps } from '.';
import { FaDownload } from 'react-icons/fa';
import { joinUrl } from '../../../utils/navigation';
import { Tooltip } from '../Tooltip';
import { ArrayChips } from '../ArrayChips';
import { Formula } from '../Formula';
import { initColumns } from '../../../utils/table';
import {
  ArrayParam,
  BooleanParam,
  DelimitedNumericArrayParam,
  NumberParam,
  QueryParamConfigMap,
  StringParam
} from 'use-query-params';

const defaultMinSuffix = '_min';
const defaultMaxSuffix = '_max';

export const isNotEmpty = (value: any) => {
  if (Array.isArray(value)) {
    return value.length > 0 ? true : false;
  } else {
    return value !== undefined && value !== null && value !== '';
  }
};

export const newInitFilterGroups = (filterGroups: FilterGroup[]): FilterGroup[] => {
  const initializedGroups = filterGroups.map((g) => {
    g.filters = g.filters.map((f) => {
      switch (f.type) {
        case FilterType.SELECT_SPACEGROUP_SYMBOL:
          f.props = { options: spaceGroupSymbolOptions() };
          return f;
        case FilterType.SELECT_SPACEGROUP_NUMBER:
          f.props = { options: spaceGroupNumberOptions() };
          return f;
        case FilterType.SELECT_CRYSTAL_SYSTEM:
          f.props = { options: crystalSystemOptions() };
          return f;
        case FilterType.SELECT_POINTGROUP:
          f.props = {
            options: pointGroupOptions(),
            formatOptionLabel: ({ value, label, customAbbreviation }) => {
              return formatPointGroup(label);
            }
          };
          return f;
        default:
          return f;
      }
    });
    return g;
  });
  return initializedGroups;
};

const initFilterGroups = (filterGroups: FilterGroup[], query: URLSearchParams) => {
  const initializedValues = {};
  const initializedGroups = filterGroups.map((g) => {
    g.filters = g.filters.map((f) => {
      let queryParamValue: any = query.get(f.id);

      /**
       * Chem sys queries are represented in the formula query param
       * but should render in the elements filter. These two checks
       * make sure chem sys gets assigned to elements filter.
       */
      if (f.id === 'formula' && queryParamValue && queryParamValue.indexOf('-') > -1) {
        queryParamValue = '';
      }

      if (f.id === 'elements' && query.get('formula') && query.get('formula')!.indexOf('-') > -1) {
        queryParamValue = query.get('formula');
        if (!f.hasOwnProperty('props')) f.props = {};
        /** Make sure elements filter is initialized with the appropriate elements mode */
        f.props.type = 'chemical_system';
      }

      switch (f.type) {
        case FilterType.SLIDER:
          const minSuffix = f.minSuffix || defaultMinSuffix;
          const maxSuffix = f.maxSuffix || defaultMaxSuffix;
          const queryParamMinString = query.get(f.id + minSuffix);
          const queryParamMaxString = query.get(f.id + maxSuffix);
          let queryParamMin = queryParamMinString ? parseFloat(queryParamMinString) : null;
          let queryParamMax = queryParamMaxString ? parseFloat(queryParamMaxString) : null;
          if (queryParamMin !== null || queryParamMax !== null) {
            queryParamValue = [queryParamMin, queryParamMax];
          } else {
            queryParamValue = null;
          }
          initializedValues[f.id] = queryParamValue ? queryParamValue : f.props.domain;
          return f;
        case FilterType.MATERIALS_INPUT:
          initializedValues[f.id] = queryParamValue ? queryParamValue : '';
          if (!f.hasOwnProperty('props')) f.props = {};
          return f;
        case FilterType.SELECT_SPACEGROUP_SYMBOL:
          initializedValues[f.id] = queryParamValue ? queryParamValue : undefined;
          f.props = { options: spaceGroupSymbolOptions() };
          return f;
        case FilterType.SELECT_SPACEGROUP_NUMBER:
          initializedValues[f.id] = queryParamValue ? queryParamValue : undefined;
          f.props = { options: spaceGroupNumberOptions() };
          return f;
        case FilterType.SELECT_CRYSTAL_SYSTEM:
          initializedValues[f.id] = queryParamValue ? queryParamValue : undefined;
          f.props = { options: crystalSystemOptions() };
          return f;
        case FilterType.SELECT_POINTGROUP:
          initializedValues[f.id] = queryParamValue ? queryParamValue : undefined;
          f.props = {
            options: pointGroupOptions(),
            formatOptionLabel: ({ value, label, customAbbreviation }) => {
              return formatPointGroup(label);
            }
          };
          return f;
        case FilterType.THREE_STATE_BOOLEAN_SELECT:
          if (queryParamValue === 'true') {
            initializedValues[f.id] = true;
          } else if (queryParamValue === 'false') {
            initializedValues[f.id] = false;
          } else {
            initializedValues[f.id] = undefined;
          }
          return f;
        case FilterType.SELECT:
          if (queryParamValue) {
            initializedValues[f.id] = queryParamValue;
          } else if (f.props.defaultValue) {
            initializedValues[f.id] = f.props.defaultValue;
          } else if (f.props.value) {
            initializedValues[f.id] = f.props.value;
          } else {
            initializedValues[f.id] = undefined;
          }
          return f;
        case FilterType.TEXT_INPUT:
          initializedValues[f.id] = queryParamValue ? queryParamValue : undefined;
          return f;
        case FilterType.CHECKBOX_LIST:
          initializedValues[f.id] = query.get(f.id)?.split(',');
          return f;
        default:
          initializedValues[f.id] = queryParamValue ? queryParamValue : undefined;
          return f;
      }
    });
    return g;
  });
  return { initializedGroups, initializedValues };
};

export const updateActiveFilters = (filterGroups, query) => {
  const activeFilters: ActiveFilter[] = [];
  filterGroups.forEach((g) => {
    g.filters.forEach((f) => {
      const operatorSuffix = f.operatorSuffix || '';
      const af = {
        name: f.name,
        params: f.params,
        value: query[f.params[0]],
        isSearchBarField: f.isSearchBarField
      };
      switch (f.type) {
        case FilterType.SLIDER:
          /**
           * The lower bound will be null if initialized from a url that only has a max param.
           * The upper bound will be null if initialized from a url that only has a min param.
           */
          const hasActiveMin = query[f.params[0]] > f.props.domain[0];
          const hasActiveMax = query[f.params[1]] < f.props.domain[1];

          if (hasActiveMin || hasActiveMax) {
            const minSuffix = f.minSuffix || defaultMinSuffix;
            const maxSuffix = f.maxSuffix || defaultMaxSuffix;
            const searchParams: SearchParam[] = [];
            /**
             * If the min/max value is equal to the domain min/max,
             * then there won't be a param added for that bound.
             * This effectively makes the bounds inclusive (e.g. "100 or less", "1000 or more").
             */
            // if (hasActiveMin)
            //   searchParams.push({
            //     field: f.id + minSuffix,
            //     value: query[f.id][0]
            //   });
            // if (hasActiveMax)
            //   searchParams.push({
            //     field: f.id + maxSuffix,
            //     value: query[f.id][1]
            //   });
            activeFilters.push({
              ...af,
              value: [query[f.params[0]], query[f.params[1]]],
              defaultValue: f.props.domain,
              conversionFactor: f.conversionFactor
            });
          }
          break;
        case FilterType.MATERIALS_INPUT:
          if (isNotEmpty(query[f.id])) {
            let parsedValue = query[f.id];

            if (
              f.props.type === MaterialsInputType.CHEMICAL_SYSTEM ||
              (f.props.type === MaterialsInputType.FORMULA && query[f.id].indexOf('-') > -1)
            ) {
              /** Remove trailing '-' from chemical system string */
              parsedValue = query[f.id].replace(/\-$/, '');
            } else if (f.props.type === MaterialsInputType.ELEMENTS) {
              /** Parse elements back into array so that they're in a normalized format for the query */
              parsedValue = validateElements(query[f.id]);
            }

            activeFilters.push({
              ...af,
              value: parsedValue,
              searchParams: [
                {
                  field: f.id + operatorSuffix,
                  value: f.makeLowerCase ? parsedValue.toLowerCase() : parsedValue
                }
              ]
            });
          }
          break;
        case FilterType.SELECT_SPACEGROUP_SYMBOL:
          if (isNotEmpty(query[f.id])) {
            const spaceGroup = spaceGroups.find((d) => d['symbol'] === query[f.id]);
            const formattedSymbol = spaceGroup ? spaceGroup['symbol_unicode'] : query[f.id];
            activeFilters.push({
              ...af,
              value: formattedSymbol,
              searchParams: [
                {
                  field: f.id + operatorSuffix,
                  value: query[f.id]
                }
              ]
            });
          }
          break;
        case FilterType.SELECT:
        case FilterType.THREE_STATE_BOOLEAN_SELECT:
          if (isNotEmpty(query[f.id])) {
            const selectedOption = f.props.options.find((d) => d.value === query[f.id]);
            const displayValue = selectedOption ? selectedOption.label : query[f.id];
            activeFilters.push({
              ...af,
              value: displayValue,
              searchParams: [
                {
                  field: f.id + operatorSuffix,
                  value: f.makeLowerCase ? query[f.id].toLowerCase() : query[f.id]
                }
              ]
            });
          }
          break;
        case FilterType.TEXT_INPUT:
          if (isNotEmpty(query[f.id])) {
            activeFilters.push({
              ...af,
              searchParams: [
                {
                  field: f.id + operatorSuffix,
                  value: f.makeLowerCase ? query[f.id].toLowerCase() : query[f.id]
                }
              ]
            });
          }
          break;
        case FilterType.CHECKBOX_LIST:
          if (isNotEmpty(query[f.id])) {
            const displayValue = query[f.id].map((d) => {
              const option = f.props.options.find((o) => o.value === d);
              return option.label || d;
            });

            activeFilters.push({
              ...af,
              value: displayValue,
              searchParams: [
                {
                  field: f.id + operatorSuffix,
                  value: f.makeLowerCase ? query[f.id].toLowerCase() : query[f.id]
                }
              ]
            });
          }
          break;
        default:
          if (isNotEmpty(query[f.id])) {
            activeFilters.push({
              ...af,
              searchParams: [
                {
                  field: f.id + operatorSuffix,
                  value: f.makeLowerCase ? query[f.id].toLowerCase() : query[f.id]
                }
              ]
            });
          }
      }
    });
  });
  return activeFilters;
};

/**
 * Method for initializing and updating the search state's active filters.
 * Returns a full state object
 * Optionally accepts a filterValues argument which represents a new hash map
 * of values for building the activeFilters list.
 * The activeFilters list is recomputed whenever a filter is modified in the UI.
 */
export const getSearchState = (
  currentState: SearchState,
  filterValues = { ...currentState.filterValues }
): SearchState => {
  // const isDesktop = useMediaQuery({ minWidth: 1024 });
  const activeFilters: ActiveFilter[] = [];
  currentState.filterGroups.forEach((g) => {
    g.filters.forEach((f) => {
      const operatorSuffix = f.operatorSuffix || '';
      switch (f.type) {
        case FilterType.SLIDER:
          /**
           * The lower bound will be null if initialized from a url that only has a max param.
           * The upper bound will be null if initialized from a url that only has a min param.
           */
          const hasActiveMin =
            filterValues[f.id][0] !== null && filterValues[f.id][0] > f.props.domain[0];
          const hasActiveMax =
            filterValues[f.id][1] !== null && filterValues[f.id][1] < f.props.domain[1];

          if (hasActiveMin || hasActiveMax) {
            const minSuffix = f.minSuffix || defaultMinSuffix;
            const maxSuffix = f.maxSuffix || defaultMaxSuffix;
            const searchParams: SearchParam[] = [];
            /**
             * If the min/max value is equal to the domain min/max,
             * then there won't be a param added for that bound.
             * This effectively makes the bounds inclusive (e.g. "100 or less", "1000 or more").
             */
            if (hasActiveMin)
              searchParams.push({
                field: f.id + minSuffix,
                value: filterValues[f.id][0]
              });
            if (hasActiveMax)
              searchParams.push({
                field: f.id + maxSuffix,
                value: filterValues[f.id][1]
              });
            activeFilters.push({
              id: f.id,
              displayName: f.name ? f.name : f.id,
              value: filterValues[f.id],
              defaultValue: f.props.domain,
              conversionFactor: f.conversionFactor,
              searchParams: searchParams
            });
          }
          break;
        case FilterType.MATERIALS_INPUT:
          if (filterValues[f.id] !== '') {
            let parsedValue = filterValues[f.id];

            if (
              f.props.type === MaterialsInputType.CHEMICAL_SYSTEM ||
              (f.props.type === MaterialsInputType.FORMULA && filterValues[f.id].indexOf('-') > -1)
            ) {
              /** Remove trailing '-' from chemical system string */
              parsedValue = filterValues[f.id].replace(/\-$/, '');
            } else if (f.props.type === MaterialsInputType.ELEMENTS) {
              /** Parse elements back into array so that they're in a normalized format for the query */
              parsedValue = validateElements(filterValues[f.id]);
            }

            activeFilters.push({
              id: f.id,
              displayName: f.name ? f.name : f.id,
              value: parsedValue,
              defaultValue: '',
              searchParams: [
                {
                  field: f.id + operatorSuffix,
                  value: f.makeLowerCase ? parsedValue.toLowerCase() : parsedValue
                }
              ]
            });
          }
          break;
        case FilterType.SELECT_SPACEGROUP_SYMBOL:
          if (isNotEmpty(filterValues[f.id])) {
            const spaceGroup = spaceGroups.find((d) => d['symbol'] === filterValues[f.id]);
            const formattedSymbol = spaceGroup ? spaceGroup['symbol_unicode'] : filterValues[f.id];
            activeFilters.push({
              id: f.id,
              displayName: f.name ? f.name : f.id,
              value: formattedSymbol,
              defaultValue: undefined,
              searchParams: [
                {
                  field: f.id + operatorSuffix,
                  value: filterValues[f.id]
                }
              ]
            });
          }
          break;
        case FilterType.SELECT:
        case FilterType.THREE_STATE_BOOLEAN_SELECT:
          if (isNotEmpty(filterValues[f.id])) {
            const selectedOption = f.props.options.find((d) => d.value === filterValues[f.id]);
            const displayValue = selectedOption ? selectedOption.label : filterValues[f.id];
            activeFilters.push({
              id: f.id,
              displayName: f.name ? f.name : f.id,
              value: displayValue,
              defaultValue: undefined,
              searchParams: [
                {
                  field: f.id + operatorSuffix,
                  value: f.makeLowerCase ? filterValues[f.id].toLowerCase() : filterValues[f.id]
                }
              ]
            });
          }
          break;
        case FilterType.TEXT_INPUT:
          if (isNotEmpty(filterValues[f.id])) {
            activeFilters.push({
              id: f.id,
              displayName: f.name ? f.name : f.id,
              value: filterValues[f.id],
              defaultValue: undefined,
              searchParams: [
                {
                  field: f.id + operatorSuffix,
                  value: f.makeLowerCase ? filterValues[f.id].toLowerCase() : filterValues[f.id]
                }
              ]
            });
          }
          break;
        case FilterType.CHECKBOX_LIST:
          if (isNotEmpty(filterValues[f.id])) {
            const displayValue = filterValues[f.id].map((d) => {
              const option = f.props.options.find((o) => o.value === d);
              return option.label || d;
            });

            activeFilters.push({
              id: f.id,
              displayName: f.name ? f.name : f.id,
              value: displayValue,
              defaultValue: [],
              searchParams: [
                {
                  field: f.id + operatorSuffix,
                  value: f.makeLowerCase ? filterValues[f.id].toLowerCase() : filterValues[f.id]
                }
              ]
            });
          }
          break;
        default:
          if (isNotEmpty(filterValues[f.id])) {
            activeFilters.push({
              id: f.id,
              displayName: f.name ? f.name : f.id,
              value: filterValues[f.id],
              defaultValue: undefined,
              searchParams: [
                {
                  field: f.id + operatorSuffix,
                  value: f.makeLowerCase ? filterValues[f.id].toLowerCase() : filterValues[f.id]
                }
              ]
            });
          }
      }
    });
  });
  return { ...currentState, filterValues, activeFilters };
};

export const initQueryParams = (
  filterGroups: FilterGroup[],
  isContribs?: boolean
): QueryParamConfigMap => {
  const params: QueryParamConfigMap = {};
  const paramsToFilterMap = {};

  if (isContribs) {
    params._fields = ArrayParam;
    params._limit = NumberParam;
    params._skip = NumberParam;
    params._sort = ArrayParam;
  } else {
    params.fields = ArrayParam;
    params.limit = NumberParam;
    params.skip = NumberParam;
    params.sort_fields = ArrayParam;
  }

  filterGroups.forEach((g) => {
    g.filters.forEach((f) => {
      switch (f.type) {
        // case FilterType.SLIDER:
        //   const minSuffix = f.minSuffix || defaultMinSuffix;
        //   const maxSuffix = f.maxSuffix || defaultMaxSuffix;
        //   params[f.id + minSuffix] = NumberParam;
        //   params[f.id + maxSuffix] = NumberParam;
        //   break;
        case FilterType.MATERIALS_INPUT:
          params[f.params[0]] = f.props.type === 'elements' ? ArrayParam : StringParam;
          break;
        case FilterType.SLIDER:
          params[f.params[0]] = NumberParam;
          params[f.params[1]] = NumberParam;
          break;
        case FilterType.CHECKBOX_LIST:
          params[f.params[0]] = ArrayParam;
          break;
        case FilterType.THREE_STATE_BOOLEAN_SELECT:
          params[f.params[0]] = BooleanParam;
          break;
        default:
          params[f.params[0]] = StringParam;
      }
    });
  });
  return params;
};

export const initSearchState = (
  defaultState: SearchState,
  propsWithoutChildren: SearchUIProps,
  query: URLSearchParams,
  isDesktop = true
): SearchState => {
  /**
   * Initial state is a combination of the defaultState values above
   * and all the values provided in props (except props.children)
   */
  const initialState: SearchState = { ...defaultState, ...propsWithoutChildren };
  initialState.columns = initColumns(
    propsWithoutChildren.columns,
    initialState.disableRichColumnHeaders
  );
  const { initializedGroups, initializedValues } = initFilterGroups(
    propsWithoutChildren.filterGroups,
    query
  );
  console.log('init search state');
  if (
    isDesktop &&
    (initializedValues['elements'] ||
      initializedValues['formula'] ||
      initializedValues['task_ids'] ||
      initializedValues['material_ids'])
  ) {
    // initializedGroups[0].expanded = true;
  }

  initialState.filterGroups = initializedGroups;
  initialState.filterValues = initializedValues;

  const urlLimit = query.get('limit');
  const urlSkip = query.get('skip');
  const urlSortFields = query.get('sort_fields');

  if (urlLimit) initialState.resultsPerPage = parseInt(urlLimit);
  if (urlSkip) initialState.page = parseInt(urlSkip) / initialState.resultsPerPage + 1;

  /** Serialize sort params from API syntax to SearchUI props */
  if (urlSortFields) {
    const sortFields = urlSortFields.split(',');
    const sortFieldSplitDesc = sortFields[0].split('-');
    initialState.sortField =
      sortFieldSplitDesc.length === 1 ? sortFieldSplitDesc[0] : sortFieldSplitDesc[1];
    initialState.sortAscending = sortFieldSplitDesc.length === 1;
    initialState.secondarySortField = sortFields[1] || undefined;
    if (sortFields[1]) {
      const secondaryFieldSplitDesc = sortFields[1].split('-');
      const secondaryField =
        secondaryFieldSplitDesc.length === 1
          ? secondaryFieldSplitDesc[0]
          : secondaryFieldSplitDesc[1];
      initialState.secondarySortField =
        secondaryField !== initialState.sortField ? secondaryField : undefined;
      initialState.secondarySortAscending =
        initialState.secondarySortField !== undefined && secondaryFieldSplitDesc.length === 1;
    }
  }

  return getSearchState(initialState);
};

export const getDefaultFiltersAndValues = (state: SearchState) => {
  const filterValues = state.filterValues;
  let activeFilters = state.activeFilters;
  activeFilters.forEach((a) => {
    filterValues[a.id] = a.defaultValue;
  });
  activeFilters = [];
  return {
    filterValues,
    activeFilters
  };
};

export const convertMaterialsInputTypesMapToArray = (map: MaterialsInputTypesMap) => {
  let arr: MaterialsInputType[] = [];
  for (const inputType in map) {
    arr.push(inputType as MaterialsInputType);
  }
  return arr;
};

export const mapInputTypeToField = (
  inputType: MaterialsInputType,
  allowedInputTypesMap: MaterialsInputTypesMap
) => {
  return allowedInputTypesMap[inputType].field;
};
