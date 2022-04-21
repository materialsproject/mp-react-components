import {
  crystalSystemOptions,
  formatPointGroup,
  pointGroupOptions,
  spaceGroupNumberOptions,
  spaceGroupSymbolOptions
} from '../../data-entry/utils';
import { ActiveFilter, Filter, FilterGroup, FilterType } from './types';
import { spaceGroups } from '../../../constants/spaceGroups';
import { MaterialsInputType } from '../../data-entry/MaterialsInput';
import { MaterialsInputTypesMap } from '../../data-entry/MaterialsInput/utils';
import {
  BooleanParam,
  decodeDelimitedArray,
  DecodedValueMap,
  encodeDelimitedArray,
  NumberParam,
  QueryParamConfig,
  QueryParamConfigMap,
  StringParam
} from 'use-query-params';

/**
 * Check whether a filter value is considered empty or not (i.e. active or inactive)
 */
export const isNotEmpty = (value: any) => {
  if (Array.isArray(value)) {
    return value.length > 0 ? true : false;
  } else {
    return value !== undefined && value !== null && value !== '';
  }
};

/**
 * Initialize filter groups to be usable within the search state.
 * This allows options to be programatically added for symmetry filters.
 * @param filterGroups array filter definitions nested by group
 * @returns new array of filter groups ready to use in the state
 */
export const initFilterGroups = (filterGroups: FilterGroup[]): FilterGroup[] => {
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

/**
 * Update the search state's active filters.
 * The activeFilters list is recomputed whenever a filter is modified in the UI.
 */
export const getActiveFilters = (
  filterGroups: FilterGroup[],
  query: DecodedValueMap<QueryParamConfigMap>
): ActiveFilter[] => {
  const activeFilters: ActiveFilter[] = [];
  filterGroups.forEach((g) => {
    g.filters.forEach((f) => {
      const af = {
        name: f.name,
        params: f.params,
        value: query[f.params[0]] || f.props?.defaultValue,
        isSearchBarField: f.isSearchBarField
      };
      switch (f.type) {
        case FilterType.SLIDER:
          const hasActiveMin = query[f.params[0]] > f.props.domain[0];
          const hasActiveMax = query[f.params[1]] < f.props.domain[1];

          if (hasActiveMin || hasActiveMax) {
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
              value: parsedValue
            });
          }
          break;
        case FilterType.SELECT_SPACEGROUP_SYMBOL:
          if (isNotEmpty(af.value)) {
            const spaceGroup = spaceGroups.find((d) => d['symbol'] === af.value);
            const formattedSymbol = spaceGroup ? spaceGroup['symbol_unicode'] : af.value;
            activeFilters.push({
              ...af,
              value: formattedSymbol
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
              value: displayValue
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
              value: displayValue
            });
          }
          break;
        default:
          if (isNotEmpty(af.value)) {
            activeFilters.push({ ...af });
          }
      }
    });
  });
  return activeFilters;
};

/**
 * Custom param type for array params that should show values
 * in the URL as a comma-separated array (e.g. sort_fields=density,volume).
 * test
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
      let paramValue = query[paramName] || filter.props?.defaultValue;
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
