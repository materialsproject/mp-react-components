import React from 'react';
import { MaterialsInputField } from '../MaterialsInput';
import { Link } from '../../navigation/Link';
import { crystalSystemOptions, spaceGroupNumberOptions, spaceGroupSymbolOptions } from '../utils';
import { spaceGroups } from '../GroupSpaceSearch/spacegroups';

export enum FilterId {
  ELEMENTS = 'elements',
  VOLUME = 'volume',
  DENSITY = 'density',
  MP_ID = 'task_ids',
  FORMULA = 'formula',
  NELEMENTS = 'nelements'
}

export enum FilterType {
  SLIDER = 'SLIDER',
  MATERIALS_INPUT = 'MATERIALS_INPUT',
  TEXT_INPUT = 'TEXT_INPUT',
  SELECT = 'SELECT',
  THREE_STATE_BOOLEAN_SELECT = 'THREE_STATE_BOOLEAN_SELECT',
  SELECT_SPACEGROUP_SYMBOL = 'SELECT_SPACEGROUP_SYMBOL',
  SELECT_SPACEGROUP_NUMBER = 'SELECT_SPACEGROUP_NUMBER',
  SELECT_CRYSTAL_SYSTEM = 'SELECT_CRYSTAL_SYSTEM',
  CHECKBOX_LIST = 'CHECKBOX_LIST'
}

export interface Filter {
  name?: string;
  id: string;
  type: FilterType;
  props?: any;
}

export interface FilterGroup {
  name: string;
  expanded: boolean;
  filters: Filter[];
}

export interface SearchParam {
  field: string;
  value: any;
}

export interface ActiveFilter {
  id: string;
  displayName: string;
  value: any;
  defaultValue: any;
  searchParams?: SearchParam[];
}

export type FilterValues = Partial<Record<string, any>>;

export interface Column {
  name: string;
  selector: string;
  [id: string]: any;
}

export interface SearchState {
  columns: Column[];
  filterGroups: FilterGroup[];
  filterValues: FilterValues;
  activeFilters: ActiveFilter[];
  results: any[];
  totalResults: number;
  resultsPerPage: number;
  page: number;
  loading: boolean;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  topLevelSearchField: string;
  autocompleteFormulaUrl?: string;
  apiKey?: string;
}

enum ColumnFormat {
  FIXED_DECIMAL = 'FIXED_DECIMAL', // formatArg: integer representing number of decimals to round to
  SIGNIFICANT_FIGURES = 'SIGNIFICANT_FIGURES', // formatArg: integer representing the number of significant figures
  FORMULA = 'FORMULA', // formatArg: none
  LINK = 'LINK', // formatArg: string to prefix column value in link (e.g. '/materials/')
  BOOLEAN = 'BOOLEAN',
  SPACEGROUP_SYMBOL = 'SPACEGROUP_SYMBOL'
}

/**
 * Initialize columns with their proper format function
 * The "format" prop should initially be one of the ColumnFormat strings
 * which maps to one of the format (or cell) functions defined here.
 * FIXED_DECIMAL and SIGNIFICANT_FIGURES both expect another column property "formatArg"
 * that will specify how many decimals or figures to apply to the format.
 */
export const initColumns = (columns: Column[]) => {
  return columns.map(c => {
    c.sortable = c.sortable !== undefined ? c.sortable : true;
    switch (c.format) {
      case ColumnFormat.FIXED_DECIMAL:
        const decimalPlaces = c.formatArg ? c.formatArg : 2;
        c.format = (row: any) => row[c.selector].toFixed(decimalPlaces);
        return c;
      case ColumnFormat.SIGNIFICANT_FIGURES:
        const sigFigs = c.formatArg ? c.formatArg : 5;
        c.format = (row: any) => row[c.selector].toPrecision(sigFigs);
        return c;
      case ColumnFormat.FORMULA:
        c.cell = (row: any) => {
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

export const initFilterGroups = (filterGroups: FilterGroup[], query: URLSearchParams) => {
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

export const materialsGroups: FilterGroup[] = [
  {
    name: 'Material',
    expanded: false,
    filters: [
      {
        name: 'ID',
        id: FilterId.MP_ID,
        type: FilterType.TEXT_INPUT
      },
      {
        name: 'Elements',
        id: FilterId.ELEMENTS,
        type: FilterType.MATERIALS_INPUT,
        props: {
          field: MaterialsInputField.ELEMENTS
        }
      },
      {
        name: 'Formula',
        id: FilterId.FORMULA,
        type: FilterType.MATERIALS_INPUT,
        props: {
          field: MaterialsInputField.FORMULA
        }
      }
    ]
  },
  {
    name: 'Basic Properties',
    expanded: false,
    filters: [
      {
        name: 'Volume',
        id: FilterId.VOLUME,
        type: FilterType.SLIDER,
        props: {
          domain: [5, 19407],
          step: 1
        }
      },
      {
        name: 'Density',
        id: FilterId.DENSITY,
        type: FilterType.SLIDER,
        props: {
          domain: [0, 25],
          step: 0.1
        }
      },
      {
        name: 'Number of Sites',
        id: 'nsites',
        type: FilterType.SLIDER,
        props: {
          domain: [1, 360],
          step: 1
        }
      }
    ]
  },
  {
    name: 'Thermodynamics',
    expanded: false,
    filters: [
      {
        name: 'Energy Above Hull',
        id: 'e_above_hull',
        type: FilterType.SLIDER,
        props: {
          domain: [0, 7],
          step: 0.1
        }
      },
      {
        name: 'Formation Energy',
        id: 'formation_energy_per_atom',
        type: FilterType.SLIDER,
        props: {
          domain: [-10, 6],
          step: 0.1
        }
      },
      {
        name: 'Stability',
        id: 'is_stable',
        type: FilterType.THREE_STATE_BOOLEAN_SELECT,
        props: {
          options: [
            {
              label: 'Is stable',
              value: true
            },
            {
              label: 'Is not stable',
              value: false
            }
          ]
        }
      }
    ]
  },
  {
    name: 'Symmetry',
    expanded: false,
    filters: [
      {
        name: 'Spacegroup Symbol',
        id: 'spacegroup_symbol',
        type: FilterType.SELECT_SPACEGROUP_SYMBOL
      },
      {
        name: 'Spacegroup Number',
        id: 'spacegroup_number',
        type: FilterType.SELECT_SPACEGROUP_NUMBER
      },
      {
        name: 'Crystal System',
        id: 'crystal_system',
        type: FilterType.SELECT_CRYSTAL_SYSTEM
      }
    ]
  },
  {
    name: 'Electronic Structure',
    expanded: false,
    filters: [  
      {
        name: 'Band Gap',
        id: 'sc_band_gap',
        type: FilterType.SLIDER,
        props: {
          domain: [0, 100],
          step: 1
        }
      },
      {
        name: 'Direct Band Gap',
        id: 'sc_direct',
        type: FilterType.THREE_STATE_BOOLEAN_SELECT,
        props: {
          options: [
            {
              label: 'Is direct',
              value: true
            },
            {
              label: 'Is not direct',
              value: false
            }
          ]
        }
      }
    ]
  }
];

export const materialsColumns: Column[] = [
  {
    name: 'Material Id',
    selector: 'task_id',
    format: ColumnFormat.LINK,
    formatArg: '/materials/'
  },
  {
    name: 'Formula',
    selector: 'formula_pretty',
    format: ColumnFormat.FORMULA
  },
  {
    name: 'Volume',
    selector: 'volume',
    format: ColumnFormat.FIXED_DECIMAL,
    formatArg: 3,
    omit: true
  },
  {
    name: 'Density',
    selector: 'density',
    format: ColumnFormat.SIGNIFICANT_FIGURES,
    formatArg: 4,
    omit: true
  },
  {
    name: 'Sites',
    selector: 'nsites'
  },
  {
    name: 'Energy Above Hull',
    selector: 'e_above_hull',
    format: ColumnFormat.SIGNIFICANT_FIGURES,
    formatArg: 4
  },
  {
    name: 'Formation Energy',
    selector: 'formation_energy_per_atom',
    format: ColumnFormat.SIGNIFICANT_FIGURES,
    formatArg: 4,
    omit: true
  },
  {
    name: 'Is Stable',
    selector: 'is_stable',
    format: ColumnFormat.BOOLEAN,
    formatArg: ['yes', 'no'],
    omit: true
  },
  {
    name: 'Spacegroup Symbol',
    selector: 'symmetry.symbol',
    format: ColumnFormat.SPACEGROUP_SYMBOL
  },
  {
    name: 'Spacegroup Number',
    selector: 'symmetry.number'
  },
  {
    name: 'Crystal System',
    selector: 'symmetry.crystal_system'
  }
];
