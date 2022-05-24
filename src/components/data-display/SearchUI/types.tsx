import { DecodedValueMap, QueryParamConfigMap } from 'use-query-params';
import { MaterialsInputType } from '../../data-entry/MaterialsInput';
import { InputHelpItem } from '../../data-entry/MaterialsInput/InputHelp/InputHelp';
import { PeriodicTableMode } from '../../data-entry/MaterialsInput/MaterialsInput';
import { MaterialsInputTypesMap } from '../../data-entry/MaterialsInput/utils';
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
   * The type of filter component to use. Must be one of the pre-determined filter type strings
   * which maps to a component. See `FilterType` documentation for more information.
   */
  type: FilterType;
  /**
   * List of exact parameter names that this filter should add/modify in the API query.
   * Most filter types only update one query parameter and should only have one param here.
   * Sliders, however, can update both a min and max parameter. For sliders, both the min and
   * max parameters should be included here: `['volume_min', 'volume_max']`
   */
  params: string[];
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
   * List of query parameters that this filter should override (turn off) when activated.
   * Parameters listed here must exist in the filterGroups json.
   */
  overrides?: string[];
  /**
   * Set to true if this filter's field is also controlled by the top search bar.
   * i.e. If this filter's field exists in the search bar's `allowedInputTypesMap`.
   * This is used to ensure that the search bar value changes if this filter's value
   * is changed from within the filter.
   */
  isSearchBarField?: boolean;
  /**
   * Set to true to force filter input values to be lowercased before added to the query.
   * This should be used in situations where the filter input make contain an uppercase letter,
   * but the values on the backend are all lowercase.
   */
  makeLowerCase?: boolean;
  /**
   * Hide filter from view
   */
  hidden?: boolean;
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
  name: string;
  value: any;
  params: string[];
  defaultValue?: any;
  isSearchBarField?: boolean;
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
  ARRAY = 'ARRAY',
  RADIO = 'RADIO'
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

export interface SearchUIContainerProps {
  /**
   * The ID used to identify this component in Dash callbacks
   */
  id?: string;
  /**
   * Dash-assigned callback that should be called whenever any of the
   * properties change
   */
  setProps?: (value: any) => any;
  /**
   * Class name(s) to add to in addition to the default top-level class
   */
  className?: string;
  /**
   * An array of column definition objects to control what is rendered in the results table.
   * See `Column` documentation for specifics on how to construct `Column` objects.
   */
  columns: Column[];
  /**
   * An array of filter groups and their respective array of filters.
   * A filter group is a collapsible section of the filters panel that contains one or more filters.
   * A filter is a type of input element that filters the data based on its value.
   * See `FilterGroup` documentation for specifics on how to construct `FilterGroup` and `Filter` objects.
   */
  filterGroups: FilterGroup[];
  /**
   * The URL endpoint to the API that this component should query
   */
  apiEndpoint: string;
  /**
   * Object of query params that will be automatically added for every search.
   * This can be used to scope down a SearchUI to a specific subset of a larger endpoint.
   *
   * e.g. `{ project: 'open_catalyst_project' }`
   */
  apiEndpointParams?: SearchParams;
  /**
   * The URL endpoint for fetching autocompletion results
   */
  autocompleteFormulaUrl?: string;
  /**
   * API key (if needed) that will be used when making queries
   */
  apiKey?: string;
  /**
   * A noun in singular form to describe what a result represents (e.g. "material").
   * Note that only some special plural mappings are handled automatically (e.g. "battery" --> "batteries").
   * In all other cases, an "s" is appended to `resultLabel`.
   */
  resultLabel?: string;
  /**
   * Optionally include/exclude the menu for dynamically controlling sort options
   * @default true
   */
  hasSortMenu?: boolean;
  /**
   * Optionally include up to 2 fields to sort by on initial load.
   * To sort in descending order, prefix the field name with "-".
   * The first sort field can be modified within the UI. The second will be the default secondary sort field.
   * e.g. ["-energy_above_hull", "formula_pretty"]
   */
  sortFields?: string[];
  /**
   * Name of the sort parameter in the linked API.
   * @default 'sort_fields'
   */
  sortKey?: string;
  /**
   * Name of the skip parameter in the linked API.
   * @default 'skip'
   */
  skipKey?: string;
  /**
   * Name of the limit parameter in the linked API.
   * @default 'limit'
   */
  limitKey?: string;
  /**
   * Name of the fields parameter in the linked API.
   * @default 'fields'
   */
  fieldsKey?: string;
  /**
   * Name of the key in the results that contains the total number of results in the query.
   * Supports nested keys.
   * @default 'meta.total_doc'
   */
  totalKey?: string;
  /**
   * List of conditions for styling rows based on a property (selector) and a value.
   * Note that this prop currently only supports checking for
   * value equivalence (i.e. row[selector] === value).
   * See `ConditionalRowStyle` documentation for how to construct `ConditionalRowStyle` conditions.
   */
  conditionalRowStyles?: ConditionalRowStyle[];
  /**
   * Optionally include/exclude checkboxes next to rows for selecting
   */
  selectableRows?: boolean;
  /**
   * Property to maintain the state of selected rows so that
   * they are accessible via Dash callback
   */
  selectedRows?: any[];
  /**
   * Set the initial results view to one of the preset
   * SearchUI views: 'table', or 'synthesis'.
   * Note that these options may expand in the future.
   */
  view?: SearchUIViewType;
  /**
   * Amount of time in milliseconds that should elapse between a user entering
   * a value in the filters panel and a new query being triggered.
   */
  debounce?: number;
  /**
   * This is a temporary solution to allow SearchUI's to render in Storybook.
   * There is an issue with the dynamic column header components that causes
   * Storybook to crash. Rendering column headers as plain strings fixes the problem.
   * Note that this will disable column tooltips and unit labels.
   */
  disableRichColumnHeaders?: boolean;
  /**
   *
   */
  results?: any[];
  /**
   * Endpoint to use for fallback free text material searches against the Matscholar API.
   */
  matscholarEndpoint?: string;
}

export interface SearchState extends SearchUIContainerProps {
  /**
   * Optional props from SearchUIContainerProps that are required by SearchState
   */
  setProps: (value: any) => any;
  sortFields: string[];
  sortKey: string;
  skipKey: string;
  limitKey: string;
  fieldsKey: string;
  totalKey: string;
  /**
   * Additional props for SearchState
   */
  defaultLimit?: number;
  defaultSkip?: number;
  totalResults?: number;
  activeFilters?: ActiveFilter[];
  loading?: boolean;
  error?: boolean;
  searchBarValue?: string;
  resultsRef?: React.RefObject<HTMLDivElement> | null;
}

export interface SearchContextValue {
  state: SearchState;
  query: DecodedValueMap<QueryParamConfigMap>;
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
