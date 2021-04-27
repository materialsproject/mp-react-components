import { MaterialsInputField } from '../MaterialsInput';
import { SearchUIProps } from './SearchUI';

export enum FilterId {
  ELEMENTS = 'elements',
  VOLUME = 'volume',
  DENSITY = 'density',
  MP_ID = 'task_ids',
  FORMULA = 'formula',
  NELEMENTS = 'nelements',
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
  SELECT_POINTGROUP = 'SELECT_POINTGROUP',
  CHECKBOX_LIST = 'CHECKBOX_LIST',
}

export interface Filter {
  name?: string;
  id: string;
  type: FilterType;
  active?: boolean;
  conversionFactor?: number;
  units?: string;
  props?: any;
}

export interface FilterGroup {
  name: string;
  expanded?: boolean;
  alwaysExpanded?: boolean;
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
  conversionFactor?: number;
  searchParams?: SearchParam[];
}

export type FilterValues = Partial<Record<string, any>>;

export interface Column {
  name: string | number | JSX.Element;
  selector: string;
  units?: string;
  conversionFactor?: number;
  nameString?: string;
  abbreviateNearZero?: boolean;
  /** Hides column from table AND column selector but includes in data */
  hidden?: boolean;
  [id: string]: any;
}

export interface ConditionalRowStyle {
  selector: string;
  value: any;
  style: any;
  when?: (row: any) => any;
}

export interface SearchState extends SearchUIProps {
  filterValues: FilterValues;
  activeFilters: ActiveFilter[];
  results: any[];
  totalResults: number;
  resultsPerPage: number;
  page: number;
  loading: boolean;
  sortField?: string;
  sortAscending?: boolean;
  topLevelSearchField: MaterialsInputField;
  error: boolean;
  selectedRows?: any[];
}

export enum ColumnFormat {
  FIXED_DECIMAL = 'FIXED_DECIMAL', // formatArg: integer representing number of decimals to round to
  SIGNIFICANT_FIGURES = 'SIGNIFICANT_FIGURES', // formatArg: integer representing the number of significant figures
  FORMULA = 'FORMULA', // formatArg: none
  LINK = 'LINK', // formatArg: string to prefix column value in link (e.g. '/materials/')
  BOOLEAN = 'BOOLEAN', // formatArg: array with two items for display values, first item is for truthy, second item is for falsy (e.g. ['yes', 'no'])
  BOOLEAN_CLASS = 'BOOLEAN_CLASS', // formatArg: class name string to add to element within cell
  SPACEGROUP_SYMBOL = 'SPACEGROUP_SYMBOL',
  POINTGROUP = 'POINTGROUP',
}
