import React from 'react';
import { MaterialsInputField } from '../MaterialsInput';
import { Link } from '../../navigation/Link';
import { crystalSystemOptions, spaceGroupNumberOptions, spaceGroupSymbolOptions } from '../GroupSpaceSearch/space-groups'

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
  collapsed: boolean;
  filters: Filter[];
}

export interface SearchParam {
  field: string;
  value: any;
}

export interface ActiveFilter {
  id: string;
  displayName?: string;
  value: any;
  defaultValue: any;
  searchParams?: SearchParam[];
}

export type FilterValues = Partial<Record<FilterId, any>>;

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
  sortColumn: FilterId;
  sortDirection: 'asc' | 'desc';
}

enum ColumnFormat {
  FIXED_DECIMAL = 'FIXED_DECIMAL', // formatArg: integer representing number of decimals to round to
  SIGNIFICANT_FIGURES = 'SIGNIFICANT_FIGURES', // formatArg: integer representing the number of significant figures
  FORMULA = 'FORMULA', // formatArg: none
  LINK = 'LINK' // formatArg: string to prefix column value in link (e.g. '/materials/')
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
      default:
        return c;
    }
  });
};

export const materialsGroups: FilterGroup[] = [
  {
    name: 'Material',
    collapsed: false,
    filters: [
      {
        name: 'ID',
        id: FilterId.MP_ID,
        type: FilterType.TEXT_INPUT
      },
      {
        name: 'Required Elements',
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
    collapsed: true,
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
    collapsed: true,
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
    collapsed: true,
    filters: [
      {
        name: 'Spacegroup Symbol',
        id: 'spacegroup_symbol',
        type: FilterType.SELECT,
        props: {
          options: spaceGroupSymbolOptions()
        }
      },
      {
        name: 'Spacegroup Number',
        id: 'spacegroup_number',
        type: FilterType.SELECT,
        props: {
          options: spaceGroupNumberOptions()
        }
      },
      {
        name: 'Crystal System',
        id: 'crystal_system',
        type: FilterType.SELECT,
        props: {
          options: crystalSystemOptions()
        }
      }
    ]
  },
  {
    name: 'Electronic Structure',
    collapsed: true,
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
    formatArg: 3
  },
  {
    name: 'Density',
    selector: 'density',
    format: ColumnFormat.SIGNIFICANT_FIGURES,
    formatArg: 4
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
    formatArg: 4
  },
  {
    name: 'Is Stable',
    selector: 'is_stable'
  },
  {
    name: 'Spacegroup Symbol',
    selector: 'symmetry.symbol'
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
