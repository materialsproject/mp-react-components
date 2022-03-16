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
  Filter,
  FilterGroup,
  FilterType,
  SearchParam,
  SearchState,
  SearchUIContainerProps
} from './types';
import { Link } from '../../navigation/Link';
import { spaceGroups } from '../../../constants/spaceGroups';
import { MaterialsInputType } from '../../data-entry/MaterialsInput';
import { MaterialsInputTypesMap, validateElements } from '../../data-entry/MaterialsInput/utils';
import { FaDownload } from 'react-icons/fa';
import { joinUrl } from '../../../utils/navigation';
import { Tooltip } from '../Tooltip';
import { ArrayChips } from '../ArrayChips';
import { Formula } from '../Formula';
import { initColumns } from '../../../utils/table';
import {
  ArrayParam,
  BooleanParam,
  decodeDelimitedArray,
  DecodedValueMap,
  DelimitedNumericArrayParam,
  encodeDelimitedArray,
  NumberParam,
  QueryParamConfig,
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

/**
 * Update the search state's active filters.
 * The activeFilters list is recomputed whenever a filter is modified in the UI.
 */
export const updateActiveFilters = (
  filterGroups: FilterGroup[],
  query: DecodedValueMap<QueryParamConfigMap>
): ActiveFilter[] => {
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
          if (isNotEmpty(af.value)) {
            let parsedValue = af.value;

            if (
              f.props.type === MaterialsInputType.CHEMICAL_SYSTEM ||
              (f.props.type === MaterialsInputType.FORMULA && parsedValue.indexOf('-') > -1)
            ) {
              /** Remove trailing '-' from chemical system string */
              parsedValue = parsedValue.replace(/\-$/, '');
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
          if (isNotEmpty(af.value)) {
            const spaceGroup = spaceGroups.find((d) => d['symbol'] === af.value);
            const formattedSymbol = spaceGroup ? spaceGroup['symbol_unicode'] : af.value;
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
          if (isNotEmpty(af.value)) {
            const selectedOption = f.props.options.find((d) => d.value === af.value);
            const displayValue = selectedOption ? selectedOption.label : af.value;
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
          if (isNotEmpty(af.value)) {
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
          if (isNotEmpty(af.value)) {
            const displayValue = af.value.map((d) => {
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
          if (isNotEmpty(af.value)) {
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
 * Custom param type for array params that should show values
 * in the URL as a comma-separated array (e.g. sort_fields=density,volume).
 */
const CommaArrayParam: QueryParamConfig<
  (string | null)[] | null | undefined,
  (string | null)[] | null | undefined
> = {
  encode: (array) => encodeDelimitedArray(array, ','),

  decode: (arrayStr) => decodeDelimitedArray(arrayStr, ',')
};

/**
 * Create the query param config object based on the filter definitions.
 * This determines the keys in the query param object and assigns param types
 * to each key to determine how the param is encoded/decoded in the URL.
 * @param filterGroups filter definitions by nested group
 * @param sortKey key to use for the sort param
 * @param limitKey key to use for the result limit param
 * @param skipKey key to use for the skip amount (which index should the range of results start from)
 * @returns config that maps query params to param types
 */
export const initQueryParams = (
  filterGroups: FilterGroup[],
  sortKey: string,
  limitKey: string,
  skipKey: string
): QueryParamConfigMap => {
  const params: QueryParamConfigMap = {
    [sortKey]: CommaArrayParam,
    [limitKey]: NumberParam,
    [skipKey]: NumberParam
  };

  filterGroups.forEach((g) => {
    g.filters.forEach((f) => {
      switch (f.type) {
        case FilterType.SLIDER:
          params[f.params[0]] = NumberParam;
          params[f.params[1]] = NumberParam;
          break;
        case FilterType.CHECKBOX_LIST:
          params[f.params[0]] = CommaArrayParam;
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

/**
 * Apply transformations to the query param values before sending them to the API.
 * @param query object of query params and their values.
 * @param filterGroups filter definitions nested by group.
 * @returns object of query params with API-ready values.
 */
export const preprocessQueryParams = (
  query: DecodedValueMap<QueryParamConfigMap>,
  filterGroups: FilterGroup[]
) => {
  const params = {};
  for (const paramName in query) {
    let filter: Filter | undefined;
    filterGroups.forEach((g) => {
      g.filters.forEach((f) => {
        if (f.params[0] === paramName || f.params[1] === paramName) {
          filter = f;
        }
      });
    });
    if (filter) {
      let paramValue = query[paramName];
      switch (filter.type) {
        case FilterType.MATERIALS_INPUT:
          if (typeof paramValue === 'string') {
            paramValue = paramValue.replace(/\s/g, '');
          }
          params[paramName] = paramValue;
          break;
        case FilterType.SLIDER:
          /**
           * If the min or max param is equal to the lower/upper limit,
           * that param will be excluded from the final query to the API.
           * This effectively makes the counds inclusive (e.g volume 500 or more).
           */
          const isAtDomainLimit =
            paramValue === filter.props.domain[0] || paramValue === filter.props.domain[1];
          if (!isAtDomainLimit) {
            params[paramName] = paramValue;
          }
          break;
        default:
          if (filter.makeLowerCase && typeof paramValue === 'string') {
            paramValue = paramValue.toLowerCase();
          }
          params[paramName] = paramValue;
      }
    } else {
      params[paramName] = query[paramName];
    }
  }
  return params;
};

export const initSearchState = (
  defaultState: SearchState,
  propsWithoutChildren: SearchUIContainerProps,
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
