import React from 'react';
import { MaterialsInputField } from '../MaterialsInput';
import { Link } from '../../navigation/Link';

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
  TEXT_INPUT = 'TEXT_INPUT'
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
          domain: [0, 100],
          step: 1
        }
      },
      {
        name: 'Density',
        id: FilterId.DENSITY,
        type: FilterType.SLIDER,
        props: {
          domain: [0, 100],
          step: 1
        }
      },
      {
        name: 'Number of Sites',
        id: 'nsites',
        type: FilterType.SLIDER,
        props: {
          domain: [0, 100],
          step: 1
        }
      }
    ]
  },
  {
    name: 'Thermodynamics',
    collapsed: false,
    filters: [
      {
        name: 'e_above_hull',
        id: 'e_above_hull',
        type: FilterType.SLIDER
      },
      {
        name: 'formation_energy_per_atom',
        id: 'formation_energy_per_atom',
        type: FilterType.SLIDER
      },
      {
        name: 'is_stable',
        id: 'is_stable',
        type: FilterType.SLIDER
      }
    ]
  },
  {
    name: 'Symmetry',
    collapsed: false,
    filters: [
      {
        name: 'spacegroup_symbol',
        id: 'spacegroup_symbol',
        type: FilterType.SLIDER
      },
      {
        name: 'spacegroup_number',
        id: 'spacegroup_number',
        type: FilterType.SLIDER
      },
      {
        name: 'Crystal System',
        id: 'crystal_system',
        type: FilterType.SLIDER
      }
    ]
  },
  {
    name: 'Electronic Structure',
    collapsed: false,
    filters: [  
      {
        name: 'sc_band_gap',
        id: 'sc_band_gap',
        type: FilterType.SLIDER
      },
      {
        name: 'sc_direct',
        id: 'sc_direct',
        type: FilterType.SLIDER
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
  }
];
