import { ElementsInputType } from '~/components/search/ElementsInput';

export enum FilterId {
  ELEMENTS = 'elements',
  VOLUME = 'volume',
  DENSITY = 'density'
}

export enum FilterType {
  SLIDER = 'SLIDER',
  ELEMENTS_INPUT = 'ELEMENTS_INPUT'
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
  TWO_DECIMALS = 'TWO_DECIMALS'
}

export const initColumns = (columns: Column[]) => {
  return columns.map(c => {
    switch (c.format) {
      case ColumnFormat.TWO_DECIMALS:
        c.format = (row: any) => row[c.selector].toFixed(2);
        return c;
      default:
        return c;
    }
  });
};

export const materialsGroups: FilterGroup[] = [
  {
    name: 'Elements',
    collapsed: false,
    filters: [
      {
        name: 'Elements',
        id: FilterId.ELEMENTS,
        type: FilterType.ELEMENTS_INPUT,
        props: {
          parsedValue: [],
          type: ElementsInputType.ELEMENTS,
          delimiter: ','
        }
      }
    ]
  },
  {
    name: 'General',
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
    format: 'test'
  },
  {
    name: 'Volume',
    selector: 'volume',
    sortable: true,
    format: ColumnFormat.TWO_DECIMALS
  },
  {
    name: 'Density',
    selector: 'density',
    sortable: true,
    format: ColumnFormat.TWO_DECIMALS
  }
];
