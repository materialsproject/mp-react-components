import { MaterialsInputType } from '../../data-entry/MaterialsInput';
import { SearchUIProps } from './SearchUI';
import { SearchUIDataCards } from './SearchUIDataCards';
import { SearchUIDataTable } from './SearchUIDataTable';
import { SearchUISynthesisRecipeCards } from './SearchUISynthesisRecipeCards';

export enum FilterId {
  ELEMENTS = 'elements',
  VOLUME = 'volume',
  DENSITY = 'density',
  MP_ID = 'task_ids',
  FORMULA = 'formula',
  NELEMENTS = 'nelements'
}

/**
 * See storybook for documentation
 */
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
  CHECKBOX_LIST = 'CHECKBOX_LIST'
}

export interface Filter {
  /**
   * Name of the filter that will be rendered above its input component
   */
  name: string;
  /**
   * Exact and unique name of the parameter in the API that this filter should query.
   * If the parameter has a suffix such as "_min" or "__exact", the id should be the
   * name of the parameter without the suffix.
   */
  id: string;
  /**
   * The type of filter component to use. Must be one of the pre-determined filter type strings
   * which maps to a component. See `FilterType` documentation for more information.
   */
  type: FilterType;
  /**
   * Whether this filter is active or not. This is handled by the `SearchUI` dynamically so
   * should generally not be used in configuration.
   */
  active?: boolean;
  /**
   * Number by which to multiply the filter value by before it is added to the API query.
   */
  conversionFactor?: number;
  /**
   * Units used in this filter. Can be a unicode string.
   */
  units?: string;
  /**
   * An object of filter options that is dependent on the filter type used.
   * See `FilterType` documentation for more information about which props can be used
   * for specific filter types.
   */
  props?: any;
  /**
   * Tooltip to display when hovering over the filter name
   */
  tooltip?: string;
  /**
   * Suffix to append to the id for the lower bound
   * of a slider filter (`SearchUI` defaults to "_min").
   */
  minSuffix?: string;
  /**
   * Suffix to append to the id for the upper bound
   * of a slider filter (`SearchUI` defaults to "_max").
   */
  maxSuffix?: string;
  /**
   * Suffix to append to the id for a `TEXT_INPUT` or `MATERIALS_INPUT` filter.
   * This enables you to use different operators like
   * "\__contains" or "\__exact"
   */
  operatorSuffix?: string;
  /**
   * List of filter ids that this filter should override (turn off) when activated.
   * Filter ids listed here must exist in the filterGroups json.
   */
  overrides?: string[];
  /**
   * Set to true to force filter input values to be lowercased before added to the query.
   * This should be used in situations where the filter input make contain an uppercase letter,
   * but the values on the backend are all lowercase.
   */
  makeLowerCase?: boolean;
}

export interface FilterGroup {
  /**
   * Name of the group that will be rendered in the panel
   */
  name: string;
  /**
   * If true, the filter group will be expanded on load
   */
  expanded?: boolean;
  /**
   * If true, the filter group will not be collapsible
   */
  alwaysExpanded?: boolean;
  /**
   * List of filters to render inside of the filter group
   */
  filters: Filter[];
}

export interface SearchParam {
  field: string;
  value: any;
}

export interface SearchParams {
  [id: string]: any;
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

/**
 * See storybook for documentation
 */
export enum ColumnFormat {
  FIXED_DECIMAL = 'FIXED_DECIMAL',
  SIGNIFICANT_FIGURES = 'SIGNIFICANT_FIGURES',
  FORMULA = 'FORMULA',
  LINK = 'LINK',
  BOOLEAN = 'BOOLEAN',
  BOOLEAN_CLASS = 'BOOLEAN_CLASS',
  SPACEGROUP_SYMBOL = 'SPACEGROUP_SYMBOL',
  POINTGROUP = 'POINTGROUP',
  ARRAY = 'ARRAY'
}

/**
 * Options for columns that are passed through `initColumns()`.
 */
export interface Column {
  /**
   * Human readable title to display with the column
   */
  title: string | number;
  /**
   * Name of the property that this column should pull its value from
   */
  selector: string;
  /**
   * A specified format type that will run the values in this column
   * through the corresponding format function.
   */
  formatType?: ColumnFormat;
  /**
   * Object of extra options that are used in conjunction with the formatType.
   * The properties that you can supply to formatOptions are specific to each
   * formatType. See `ColumnFormat` documentation for more information.
   */
  formatOptions?: any;
  /**
   * Units string to display underneath the column title.
   */
  units?: string;
  /**
   * Number by which to multiply all values in the column by.
   */
  conversionFactor?: number;
  /**
   * If true, the minimum displayable value will be determined by the number of decimals
   * set in `formatOptions`. For example, if `decimals` is `2` then the minimum displayable
   * value will be `0.01` and all values less than that will display as `< 0.01`.
   */
  abbreviateNearZero?: boolean;
  /**
   * If true, column is hidden from table and column selector but is included in data
   */
  hidden?: boolean;
  /**
   * If true, column is hidden from table but is selectable from the column selector
   */
  omit?: boolean;
  /**
   * Column is visible in top section of `DataBlock` and hidden from bottom (`DataBlock` only)
   */
  isTop?: boolean;
  /**
   * Column is visible in bottom section of `DataBlock` and hidden from top (`DataBlock` only)
   */
  isBottom?: boolean;
  /**
   * Fixed width for the column with units e.g. `"100px"`
   */
  width?: string;
  /**
   * Minimum width for the column with units e.g. `"100px"`
   */
  minWidth?: string;
  /**
   * Maximum width for the column with units e.g. `"100px"`
   */
  maxWidth?: string;
  /**
   * Tooltip string to show on column title hover
   */
  tooltip?: string;
  /**
   * Right align the column
   */
  right?: boolean;
  /**
   * Center align the column
   */
  center?: boolean;
  /**
   * Set whether you can sort by column. Defaults to `true`.
   */
  sortable?: boolean;
  /**
   * Allows you to customize the css of the cell using css-in-js style objects
   */
  style?: any;
  [id: string]: any;
}

/**
 * Object to specifiy conditional row styles for a DataTable or SearchUI component
 */
export interface ConditionalRowStyle {
  /**
   * Name of the data property to use for the condition
   */
  selector: string;
  /**
   * Value that meets the condition
   */
  value: any;
  /**
   * object of styles supplied in "CSS-in-JS" format
   */
  style: any;
  /**
   * Condition function to determine if row should have the specified styles.
   * NOT USED for `SearchUI` component.
   * The `SearchUI` component will style the row if the row's selector field equals the specified value.
   */
  when?: (row: any) => any;
}

export interface SearchState extends SearchUIProps {
  filterValues: FilterValues;
  activeFilters: ActiveFilter[];
  totalResults: number;
  resultsPerPage: number;
  page: number;
  loading: boolean;
  sortField?: string;
  sortAscending?: boolean;
  error: boolean;
  selectedRows?: any[];
  searchBarValue?: string;
  resultsRef?: React.RefObject<HTMLDivElement> | null;
}

/**
 * To add a new view type, head to SearchUI/types and add the name of the type to the
 * SearchUIViewType enum, then add a property in searchUIViewsMap using the same name
 * you used for the type, then provide your custom view component as the value.
 * The view component should consume the SearchUIContext state using the useSearchUIContext hook.
 * See SearchUIDataTable or SearchUIDataCards for example view components.
 */
export enum SearchUIViewType {
  TABLE = 'table',
  // CARDS = 'cards',
  SYNTHESIS = 'synthesis'
}

export type SearchUIViewTypeMap = Partial<Record<SearchUIViewType, any>>;

export const searchUIViewsMap: SearchUIViewTypeMap = {
  table: SearchUIDataTable,
  // cards: SearchUIDataCards,
  synthesis: SearchUISynthesisRecipeCards
};
