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

interface Filter {
  name: string;
  id: FilterId;
  type: FilterType;
  props?: any;
}

interface FilterGroup {
  name: string;
  collapsed: boolean;
  filters: Filter[];
}

export type FilterValues = Partial<Record<FilterId, any>>;

export interface SearchParam {
  field: string;
  value: any;
}

export interface SearchState {
  filterGroups: FilterGroup[];
  filterValues: FilterValues;
  searchParams: SearchParam[];
  activeFilters: any;
  results: any[];
  totalResults: number;
  resultsPerPage: number;
  page: number;
  loading: boolean;
}

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
          domain: [0, 200],
          decimalPlaces: 2
        }
      }
    ]
  }
];

export const materialsValues = {
  volume: [0, 200],
  density: [0, 200],
  elements: ''
};

export const materialsColumns = [
  {
    name: 'Material Id',
    selector: 'task_id',
    sortable: true
  },
  {
    name: 'Formula',
    selector: 'formula_pretty',
    sortable: true
  },
  {
    name: 'Volume',
    selector: 'volume',
    sortable: true,
    format: (row: any) => row.volume.toFixed(2)
  },
  {
    name: 'Density',
    selector: 'density',
    sortable: true,
    format: (row: any) => row.density.toFixed(2)
  }
];
