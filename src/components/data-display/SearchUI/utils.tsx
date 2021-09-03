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

const defaultMinSuffix = '_min';
const defaultMaxSuffix = '_max';
const emptyCellPlaceholder = '-';

/**
 * Get the corresponding value for a row object given a selector string.
 * Can select values from keys nested up to 3 levels.
 * @param selector string that corresponds to a key or nested group of keys (e.g. 'data.a.b.c') in an object.
 * @param row object that has the key(s) specified in selector
 */
const getRowValueFromSelectorString = (selector: string, row: any) => {
  const selectors = selector.split('.');
  switch (selectors.length) {
    case 1:
      return row[selectors[0]];
    case 2:
      return row[selectors[0]][selectors[1]];
    case 3:
      return row[selectors[0]][selectors[1]][selectors[2]];
    case 3:
      return row[selectors[0]][selectors[1]][selectors[2]][selectors[3]];
    default:
      return emptyCellPlaceholder;
  }
};

/**
 * Initialize columns with their proper format function
 * The "format" prop should initially be one of the ColumnFormat strings
 * which maps to one of the format (or cell) functions defined here.
 * FIXED_DECIMAL and SIGNIFICANT_FIGURES both expect another column property "formatArg"
 * that will specify how many decimals or figures to apply to the format.
 */
export const initColumns = (columns: Column[]): Column[] => {
  return columns.map((c) => {
    c.sortable = c.sortable !== undefined ? c.sortable : true;
    c.nameString = c.name.toString();
    c.name = (
      <div
        className={classNames({
          'column-header-right': c.right,
          'column-header-center': c.center,
          'column-header-left': !c.right && !c.center,
          'tooltip-label': c.tooltip
        })}
        data-tip={c.tooltip}
        data-for={c.selector}
      >
        <div>{c.hideName ? '' : c.name}</div>
        {c.units && <div className="column-units">({c.units})</div>}
        {c.tooltip && <Tooltip id={c.selector}>{c.tooltip}</Tooltip>}
      </div>
    );

    const hasFormatOptions = c.hasOwnProperty('formatOptions');

    switch (c.format) {
      case ColumnFormat.FIXED_DECIMAL:
        const decimalPlaces =
          hasFormatOptions && c.formatOptions.decimals ? c.formatOptions.decimals : 2;
        c.format = (row: any) => {
          const rowValue = getRowValueFromSelectorString(c.selector, row);
          const numValue = parseFloat(rowValue);
          const value = c.conversionFactor ? numValue * c.conversionFactor : numValue;
          const min = Math.pow(10, -decimalPlaces);
          if (value === 0) {
            return 0;
          }
          if (hasFormatOptions && c.formatOptions.abbreviateNearZero) {
            if (value >= min) {
              return value.toFixed(decimalPlaces);
            } else if (value < min) {
              return '< ' + min.toString();
            } else {
              return emptyCellPlaceholder;
            }
          } else {
            return isNaN(value) ? emptyCellPlaceholder : value.toFixed(decimalPlaces);
          }
        };
        c.right = true;
        return c;
      case ColumnFormat.SIGNIFICANT_FIGURES:
        const sigFigs = hasFormatOptions && c.formatOptions.sigFigs ? c.formatOptions.sigFigs : 5;
        c.format = (row: any) => {
          const rowValue = getRowValueFromSelectorString(c.selector, row);
          const numValue = parseFloat(rowValue);
          const value = c.conversionFactor ? numValue * c.conversionFactor : numValue;
          if (value === 0) {
            return 0;
          }
          return isNaN(value) ? emptyCellPlaceholder : value.toPrecision(sigFigs);
        };
        c.right = true;
        return c;
      case ColumnFormat.FORMULA:
        c.cell = (row: any) => {
          const rowValue = getRowValueFromSelectorString(c.selector, row);
          return <Formula>{rowValue}</Formula>;
        };
        return c;
      case ColumnFormat.LINK:
        c.cell = (row: any) => {
          const rowValue = getRowValueFromSelectorString(c.selector, row);
          const linkLabel =
            hasFormatOptions && c.formatOptions.linkLabelKey && rowValue
              ? row[c.formatOptions.linkLabelKey]
              : rowValue;
          const isFormula = hasFormatOptions && c.formatOptions.linkLabelisFormula;
          const url =
            hasFormatOptions && c.formatOptions.baseUrl && rowValue
              ? joinUrl(c.formatOptions.baseUrl, rowValue)
              : rowValue;

          return linkLabel && url ? (
            <Link
              href={url}
              onClick={(e) => e.stopPropagation()}
              target={hasFormatOptions && c.formatOptions.target}
            >
              {isFormula ? <Formula>{linkLabel}</Formula> : linkLabel}
            </Link>
          ) : (
            emptyCellPlaceholder
          );
        };
        return c;
      case ColumnFormat.BOOLEAN:
        var truthyLabel =
          hasFormatOptions && c.formatOptions.truthyLabel ? c.formatOptions.truthyLabel : 'true';
        var falsyLabel =
          hasFormatOptions && c.formatOptions.falsyLabel ? c.formatOptions.falsyLabel : 'false';
        c.format = (row: any) => {
          const rowValue = getRowValueFromSelectorString(c.selector, row);
          return rowValue ? truthyLabel : falsyLabel;
        };
        return c;
      case ColumnFormat.BOOLEAN_CLASS:
        var truthyClass =
          hasFormatOptions && c.formatOptions.truthyClass ? c.formatOptions.truthyClass : '';
        var falsyClass =
          hasFormatOptions && c.formatOptions.falsyClass ? c.formatOptions.falsyClass : '';
        c.cell = (row: any, i: number) => {
          const rowValue = getRowValueFromSelectorString(c.selector, row);
          return (
            <span
              className="boolean-cell-wrapper"
              data-for={`${c.selector}-${i}`}
              data-tip={c.cellTooltip}
            >
              <i
                className={classNames({
                  [truthyClass]: rowValue,
                  [falsyClass]: !rowValue
                })}
              ></i>
              {c.cellTooltip && <Tooltip id={`${c.selector}-${i}`}>{c.cellTooltip}</Tooltip>}
            </span>
          );
        };
        return c;
      case ColumnFormat.SPACEGROUP_SYMBOL:
        c.format = (row: any) => {
          const rowValue = getRowValueFromSelectorString(c.selector, row);
          const spaceGroup = spaceGroups.find((d) => d['symbol'] === rowValue);
          const formattedSymbol = spaceGroup ? spaceGroup['symbol_unicode'] : rowValue;
          return formattedSymbol;
        };
        return c;
      case ColumnFormat.POINTGROUP:
        c.cell = (row: any) => {
          const rowValue = getRowValueFromSelectorString(c.selector, row);
          return formatPointGroup(rowValue);
        };
        return c;
      case ColumnFormat.ARRAY:
        c.cell = (row: any) => {
          const rowValue = getRowValueFromSelectorString(c.selector, row);
          if (Array.isArray(rowValue)) {
            return (
              <ArrayChips
                chips={rowValue}
                chipTooltips={hasFormatOptions && row[c.formatOptions.arrayTooltipsKey]}
                chipLinks={hasFormatOptions && row[c.formatOptions.arrayLinksKey]}
                chipLinksTarget={hasFormatOptions && c.formatOptions.arrayLinksTarget}
                chipType={hasFormatOptions && c.formatOptions.arrayChipType}
                showDownloadIcon={hasFormatOptions && c.formatOptions.arrayLinksShowDownload}
              />
            );
          } else {
            return rowValue;
          }
        };
        return c;
      default:
        c.format = (row: any) => {
          const rowValue = getRowValueFromSelectorString(c.selector, row);
          const isNumber = !isNaN(rowValue);
          const value = c.conversionFactor && isNumber ? rowValue * c.conversionFactor : rowValue;
          if (value === 0) {
            return 0;
          }
          return value && value !== '' ? value : emptyCellPlaceholder;
        };
        return c;
    }
  });
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
      }

      switch (f.type) {
        case FilterType.SLIDER:
          const minSuffix = f.minSuffix || defaultMinSuffix;
          const maxSuffix = f.maxSuffix || defaultMaxSuffix;
          const queryParamMinString = query.get(f.id + minSuffix);
          const queryParamMaxString = query.get(f.id + maxSuffix);
          const queryParamMin = queryParamMinString ? parseFloat(queryParamMinString) : null;
          const queryParamMax = queryParamMaxString ? parseFloat(queryParamMaxString) : null;
          queryParamValue =
            queryParamMin !== null && queryParamMax !== null
              ? [queryParamMin, queryParamMax]
              : null;
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
      switch (f.type) {
        case FilterType.SLIDER:
          const hasActiveMin = filterValues[f.id][0] !== f.props.domain[0];
          const hasActiveMax = filterValues[f.id][1] !== f.props.domain[1];
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
            const operatorSuffix = f.operatorSuffix || '';
            let parsedValue = filterValues[f.id];
            let filterDisplayName = f.name.toLowerCase();

            if (
              (f.props.inputType === MaterialsInputType.ELEMENTS &&
                f.id === 'elements' &&
                (f.props.isChemSys || filterValues[f.id].indexOf('-') > -1)) ||
              (f.props.inputType === MaterialsInputType.FORMULA &&
                filterValues[f.id].indexOf('-') > -1)
            ) {
              /** Adjust filter display name when chemsys strings are used in the elements or formula fields */
              filterDisplayName = 'include only elements';
              /** Remove trailing '-' from chemical system string */
              parsedValue = filterValues[f.id].replace(/\-$/, '');
            } else if (f.props.inputType === MaterialsInputType.ELEMENTS) {
              /** Parse elements back into array so that they're in a normalized format for the query */
              parsedValue = validateElements(filterValues[f.id]);
            }

            activeFilters.push({
              id: f.id,
              displayName: filterDisplayName,
              value: parsedValue,
              defaultValue: '',
              searchParams: [
                {
                  field: f.id + operatorSuffix,
                  value: parsedValue
                }
              ]
            });
          }
          break;
        case FilterType.SELECT_SPACEGROUP_SYMBOL:
          if (
            filterValues[f.id] !== undefined &&
            filterValues[f.id] !== null &&
            filterValues[f.id] !== ''
          ) {
            const spaceGroup = spaceGroups.find((d) => d['symbol'] === filterValues[f.id]);
            const formattedSymbol = spaceGroup ? spaceGroup['symbol_unicode'] : filterValues[f.id];
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
        case FilterType.SELECT:
        case FilterType.THREE_STATE_BOOLEAN_SELECT:
          if (
            filterValues[f.id] !== undefined &&
            filterValues[f.id] !== null &&
            filterValues[f.id] !== ''
          ) {
            const selectedOption = f.props.options.find((d) => d.value === filterValues[f.id]);
            const displayValue = selectedOption ? selectedOption.label : filterValues[f.id];
            activeFilters.push({
              id: f.id,
              displayName: f.name ? f.name : f.id,
              value: displayValue,
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
        case FilterType.TEXT_INPUT:
          if (
            filterValues[f.id] !== undefined &&
            filterValues[f.id] !== null &&
            filterValues[f.id] !== ''
          ) {
            const operatorSuffix = f.operatorSuffix || '';
            activeFilters.push({
              id: f.id,
              displayName: f.name ? f.name : f.id,
              value: filterValues[f.id],
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
          }
      }
    });
  });
  return { ...currentState, filterValues, activeFilters };
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
  initialState.columns = initColumns(propsWithoutChildren.columns);
  const { initializedGroups, initializedValues } = initFilterGroups(
    propsWithoutChildren.filterGroups,
    query
  );

  if (
    isDesktop &&
    (initializedValues['elements'] ||
      initializedValues['formula'] ||
      initializedValues['task_ids'] ||
      initializedValues['material_ids'])
  ) {
    initializedGroups[0].expanded = true;
  }

  initialState.filterGroups = initializedGroups;
  initialState.filterValues = initializedValues;

  const urlLimit = query.get('limit');
  const urlSkip = query.get('skip');
  const urlSortField = query.get('sort_field');
  const urlAscending = query.get('ascending');

  if (urlLimit) initialState.resultsPerPage = parseInt(urlLimit);
  if (urlSkip) initialState.page = parseInt(urlSkip) / initialState.resultsPerPage + 1;
  if (urlSortField) initialState.sortField = urlSortField;
  if (urlAscending) initialState.sortAscending = urlAscending === 'true' ? true : false;

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
