import React from 'react';
import { MaterialsInputField } from '../../search/MaterialsInput';

export enum FilterId {
  ELEMENTS = 'elements',
  VOLUME = 'volume',
  DENSITY = 'density',
  MP_ID = 'task_ids',
  FORMULA = 'formula'
}

export enum FilterType {
  SLIDER = 'SLIDER',
  MATERIALS_INPUT = 'MATERIALS_INPUT',
  TEXT_INPUT = 'TEXT_INPUT'
}

export interface Filter {
  name: string;
  id: FilterId;
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
}

enum ColumnFormat {
  FIXED_DECIMAL = 'FIXED_DECIMAL',
  SIGNIFICANT_FIGURES = 'SIGNIFICANT_FIGURES',
  FORMULA = 'FORMULA'
}

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
          parsedValue: [],
          field: MaterialsInputField.ELEMENTS
        }
      },
      {
        name: 'Formula',
        id: FilterId.FORMULA,
        type: FilterType.MATERIALS_INPUT,
        props: {
          parsedValue: [],
          field: MaterialsInputField.FORMULA
        }
      }
    ]
  },
  {
    name: 'Properties',
    collapsed: false,
    filters: [
      {
        name: 'Volume',
        id: FilterId.VOLUME,
        type: FilterType.SLIDER,
        props: {
          domain: [0, 200]
        }
      },
      {
        name: 'Density',
        id: FilterId.DENSITY,
        type: FilterType.SLIDER,
        props: {
          domain: [0, 200]
        }
      }
    ]
  }
];

export const materialsColumns: Column[] = [
  {
    name: 'Material Id',
    selector: 'task_id',
    sortable: true
  },
  {
    name: 'Formula',
    selector: 'formula_pretty',
    sortable: true,
    format: ColumnFormat.FORMULA
  },
  {
    name: 'Volume',
    selector: 'volume',
    sortable: true,
    format: ColumnFormat.FIXED_DECIMAL,
    formatArg: 3
  },
  {
    name: 'Density',
    selector: 'density',
    sortable: true,
    format: ColumnFormat.SIGNIFICANT_FIGURES,
    formatArg: 4
  }
];
