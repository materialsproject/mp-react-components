import React from 'react';
import classNames from 'classnames';
import {
  arrayToDelimitedString,
  crystalSystemOptions,
  formatFormula,
  formatPointGroup,
  pointGroupOptions,
  spaceGroupNumberOptions,
  spaceGroupSymbolOptions,
} from '../utils';
import { ActiveFilter, Column, ColumnFormat, FilterGroup, FilterType, SearchState } from './types';
import { Link } from '../../navigation/Link';
import { spaceGroups } from '../../../constants/spaceGroups';
import { MaterialsInputField } from '../MaterialsInput';
import { validateElements } from '../MaterialsInput/utils';
import { useMediaQuery } from 'react-responsive';
import { SearchUIProps } from '.';

const getRowValueFromSelectorString = (selector: string, row: any) => {
  const selectors = selector.split('.');
  return selectors.length === 1 ? row[selectors[0]] : row[selectors[0]][selectors[1]];
};

const emptyCellPlaceholder = '-';

/**
 * Initialize columns with their proper format function
 * The "format" prop should initially be one of the ColumnFormat strings
 * which maps to one of the format (or cell) functions defined here.
 * FIXED_DECIMAL and SIGNIFICANT_FIGURES both expect another column property "formatArg"
 * that will specify how many decimals or figures to apply to the format.
 */
const initColumns = (columns: Column[]) => {
  return columns.map((c) => {
    c.sortable = c.sortable !== undefined ? c.sortable : true;
    c.nameString = c.name.toString();
    c.name = (
      <div
        className={classNames({
          'column-header-right': c.right,
          'column-header-center': c.center,
          'column-header-left': !c.right && !c.center,
        })}
      >
        <div>{c.name}</div>
        {c.units && <div className="column-units">({c.units})</div>}
      </div>
    );
    switch (c.format) {
      case ColumnFormat.FIXED_DECIMAL:
        const decimalPlaces = c.formatArg ? c.formatArg : 2;
        c.format = (row: any) => {
          const rowValue = getRowValueFromSelectorString(c.selector, row);
          const numValue = parseFloat(rowValue);
          const value = c.conversionFactor ? numValue * c.conversionFactor : numValue;
          const min = Math.pow(10, -decimalPlaces);
          if (c.abbreviateNearZero) {
            if (value === 0 || value >= min) {
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
        const sigFigs = c.formatArg ? c.formatArg : 5;
        c.format = (row: any) => {
          const rowValue = getRowValueFromSelectorString(c.selector, row);
          const numValue = parseFloat(rowValue);
          const value = c.conversionFactor ? numValue * c.conversionFactor : numValue;
          return isNaN(value) ? emptyCellPlaceholder : value.toPrecision(sigFigs);
        };
        c.right = true;
        return c;
      case ColumnFormat.FORMULA:
        c.cell = (row: any) => {
          const rowValue = getRowValueFromSelectorString(c.selector, row);
          return formatFormula(rowValue);
        };
        return c;
      case ColumnFormat.LINK:
        c.cell = (row: any) => {
          const rowValue = getRowValueFromSelectorString(c.selector, row) + '/';
          const path = c.formatArg ? c.formatArg + rowValue : rowValue;
          return <Link href={path}>{row[c.selector]}</Link>;
        };
        return c;
      case ColumnFormat.BOOLEAN:
        const hasCustomLabels = c.formatArg && Array.isArray(c.formatArg);
        const truthyLabel = hasCustomLabels ? c.formatArg[0] : 'true';
        const falsyLabel = hasCustomLabels ? c.formatArg[1] : 'false';
        c.format = (row: any) => {
          const rowValue = getRowValueFromSelectorString(c.selector, row);
          return rowValue ? truthyLabel : falsyLabel;
        };
        return c;
      case ColumnFormat.BOOLEAN_CLASS:
        c.cell = (row: any) => {
          const rowValue = getRowValueFromSelectorString(c.selector, row);
          return <i className={rowValue ? c.formatArg : ''}></i>;
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
      default:
        c.format = (row: any) => {
          const rowValue = getRowValueFromSelectorString(c.selector, row);
          const isNumber = !isNaN(rowValue);
          const value = c.conversionFactor && isNumber ? rowValue * c.conversionFactor : rowValue;
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
            },
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
          if (
            filterValues[f.id][0] !== f.props.domain[0] ||
            filterValues[f.id][1] !== f.props.domain[1]
          ) {
            activeFilters.push({
              id: f.id,
              displayName: f.name ? f.name : f.id,
              value: filterValues[f.id],
              defaultValue: f.props.domain,
              conversionFactor: f.conversionFactor,
              searchParams: [
                {
                  field: f.id + '_min',
                  value: filterValues[f.id][0],
                },
                {
                  field: f.id + '_max',
                  value: filterValues[f.id][1],
                },
              ],
            });
          }
          break;
        case FilterType.MATERIALS_INPUT:
          if (filterValues[f.id] !== '') {
            let parsedValue: any;
            let filterDisplayName: string;

            switch (f.props.field) {
              case MaterialsInputField.MP_ID:
                parsedValue = filterValues[f.id];
                filterDisplayName = currentState.resultLabel + ' ID';
                break;
              case MaterialsInputField.ELEMENTS:
                if (f.props.isChemSys || filterValues[f.id].indexOf('-') > -1) {
                  /** Chemical system values need to be parsed as a chemsys string (e.g. "Fe-Co-Si") so the API can recognize them */
                  parsedValue = arrayToDelimitedString(filterValues[f.id], new RegExp('-'));
                  filterDisplayName = 'includes only elements';
                } else {
                  /** Parse elements back into array so that they're in a normalized format for the query */
                  parsedValue = validateElements(filterValues[f.id]);
                  filterDisplayName = 'includes elements';
                }
                break;
              case MaterialsInputField.EXCLUDE_ELEMENTS:
                /** Parse elements back into array so that they're in a normalized format for the query */
                parsedValue = validateElements(filterValues[f.id]);
                filterDisplayName = 'excludes elements';
                break;
              default:
                parsedValue = filterValues[f.id];
                filterDisplayName = f.props.field;
            }

            activeFilters.push({
              id: f.id,
              displayName: filterDisplayName,
              value: parsedValue,
              defaultValue: '',
              searchParams: [
                {
                  field: f.props.field,
                  value: parsedValue,
                },
              ],
            });

            /** Expand the Material filter group by default if one of the main filters are active (desktop only) */
            // if (isDesktop && (f.id === 'elements' || f.id === 'formula' || f.id === 'task_ids')) {
            //   g.expanded = true;
            // }
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
                  value: filterValues[f.id],
                },
              ],
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
                  value: filterValues[f.id],
                },
              ],
            });

            /** Expand the Material filter group by default if one of the main filters are active (desktop only) */
            if (f.id === 'elements' || f.id === 'formula' || f.id === 'task_ids') {
              g.expanded = true;
            }
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
    (initializedValues['elements'] || initializedValues['formula'] || initializedValues['task_ids'])
  ) {
    initializedGroups[0].expanded = true;
  }

  initialState.filterGroups = initializedGroups;
  initialState.filterValues = initializedValues;

  const urlLimit = query.get('limit');
  const urlSkip = query.get('skip');
  const urlSortField = query.get('field');
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
    activeFilters,
  };
};