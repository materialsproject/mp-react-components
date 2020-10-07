import { ElementsInputType } from './ElementsInput/ElementsInput';

export enum FilterId {
  ELEMENTS = 'elements',
  VOLUME = 'volume',
  DENSITY = 'density'
}

export enum FilterType {
  SLIDER,
  ELEMENTS_INPUT
}

interface Filter {
  name: string;
  id: FilterId;
  type: FilterType;
  props?: any;
}

export type FilterValues = Partial<Record<FilterId, any>>;

export interface SearchParam {
  field: string;
  value: any;
}

export interface SearchState {
  groups: any[];
  values: FilterValues;
  searchParams: SearchParam[];
  activeFilters: any;
  results: any[];
  totalResults: number;
  resultsPerPage: number;
  page: number;
  loading: boolean;
}

export const materialsGroups = [
  {
    name: 'Elements',
    collapsed: false,
    filters: [
      {
        name: 'Elements',
        id: FilterId.ELEMENTS,
        type: FilterType.ELEMENTS_INPUT,
        hasParsedValue: true,
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
        decimalPlaces: 2,
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
