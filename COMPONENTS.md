# Component Reference

Catalog of reusable components in `@materialsproject/mp-react-components`. Scope: `src/components/**` (React components only; test/spec/story files and pure style/data/util files are excluded unless they export a component).

## Table of Contents

- [Data display](#data-display)
  - [ActiveFilterButtons](#activefilterbuttons)
  - [ArrayChips](#arraychips)
  - [ButtonBar](#buttonbar)
  - [DataBlock](#datablock)
  - [DataCard](#datacard)
  - [DataTable](#datatable)
  - [ColumnsMenu](#columnsmenu)
  - [DownloadButton](#downloadbutton)
  - [DownloadDropdown](#downloaddropdown)
  - [Formula](#formula)
  - [JsonView](#jsonview)
  - [LinkPopoverCell](#linkpopovercell)
  - [Markdown](#markdown)
  - [Paginator](#paginator)
  - [SearchUIContainer](#searchuicontainer)
  - [MatscholarSearchUIContainer](#matscholarsearchuicontainer)
  - [SearchUIContextProvider](#searchuicontextprovider)
  - [SearchUIDataCards](#searchuidatacards)
  - [SearchUIDataHeader](#searchuidataheader)
  - [SearchUIDataTable](#searchuidatatable)
  - [SearchUIDataView](#searchuidataview)
  - [SearchUIFilters](#searchuifilters)
  - [SearchUIGrid](#searchuigrid)
  - [SearchUISearchBar](#searchuisearchbar)
  - [SearchUISynthesisRecipeCards](#searchuisynthesisrecipecards)
  - [SortDropdown](#sortdropdown)
  - [SynthesisRecipeCard](#synthesisrecipecard)
  - [BibCard](#bibcard)
  - [BibFilter](#bibfilter)
  - [BibjsonCard](#bibjsoncard)
  - [BibtexButton](#bibtexbutton)
  - [CrossrefCard](#crossrefcard)
  - [OpenAccessButton](#openaccessbutton)
  - [PublicationButton](#publicationbutton)
  - [CrystalToolkitScene](#crystaltoolkitscene)
  - [CrystalToolkitAnimationScene](#crystaltoolkitanimationscene)
  - [PhononAnimationScene](#phononanimationscene)
  - [DynamicCrystalToolkitScene](#dynamiccrystaltoolkitscene)
  - [Download](#download)
  - [ReactGraphComponent](#reactgraphcomponent)
  - [Scene (non-React helper)](#scene-scenescents)
  - [PeriodicTableSpacer](#periodictablespacer)
  - [PeriodicTablePluginWrapper](#periodictablepluginwrapper)
- [Form inputs](#form-inputs)
  - [CheckboxList](#checkboxlist)
  - [DualRangeSlider](#dualrangeslider)
  - [FilterField](#filterfield)
  - [GlobalSearchBar](#globalsearchbar)
  - [MaterialsInput](#materialsinput)
  - [MaterialsInputBox](#materialsinputbox)
  - [FormulaAutocomplete](#formulaautocomplete)
  - [InputHelp](#inputhelp)
  - [RangeSlider](#rangeslider)
  - [Select](#select)
  - [Switch](#switch)
  - [TextInput](#textinput)
  - [ThreeStateBooleanSelect](#threestatebooleanselect)
  - [SelectableTable](#selectabletable)
  - [StandalonePeriodicComponent](#standaloneperiodiccomponent)
  - [PeriodicContext](#periodiccontext)
  - [TableFilter](#tablefilter)
  - [Table (internal grid engine)](#table-periodic-tablecomponent)
  - [PeriodicElement](#periodicelement)
  - [PeriodicTableFormulaButtons](#periodictableformulabuttons)
  - [PeriodicTableModeSwitcher](#periodictablemodeswitcher)
- [Navigation](#navigation)
  - [Dropdown](#dropdown)
  - [Link](#link)
  - [Navbar](#navbar)
  - [NavbarDropdown](#navbardropdown)
  - [NotificationDropdown](#notificationdropdown)
  - [Bell](#bell)
  - [Scrollspy](#scrollspy)
  - [Sidebar](#sidebar)
  - [Tabs](#tabs)
- [Overlays/Feedback](#overlaysfeedback)
  - [Drawer](#drawer)
  - [DrawerContextProvider](#drawercontextprovider)
  - [DrawerTrigger](#drawertrigger)
  - [Enlargeable](#enlargeable)
  - [Modal](#modal)
  - [ModalContextProvider](#modalcontextprovider)
  - [ModalTrigger](#modaltrigger)
  - [ModalCloseButton](#modalclosebutton)
  - [Tooltip](#tooltip)
- [Potential Overlaps](#potential-overlaps)

---

## Data display

### ActiveFilterButtons

`src/components/data-display/ActiveFilterButtons/ActiveFilterButtons.tsx`

Renders a row of dismissible "pill" buttons, one per active search filter, formatting range/array/formula/point-group values appropriately. Used inside `SearchUIDataHeader` to show and let users remove currently active `SearchUI` filters.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| className | string | No | - | Extra class name for the wrapper |
| filters | ActiveFilter[] | Yes | - | List of active filters to render as buttons (see `SearchUI/types.tsx` `ActiveFilter`) |
| onClick | (params: string[]) => any | Yes | - | Called with a filter's `params` array when its button is clicked (used to remove the filter) |

**Usage**

```jsx
<ActiveFilterButtons filters={activeFilters} onClick={(params) => actions.removeFilters(params)} />
```

**Variants/States:** None found in code (purely data-driven; renders one button per filter entry)
**Composes:** Formula
**External deps:** classnames, d3 (number formatting), react-icons (FaTimes)

---

### ArrayChips

`src/components/data-display/ArrayChips/ArrayChips.tsx`

Renders an array of values as a row of "tag" chips, optionally as links, publication buttons, or with per-chip tooltips and a download icon. Used for compact display of list-valued fields (e.g. in `DataBlock`/`DataTable` `ARRAY` column format).

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| id | string | No | - | Component id (Dash) |
| setProps | (value: any) => any | No | - | Dash callback prop setter |
| className | string | No | - | Extra class name |
| chips | any[] | Yes | - | Array of values to render as chips |
| chipTooltips | string[] | No | - | Parallel array of tooltip text per chip |
| chipLinks | string[] | No | - | Parallel array of URLs; if present, chip renders as a link |
| chipLinksTarget | string | No | `'_blank'` | `target` attribute for chip links |
| chipType | `'normal' \| 'publications' \| 'dynamic-publications'` | No | `'normal'` | Renders link chips as `PublicationButton` when `'publications'`, or `'dynamic-publications'` + doi.org link |
| showDownloadIcon | boolean | No | - | Shows a download icon inside plain link chips |

**Usage**

```jsx
<ArrayChips
  chips={['AA', 'BB', 'CC']}
  chipTooltips={['Table AA', 'Table BB', 'Table CC']}
  chipLinks={['https://github.com', 'https://github.com', 'https://github.com']}
  chipType="dynamic-publications"
/>
```

**Variants/States:** `chipType`: `normal` | `publications` | `dynamic-publications`; `showDownloadIcon` toggle
**Composes:** PublicationButton, Formula, Tooltip
**External deps:** react-icons (FaDownload), uuid

---

### ButtonBar

`src/components/data-display/ButtonBar/ButtonBar.tsx`

A simple layout wrapper that arranges child buttons into a right-floating vertical bar.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| id | string | No | - | Component id for Dash callbacks |
| className | string | No | - | Extra class name appended to `mpc-button-bar` |
| setProps | (value: any) => any | No | - | Dash-assigned prop-change callback |

**Usage**

```jsx
<ButtonBar>
  <button className="button">One</button>
  <button className="button">Two</button>
</ButtonBar>
```

**Variants/States:** None found in code
**Composes:** None
**External deps:** classnames

---

### DataBlock

`src/components/data-display/DataBlock/DataBlock.tsx`

Displays a single data record (object) as a card-like block: a horizontal "top" row of key fields and an optional collapsible "bottom" section for additional fields, plus an optional icon and footer. Column definitions (shared `Column` type) control formatting, layout, and top/bottom placement. Used as the building block for `SynthesisRecipeCard`.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| id | string | No | - | Component id for Dash callbacks |
| setProps | (value: any) => any | No | - | Dash prop-change callback |
| className | string | No | - | Extra class name |
| data | object | Yes | - | Record to render; values must be string/number/array, not nested objects |
| columns | Column[] | No | derived from data keys | Column definitions controlling formatting/order/top-bottom placement |
| expanded | boolean | No | - | Whether the bottom section starts expanded |
| footer | ReactNode | No | - | Content for the bottom-most footer section |
| iconClassName | string | No | - | CSS class for an icon shown top-right |
| iconTooltip | string | No | - | Tooltip text for the icon |
| disableRichColumnHeaders | boolean | No | - | Renders column headers as plain strings (Storybook workaround) |

**Usage**

```jsx
<DataBlock
  data={{ material_id: 'mp-19395', formula_pretty: 'MnO2', volume: 143.93 }}
  columns={[
    {
      title: 'Material ID',
      selector: 'material_id',
      formatType: 'LINK',
      formatOptions: { baseUrl: 'https://next-gen.materialsproject.org', target: '_blank' },
      isTop: true
    },
    { title: 'Formula', selector: 'formula_pretty', formatType: 'FORMULA', isTop: true },
    {
      title: 'Volume',
      selector: 'volume',
      formatType: 'FIXED_DECIMAL',
      formatOptions: { decimals: 2 }
    }
  ]}
  iconClassName="square"
  iconTooltip="Square"
/>
```

**Variants/States:** `expanded`/collapsed bottom section (toggled via "See more"/"See less"); columns can be flagged `isTop`/`isBottom`/`hidden`
**Composes:** Tooltip
**External deps:** react-collapsible, react-icons (FaCaretDown/Up/Right), uuid

---

### DataCard

`src/components/data-display/DataCard/DataCard.tsx`

Displays a data record as a horizontal card with a left-side custom component (e.g. image) and up to a title, subtitle, and 4 labeled key/value pairs on the right. Intended for grid/card views of search results (used by the not-yet-fully-implemented `SearchUIDataCards`).

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| id | string | No | - | Component id for Dash callbacks |
| setProps | (value: any) => any | No | - | Dash prop-change callback |
| className | string | No | - | Extra class name |
| data | object | Yes | - | Record to render |
| levelOneKey | string | No | - | Key used for the card's title (`title is-4`) |
| levelTwoKey | string | No | - | Key used for the card's subtitle |
| levelThreeKeys | `{ key: string; label: string }[]` | No | - | Up to 4 label/value pairs shown in a 2x2 grid below the title/subtitle |
| leftComponent | ReactNode | No | - | Custom content (e.g. image) shown on the left side of the card |

**Usage**

```jsx
<DataCard
  data={{ material_id: 'mp-149', formula_pretty: 'Si', density: 2.33 }}
  levelOneKey="formula_pretty"
  levelTwoKey="material_id"
  levelThreeKeys={[{ key: 'density', label: 'Density' }]}
  leftComponent={
    <figure className="image is-128x128">
      <img src="mp-149.png" />
    </figure>
  }
/>
```

**Variants/States:** None found in code
**Composes:** None
**External deps:** classnames

---

### DataTable

`src/components/data-display/DataTable/DataTable.tsx`

A general-purpose sortable/selectable data table built on `react-data-table-component`, with support for column definitions/formatting, conditional row styling, single/multi row selection, pagination, an optional header (row count + columns selector), and a markdown footer.

**Props** (see source for full prop list, ~20 total props)
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| id | string | No | - | Component id for Dash callbacks |
| className | string | No | `'box p-0'` | Extra/override class name for the outer container |
| data | any[] | Yes | - | Array of row data objects |
| columns | Column[] | No | derived from `data[0]` keys | Column definitions (see `Column` type) |
| sortField / sortAscending | string / boolean | No | - | Initial sort field/direction |
| secondarySortField / secondarySortAscending | string / boolean | No | - | Secondary sort field/direction |
| conditionalRowStyles | ConditionalRowStyle[] | No | - | Row styling rules based on selector/value/condition (`gt`,`lt`,equality) |
| selectableRows | boolean | No | - | Show row selection checkboxes |
| singleSelectableRows | boolean | No | - | Restrict selection to a single row (adds a radio-button column) |
| selectedRows | any[] | No | - | Externally-controlled selected rows |
| hasHeader | boolean | No | - | Show header with result count + `ColumnsMenu` |
| headerClassName | string | No | `'title is-6'` | Class for the header count text |
| resultLabel / resultLabelPlural | string | No | `'record'` / `resultLabel + 's'` | Noun used in the header count |
| pagination | boolean | No | - | Enable pagination (only applies if >10 rows) |
| paginationIsExpanded | boolean | No | - | Use the expanded `Paginator` instead of react-data-table's compact default |
| footer | ReactNode | No | - | Markdown-rendered content below the table |
| disableRichColumnHeaders | boolean | No | - | Plain-string column headers (Storybook workaround) |

**Usage**

```jsx
<DataTable
  data={materialsRecords}
  columns={[
    {
      title: 'Material ID',
      selector: 'material_id',
      formatType: 'LINK',
      formatOptions: { baseUrl: 'https://next-gen.materialsproject.org', target: '_blank' }
    },
    { title: 'Formula', selector: 'formula_pretty', formatType: 'FORMULA' },
    { title: 'Is Stable', selector: 'is_stable', formatType: 'BOOLEAN' }
  ]}
  pagination
  hasHeader
/>
```

**Variants/States:** `pagination` on/off, `paginationIsExpanded` (expanded vs compact), `selectableRows` + `singleSelectableRows` (multi vs single row selection), `hasHeader` on/off
**Composes:** ColumnsMenu, Paginator, Markdown
**External deps:** react-data-table-component, react-icons (FaCaretDown), classnames

---

### ColumnsMenu

`src/components/data-display/DataTable/ColumnsMenu/ColumnsMenu.tsx`

A dropdown menu with checkboxes for showing/hiding individual table columns (plus a "Select all" toggle). Used internally by `DataTable` and `SearchUIDataHeader`.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| columns | Column[] | Yes | - | Columns to list, each with an `omit`/`excludeFromColumnsSelector` flag |
| setColumns | (columns: Column[]) => any | Yes | - | Callback invoked with the updated columns array when a checkbox is toggled |

**Usage**

```jsx
<ColumnsMenu columns={tableColumns} setColumns={setTableColumns} />
```

**Variants/States:** Per-column `omit` (hidden/shown) state; "Select all" toggled state; columns can be excluded entirely via `excludeFromColumnsSelector`
**Composes:** None
**External deps:** react-aria-menubutton, react-icons (FaAngleDown)

---

### DownloadButton

`src/components/data-display/DownloadButton/DownloadButton.tsx`

A single button that downloads the supplied `data` as a JSON or CSV file when clicked, wrapping its children as the button's label/content.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| id | string | No | - | Component id for Dash callbacks |
| className | string | No | - | Extra class name |
| data | any | Yes | - | Data to download |
| filename | string | No | `'export'` | Downloaded file's base name |
| filetype | `'json' \| 'csv'` | No | `'json'` | Download format |
| tooltip | string | No | - | Sets `data-tooltip` attribute |

**Usage**

```jsx
<DownloadButton data={materialsRecords} filename="materials" filetype="csv">
  Download CSV
</DownloadButton>
```

**Variants/States:** `filetype`: `json` | `csv`
**Composes:** None
**External deps:** classnames; `downloadAs`/`DownloadType` helper from `data-entry/utils`

---

### DownloadDropdown

`src/components/data-display/DownloadDropdown/DownloadDropdown.tsx`

A dropdown-button variant of `DownloadButton` that lets the user pick a download format (JSON or CSV; Excel commented out) from a menu instead of a single fixed filetype.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| id | string | No | - | Component id for Dash callbacks |
| className | string | No | - | Extra class name on the dropdown wrapper |
| buttonClassName | string | No | - | Extra class name on the trigger button |
| data | any | Yes | - | Data to download |
| filename | string | No | `'export'` | Downloaded file's base name |
| tooltip | string | No | - | Sets `data-tooltip` on the trigger button |

**Usage**

```jsx
<DownloadDropdown data={materialsRecords} filename="materials">
  Download
</DownloadDropdown>
```

**Variants/States:** Menu items: JSON, CSV (Excel present in code but commented out)
**Composes:** None
**External deps:** react-aria-menubutton, react-icons (FaAngleDown); `downloadAs`/`DownloadType` helper from `data-entry/utils`

---

### Formula

`src/components/data-display/Formula/Formula.tsx`

Renders a chemical formula string (e.g. `"Li3Fe2(PO4)3"`) with proper subscript formatting for element counts.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| id | string | No | - | Component id for Dash callbacks |
| className | string | No | - | Extra class name (appended to `mpc-formula`) |
| children | string | Yes | - | The formula string to format |

**Usage**

```jsx
<Formula>Li3Fe2(PO4)3</Formula>
```

**Variants/States:** None found in code
**Composes:** None
**External deps:** classnames; `ELEMENTS_REGEX`/`ELEMENTS_SPLIT_REGEX` from `data-entry/MaterialsInput/utils`

---

### JsonView

`src/components/data-display/JsonView/JsonView.tsx`

A thin wrapper around `react-json-view` for interactively displaying/exploring a JSON object tree (collapsible, with clipboard copy, theming, etc.).

**Props** (see source for full prop list, 14 total props)
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| src | object | No | `null` | The JSON object to display |
| name | boolean \| string | No | `false` | Root node label (or `false` to hide) |
| theme | string | No | `'rjv-default'` | react-json-view theme name |
| collapsed | boolean \| number | No | `false` | Collapse all, or collapse below a given depth |
| collapseStringsAfterLength | boolean \| number | No | `false` | Truncate long string values |
| groupArraysAfterLength | number | No | `100` | Group large arrays |
| enableClipboard | boolean | No | `true` | Show copy-to-clipboard icon |
| displayObjectSize | boolean | No | `false` | Show object/array size |
| displayDataTypes | boolean | No | `false` | Show data type icons |
| sortKeys | boolean | No | `false` | Sort object keys alphabetically |
| indentWidth | number | No | `8` | Indentation width in px |
| iconStyle | `'circle' \| 'triangle' \| 'square'` | No | `'circle'` | Expand/collapse icon style |

**Usage**

```jsx
<JsonView src={{ a: { b: { c: { d: '12' } } } }} />
```

**Variants/States:** `collapsed` (boolean/depth), `iconStyle` (`circle`/`triangle`/`square`), `theme` (any react-json-view theme name)
**Composes:** None
**External deps:** react-json-view, prop-types

---

### LinkPopoverCell

`src/components/data-display/LinkPopoverCell/LinkPopoverCell.tsx`

Renderer for `ColumnFormat.LINK_POPOVER` table cells: shows the value as a clickable (non-navigating) link that, on click, records itself as the "last clicked cell" in `SearchUIContext` (surfaced to Dash via `lastClickedCell`) and opens an inline popover anchored beside the link, showing `state.popoverContent` (or a loading message). Closes when clicking outside.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| selector | string | Yes | - | Column selector identifying which field this cell belongs to |
| value | any | Yes | - | Cell value, also used as link label; renders `-` if falsy |
| row | any | Yes | - | Full row object, forwarded to Dash via `lastClickedCell` |

**Usage**

```jsx
<LinkPopoverCell selector="material_id" value={row.material_id} row={row} />
```

**Variants/States:** Empty (`-`) vs link; popover open vs closed; loading (`popoverContent == null`) vs populated
**Composes:** SearchUIContextProvider (`useSearchUIContext`/`useSearchUIContextActions`) — requires a `SearchUIContainer` ancestor
**External deps:** None notable

---

### Markdown

`src/components/data-display/Markdown/Markdown.tsx`

A reworked, extended replacement for Dash's `dcc.Markdown` built on `react-markdown` v6, with GitHub-flavored markdown, math (KaTeX), syntax highlighting, and heading slugs enabled by default. Supports dedenting indented markdown blocks.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| id | string | No | - | Component id for Dash callbacks |
| className | string | No | - | Class name for the container `div` |
| dedent | boolean | No | `true` | Remove common leading whitespace from all lines before rendering |
| loading_state | any | No | - | Dash-renderer loading state object |
| style | any | No | - | Inline styles for the container |
| children | string \| string[] | No | - | Markdown text (array of strings is joined with `\n`) |

**Usage**

```jsx
<Markdown>{'# Heading\n\nSome **markdown** with $E=mc^2$ math.'}</Markdown>
```

**Variants/States:** `dedent` on/off
**Composes:** None
**External deps:** react-markdown, remark-gfm, remark-math, remark-highlight.js, rehype-slug, rehype-katex, katex, highlight.js

---

### Paginator

`src/components/data-display/Paginator/Paginator.tsx`

A full-featured pagination control with previous/next buttons, numbered page links (with ellipsis truncation for large page counts), a "results per page" dropdown, and a "jump to page" dropdown. Used as the expanded paginator for `DataTable` and `SearchUIDataTable`/`SearchUIDataCards`/`SearchUISynthesisRecipeCards`.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| rowsPerPage | number | Yes | - | Current page size |
| rowCount | number | Yes | - | Total number of rows across all pages |
| onChangePage | (page: number) => any | Yes | - | Called when the user navigates to a page |
| onChangeRowsPerPage | (rowsPerPage: number) => any | No | - | Called when the user changes the page size |
| currentPage | number | Yes | - | Current 1-indexed page number |
| isTop | boolean | No | - | Flips dropdown open direction and icon direction; distinguishes a paginator rendered above vs below the table |

**Usage**

```jsx
<Paginator
  rowCount={120}
  rowsPerPage={15}
  currentPage={1}
  onChangePage={(page) => setPage(page)}
  onChangeRowsPerPage={(n) => setRowsPerPage(n)}
/>
```

**Variants/States:** `isTop` true/false; layout adapts near start/middle/end of page range and for <6 total pages
**Composes:** None
**External deps:** react-aria-menubutton, react-icons (FaAngleDown/Up, FaArrowLeft/Right), d3, prop-types

---

### SearchUIContainer

`src/components/data-display/SearchUI/SearchUIContainer/SearchUIContainer.tsx`

The top-level orchestrating component for building a full search UI backed by a REST API. Wraps children in a React Router + query-param provider and a `SearchUIContextProvider`, and owns most of the SearchUI configuration (endpoint, columns, filters, sort/pagination keys, view type, etc.).

**Props** (see source for full prop list, ~25 total props; `SearchUIContainerProps` in `SearchUI/types.tsx`)
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| columns | Column[] | Yes | - | Column definitions for the results table |
| filterGroups | FilterGroup[] | Yes | - | Groups of filters shown in the filters panel |
| apiEndpoint | string | Yes | - | REST API URL to query |
| apiEndpointParams | SearchParams | No | `{}` | Static params merged into every request |
| autocompleteFormulaUrl | string | No | - | Endpoint for formula autocomplete |
| apiKey | string | No | - | API key sent as `X-Api-Key` header |
| resultLabel | string | No | `'result'` | Singular noun describing a result |
| hasSortMenu | boolean | No | `true` | Include the sort menu |
| sortFields | (string \| null \| undefined)[] | No | `[]` | Initial sort field(s), `-` prefix for descending |
| sortKey / limitKey / skipKey / fieldsKey / totalKey | string | No | `'_sort_fields'` / `'_limit'` / `'_skip'` / `'_fields'` / `'meta.total_doc'` | Names of the corresponding API query/response keys |
| conditionalRowStyles | ConditionalRowStyle[] | No | `[]` | Row styling rules for the table view |
| view | `'table' \| 'synthesis'` | No | `table` | Initial results view |
| debounce | number | No | `1000` | Debounce (ms) for filter input changes |
| matscholarEndpoint | string | No | - | Fallback endpoint for Matscholar free-text search |

**Usage**

```jsx
<SearchUIContainer
  resultLabel="material"
  columns={columns}
  filterGroups={filterGroups}
  apiEndpoint="https://api.materialsproject.org/summary/"
  autocompleteFormulaUrl="https://api.materialsproject.org/materials/formula_autocomplete/"
  apiKey={process.env.REACT_APP_API_KEY}
>
  <SearchUISearchBar
    placeholder="Search by elements, formula, or ID"
    allowedInputTypesMap={{ formula: { field: 'formula' } }}
  />
  <SearchUIGrid />
</SearchUIContainer>
```

**Variants/States:** `view`: `table` | `synthesis`; `hasSortMenu` on/off
**Composes:** SearchUIContextProvider (and via children, SearchUISearchBar/SearchUIGrid/etc.)
**External deps:** react-router-dom, use-query-params, classnames

---

### MatscholarSearchUIContainer

`src/components/data-display/SearchUI/SearchUIContainer/MatscholarSearchUIContainer.tsx`

A variant of `SearchUIContainer` that adds fallback free-text search against the Matscholar API (used in the `MatscholarAlpha` story). Full prop/behavior details unclear from code — verify in Storybook/tests.

**Props**
unclear from code, verify in Storybook/tests

**Usage**

```jsx
<MatscholarSearchUIContainer
  resultLabel="material"
  columns={columns}
  filterGroups={matscholarFilterGroups}
  apiEndpoint="https://api.materialsproject.org/summary/"
  matscholarEndpoint="https://www.matscholar.com/api/search/materials/"
>
  <SearchUISearchBar allowedInputTypesMap={{ formula: { field: 'formula' } }} />
  <SearchUIGrid />
</MatscholarSearchUIContainer>
```

**Variants/States:** unclear from code, verify in Storybook/tests
**Composes:** Likely SearchUIContainer/SearchUIContextProvider (not fully verified)
**External deps:** unclear from code, verify in Storybook/tests

---

### SearchUIContextProvider

`src/components/data-display/SearchUI/SearchUIContextProvider/SearchUIContextProvider.tsx`

The core state-management component for `SearchUI`. Manages query params (via `use-query-params`), fetches results with axios, computes active filters, and exposes `state`/`query` (via `useSearchUIContext`) and an `actions` object (via `useSearchUIContextActions`) with methods like `setPage`, `setSort`, `setFilterValue`, `resetFilters`, `getData`, `setLastClickedCell`, etc.

**Props** (accepts the shape of `SearchState`/`SearchUIContainerProps`; 10+ props with defaults)
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| defaultLimit | number | No | `15` | Default page size |
| defaultSkip | number | No | `0` | Default skip/offset |
| activeFilters | ActiveFilter[] | No | `[]` | Initial active filters |
| totalResults | number | No | `0` | Initial total result count |
| loading | boolean | No | `false` | Initial loading state |
| error | boolean | No | `false` | Initial error state |
| searchBarValue | string | No | `''` | Initial search bar text |
| resultsRef | React.RefObject<HTMLDivElement> \| null | No | `null` | Ref used to scroll results into view on page change |
| ...otherProps | (all `SearchUIContainerProps`) | - | - | Passed through from `SearchUIContainer` |

**Usage**

```jsx
<SearchUIContextProvider {...searchUIProps}>{children}</SearchUIContextProvider>
```

**Variants/States:** `loading`/`error` flags drive `SearchUIDataView`'s rendered state
**Composes:** None (it is the context source consumed by nearly all other SearchUI/\* components)
**External deps:** axios, qs, use-query-params, use-deep-compare-effect, react-router-dom, scroll-into-view-if-needed

---

### SearchUIDataCards

`src/components/data-display/SearchUI/SearchUIDataCards/SearchUIDataCards.tsx`

**Not implemented** (per source comment) — a planned grid-of-`DataCard` view for `SearchUI` results, paginated top and bottom. Currently unused in `searchUIViewsMap` (commented out).

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| (none) | - | - | - | Takes no props; reads everything from `SearchUIContext` (`state.results`, `state.cardOptions`, `state.totalResults`, etc.) |

**Usage**

```jsx
{
  /* Rendered internally by SearchUI when view="cards" once re-enabled in searchUIViewsMap */
}
<SearchUIDataCards />;
```

**Variants/States:** None found in code (marked not implemented)
**Composes:** Paginator, DataCard, SearchUIContextProvider
**External deps:** None notable

---

### SearchUIDataHeader

`src/components/data-display/SearchUI/SearchUIDataHeader/SearchUIDataHeader.tsx`

Renders the results-summary header for a `SearchUI`: a dynamic title (loading / "All N results" / "N results match your search"), the current result range, a loading progress bar, the `ColumnsMenu` (table view only), and a slot for a custom export button. Also renders `ActiveFilterButtons` when filters are active.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| exportDataButton | ReactNode | No | - | Custom export/download button rendered in the header controls |

**Usage**

```jsx
<SearchUIContainer columns={columns} filterGroups={filterGroups} apiEndpoint={apiEndpoint}>
  <SearchUIDataHeader exportDataButton={<DownloadButton data={results}>Export</DownloadButton>} />
</SearchUIContainer>
```

**Variants/States:** Title states: loading / zero-filter "All N results" / filtered "N results match your search"; shows/hides `ActiveFilterButtons` based on active filter count
**Composes:** ActiveFilterButtons, SortDropdown, ColumnsMenu, SearchUIContextProvider
**External deps:** react-number-format, react-icons, react-aria-menubutton, d3, uuid, classnames

---

### SearchUIDataTable

`src/components/data-display/SearchUI/SearchUIDataTable/SearchUIDataTable.tsx`

The table view for `SearchUI` results — analogous to the standalone `DataTable` component but wired directly into `SearchUIContext` for server-side sorting/pagination/selection instead of accepting `data`/`columns` as props directly.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| (none) | - | - | - | Takes no props; reads `state.columns`, `state.results`, `state.totalResults`, `state.conditionalRowStyles`, `state.selectableRows`, etc. from `SearchUIContext` |

**Usage**

```jsx
{
  /* Rendered internally by SearchUIDataView when the SearchUIContainer's view is "table" */
}
<SearchUIDataTable />;
```

**Variants/States:** Row selection driven by `state.selectableRows`; conditional row styling from `state.conditionalRowStyles`
**Composes:** Paginator, SearchUIContextProvider
**External deps:** react-data-table-component, react-icons (FaCaretDown)

---

### SearchUIDataView

`src/components/data-display/SearchUI/SearchUIDataView/SearchUIDataView.tsx`

Dispatches to the correct results view component (`SearchUIDataTable`, `SearchUISynthesisRecipeCards`, etc., via `searchUIViewsMap`) based on `state.view`, and shows error/no-results messages when appropriate.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| (none) | - | - | - | Takes no props; reads `state.error`, `state.results`, `state.view` from `SearchUIContext` |

**Usage**

```jsx
<SearchUIDataView />
```

**Variants/States:** Error state, empty-results state, and per-`state.view` component (`table` | `synthesis`)
**Composes:** SearchUIContextProvider; dynamically renders SearchUIDataTable or SearchUISynthesisRecipeCards
**External deps:** react-icons (FaExclamationTriangle)

---

### SearchUIFilters

`src/components/data-display/SearchUI/SearchUIFilters/SearchUIFilters.tsx`

Renders the collapsible filters panel for a `SearchUI`, iterating over `state.filterGroups` and rendering the correct input component per `Filter.type` (text input, materials input, slider, select variants, three-state boolean, checkbox list), with active-filter counts, group expand/collapse, and a "Reset" button.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| className | string | No | - | Extra class name for the outer panel |

**Usage**

```jsx
<SearchUIContainer columns={columns} filterGroups={filterGroups} apiEndpoint={apiEndpoint}>
  <SearchUIGrid />
  {/* or directly: */}
  <SearchUIFilters />
</SearchUIContainer>
```

**Variants/States:** Each filter group can be `expanded`/collapsed or `alwaysExpanded`; filter `type` drives which input renders (`SLIDER`, `MATERIALS_INPUT`, `TEXT_INPUT`, `SELECT` + spacegroup/crystal-system/pointgroup variants, `THREE_STATE_BOOLEAN_SELECT`, `CHECKBOX_LIST`)
**Composes:** MaterialsInput, DualRangeSlider, Select, CheckboxList, ThreeStateBooleanSelect, TextInput, Tooltip, FilterField, SearchUIContextProvider
**External deps:** react-icons, classnames

---

### SearchUIGrid

`src/components/data-display/SearchUI/SearchUIGrid/SearchUIGrid.tsx`

Combines `SearchUIFilters`, `SearchUIDataHeader`, and `SearchUIDataView` into the standard two-column (filters + results) `SearchUI` layout. Must be used inside a `SearchUIContainer`.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| exportDataButton | ReactNode | No | - | Passed through to `SearchUIDataHeader` |

**Usage**

```jsx
<SearchUIContainer columns={columns} filterGroups={filterGroups} apiEndpoint={apiEndpoint}>
  <SearchUISearchBar allowedInputTypesMap={{ formula: { field: 'formula' } }} />
  <SearchUIGrid />
</SearchUIContainer>
```

**Variants/States:** None found in code
**Composes:** SearchUIFilters, SearchUIDataHeader, SearchUIDataView
**External deps:** None notable

---

### SearchUISearchBar

`src/components/data-display/SearchUI/SearchUISearchBar/SearchUISearchBar.tsx`

A specialized `MaterialsInput`-based top-level search bar for `SearchUI`, supporting elements/formula/mp-id/SMILES/text search modes, an optional periodic table picker, and help examples. Submitting the input maps its value to the correct API filter field and deactivates the other allowed fields.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| className | string | No | `'is-medium'` | Class name(s) for the input field |
| placeholder | string | No | - | Placeholder text |
| errorMessage | string | No | - | Custom error message for invalid input |
| allowedInputTypesMap | MaterialsInputTypesMap | Yes | - | Map of allowed input types (`elements`, `formula`, `mpid`, etc.) to their API field names |
| periodicTableMode | `'toggle' \| 'focus' \| 'none'` | No | `'toggle'` | How/when the periodic table picker is shown |
| helpItems | InputHelpItem[] | No | - | Search examples shown below the input |
| chemicalSystemSelectHelpText | string | No | - | Markdown help text for chemical-system selection mode |
| elementsSelectHelpText | string | No | - | Markdown help text for elements selection mode |

**Usage**

```jsx
<SearchUISearchBar
  periodicTableMode="toggle"
  placeholder="Search by elements, formula, or ID"
  errorMessage="Invalid search value"
  allowedInputTypesMap={{
    elements: { field: 'elements' },
    formula: { field: 'formula' },
    mpid: { field: 'material_ids' }
  }}
  helpItems={[
    { label: 'Search Examples' },
    { label: 'Include at least elements', examples: ['Li,Fe', 'Si,O,K'] }
  ]}
/>
```

**Variants/States:** `periodicTableMode`: `toggle` | `focus` | `none`; periodic table auto-hides once any filter is active
**Composes:** MaterialsInput, SearchUIContextProvider
**External deps:** None notable beyond internal MaterialsInput deps

---

### SearchUISynthesisRecipeCards

`src/components/data-display/SearchUI/SearchUISynthesisRecipeCards/SearchUISynthesisRecipeCards.tsx`

A `SearchUI` results view (`SearchUIViewType.SYNTHESIS`) that renders each result as a `SynthesisRecipeCard`, with top/bottom pagination driven by `SearchUIContext`.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| (none) | - | - | - | Takes no props; reads `state.results`, `state.totalResults`, query limit/skip from `SearchUIContext` |

**Usage**

```jsx
<SearchUIContainer
  view="synthesis"
  columns={columns}
  filterGroups={filterGroups}
  apiEndpoint={apiEndpoint}
>
  <SearchUIGrid />
</SearchUIContainer>
```

**Variants/States:** None found in code beyond pagination
**Composes:** Paginator, SynthesisRecipeCard, SearchUIContextProvider
**External deps:** None notable

---

### SortDropdown

`src/components/data-display/SortDropdown/SortDropdown.tsx`

A combined sort-direction button + sort-field dropdown for sorting an array of values (or delegating sorting to an external `sortFn`, e.g. `SearchUI`'s API-backed sort).

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| sortValues | any[] | Yes | - | Array to sort (mutated/sorted in place when `setSortValues` is provided) |
| setSortValues | (value: any) => any | No | - | Setter called with the newly sorted array |
| sortOptions | `{label, value}[]` | Yes | - | Fields available to sort by |
| sortField | string | No | `sortOptions[0].value` | Currently selected sort field |
| setSortField | (value: any) => any | Yes | - | Called when the sort field changes |
| sortAscending | boolean | No | `false` | Current sort direction |
| setSortAscending | (value: any) => any | Yes | - | Called when the sort direction toggles |
| sortFn | (field: string, asc: boolean) => any | No | `sortDynamic` | Comparator-factory function, or custom sort trigger (e.g. API sort) |

**Usage**

```jsx
<SortDropdown
  sortValues={results}
  setSortValues={setResults}
  sortOptions={[
    { label: 'Formula', value: 'formula_pretty' },
    { label: 'Volume', value: 'volume' }
  ]}
  sortField="volume"
  setSortField={setSortField}
  sortAscending={false}
  setSortAscending={setSortAscending}
/>
```

**Variants/States:** Ascending vs descending sort direction (icon toggles between `FaSortUp`/`FaSortDown`)
**Composes:** None
**External deps:** react-aria-menubutton, react-icons (FaAngleDown/FaSort/FaSortUp/FaSortDown); `sortDynamic` helper from `data-entry/utils`

---

### SynthesisRecipeCard

`src/components/data-display/SynthesisRecipeCard/SynthesisRecipeCard.tsx`

A domain-specific card (built on top of `DataBlock`) for displaying a single materials-synthesis recipe: target/precursor material formulas (as material links), synthesis type, an excerpted/highlighted source paragraph, a formatted reaction equation, a numbered list of synthesis procedures, and a footer linking to the source publication (DOI).

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| id | string | No | - | Component id |
| className | string | No | - | Extra class name |
| data | any | Yes | - | Recipe object with `target`, `precursors`, `precursors_formula_s`, `synthesis_type`, `paragraph_string`, `highlights`, `reaction_string`, `operations`, `doi`, etc. |

**Usage**

```jsx
<SynthesisRecipeCard data={recipeData} />
```

**Variants/States:** None found in code (rendering purely driven by `data` shape)
**Composes:** DataBlock, Formula, Link, PublicationButton
**External deps:** react-collapsible, react-icons (FaArrowRight, FaChevronDown)

---

### BibCard

`src/components/publications/BibCard/BibCard.tsx`

Displays a single bibliographic reference (title, authors, and action buttons for publication link, open access PDF, and BibTeX). This is the shared rendering base used internally by `BibjsonCard` and `CrossrefCard`.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| id | string | No | - | Component id for Dash callbacks |
| setProps | (value: any) => any | No | - | Dash-assigned callback |
| className | string | No | - | Class name(s) appended to `mpc-bib-card` |
| title | string | No | `''` | Title of the publication (rendered via `dangerouslySetInnerHTML`) |
| author | string[] \| CrossrefAuthor[] | No | - | List of author names, either plain strings or `{given, family, sequence}` objects |
| shortName | string | No | - | Shortened title of the article |
| year | string \| number | No | - | Year the article was published |
| journal | string | No | - | Journal the article was published in |
| doi | string | No | - | DOI used to build the article link and fetch an open access PDF |
| preventOpenAccessFetch | boolean | No | - | If true, skips the Open Access API lookup |
| openAccessUrl | string | No | - | URL to an openly available version of the article (skips dynamic fetch if set) |

**Usage**

```jsx
<BibCard
  className="box"
  title="Orientation-Dependent Properties of Epitaxially Strained Perovskite Oxide Thin Films"
  author={['Angsten, Thomas', 'Martin, Lane W.', 'Asta, Mark']}
  journal="Physical Review B"
  doi="10.1103/PhysRevB.95.174110"
  year="2017"
/>
```

**Variants/States:** `preventOpenAccessFetch` toggles Open Access network fetch; title renders as a link only when `doi` is present
**Composes:** PublicationButton, OpenAccessButton, BibtexButton
**External deps:** classnames, react-icons (FaBook imported but unused)

---

### BibFilter

`src/components/publications/BibFilter/BibFilter.tsx`

Renders a searchable, sortable list of citation cards from an array of bibliographic entries in either `bibjson` or `crossref` format; includes a search box and a sort dropdown (by year, author, or title).

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| id | string | No | - | Component id for Dash callbacks |
| setProps | (value: any) => any | No | - | Dash-assigned callback |
| className | string | No | - | Class name(s) appended to `mpc-bib-filter` |
| bibEntries | any[] | Yes | - | List of bibjson/crossref objects; only `title`, `author`, `year`, `doi`, `journal` are used |
| format | `'crossref' \| 'bibjson'` | No | `'bibjson'` | Format of the objects in `bibEntries` |
| sortField | string | No | `'year'` | Property name to initially sort entries by |
| ascending | boolean | No | `false` | Initial sort direction |
| resultClassName | string | No | - | Class name(s) appended to each result card |
| preventOpenAccessFetch | boolean | No | `false` | Prevents dynamically fetching open access PDF links for each entry |

**Usage**

```jsx
<BibFilter bibEntries={mpPapers.slice(1, 10)} resultClassName="box" preventOpenAccessFetch={true} />
```

**Variants/States:** `format` controls which card renderer is used (`bibjson` → BibjsonCard, `crossref` → CrossrefCard); sort direction togglable ascending/descending
**Composes:** BibjsonCard, CrossrefCard, SortDropdown
**External deps:** react-aria-menubutton (mostly unused), react-icons

---

### BibjsonCard

`src/components/publications/BibjsonCard/BibjsonCard.tsx`

Thin adapter that parses a single object in bibjson format (as produced by the `bibtexparser` Python library) and passes its fields through to `BibCard` for rendering.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| id | string | No | - | Component id for Dash callbacks |
| setProps | (value: any) => any | No | - | Dash-assigned callback |
| className | string | No | - | Class name(s) to append |
| bibjsonEntry | any | Yes | - | Single bib object in bibjson format; uses `title`, `author`, `year`, `doi`, `journal` |
| preventOpenAccessFetch | boolean | No | - | Prevents dynamically fetching an open access PDF link via `doi` |

**Usage**

```jsx
<BibjsonCard
  bibjsonEntry={{
    journal: 'Physical Review Letters',
    year: '2010',
    doi: '10.1103/PhysRevLett.105.196403',
    author: ['Chan, M. K Y', 'Ceder, G.'],
    title: 'Efficient Band Gap Prediction for Solids'
  }}
/>
```

**Variants/States:** None found in code (delegates all display states to BibCard)
**Composes:** BibCard
**External deps:** None notable

---

### BibtexButton

`src/components/publications/BibtexButton/BibtexButton.tsx`

A standardized anchor-styled button that links to a reference's BibTeX citation, either from a directly supplied `url` or generated automatically from a `doi` via doi2bib.org.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| ...React.HTMLProps<HTMLAnchorElement> | - | No | - | Extends standard anchor element props |
| id | string | No | - | Component id for Dash callbacks |
| className | string | No | `'tag'` | Class name(s) appended to `mpc-bibtex-button` |
| doi | string | No | - | DOI passed to doi2bib.org to build the bibtex link |
| url | string | No | - | Directly supplied bibtex URL; if set, `doi` is not used |
| target | string | No | `'_blank'` | Anchor `target` attribute value |

**Usage**

```jsx
<BibtexButton doi="10.1093/mnras/stu869" />
```

**Variants/States:** None found in code (single visual state; label is always "BibTeX")
**Composes:** None
**External deps:** None notable

---

### CrossrefCard

`src/components/publications/CrossrefCard/CrossrefCard.tsx`

Renders a citation card from a Crossref-format entry; if no `crossrefEntry` object is supplied, it fetches one from the Crossref `/works/{identifier}` API using the given `identifier`, showing a loading or error state while doing so.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| id | string | No | - | Component id for Dash callbacks |
| setProps | (value: any) => any | No | - | Dash-assigned callback |
| className | string | No | - | Class name(s) appended to the component's default class |
| crossrefEntry | any | No | - | Single bib object in crossref format; if supplied, no API request is made |
| identifier | string | No | - | DOI or bibtex string used to query the Crossref `/works` endpoint (required if `crossrefEntry` is not supplied) |
| errorMessage | string | No | `'Could not find reference'` | Message shown inside the card if the Crossref request fails |
| preventOpenAccessFetch | boolean | No | - | Prevents dynamically fetching an open access PDF link |

**Usage**

```jsx
<CrossrefCard className="box" identifier="10.1093/mnras/stu869" />
```

**Variants/States:** Loading → error (`errorMessage`) → loaded (renders BibCard)
**Composes:** BibCard
**External deps:** axios (`https://api.crossref.org/works/{identifier}`)

---

### OpenAccessButton

`src/components/publications/OpenAccessButton/OpenAccessButton.tsx`

A button/link that points to an openly-accessible version of a publication's PDF; if no `url` is given, it dynamically looks up an open access link via the oa.works API using the `doi`, showing a loading spinner while fetching and hiding itself entirely if none is found.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| id | string | No | - | Component id for Dash callbacks |
| className | string | No | `'tag'` | Class name(s) appended to `mpc-open-access-button` |
| doi | string | No | - | DOI used to fetch an open access PDF link |
| url | string | No | - | Directly supplied open access PDF URL; if set, no fetch is attempted |
| target | string | No | unclear from code (JSDoc says `_blank` default) | Anchor `target` attribute value |
| compact | boolean | No | - | If true, hides the "Open Access" text label and shows a tooltip instead |

**Usage**

```jsx
<OpenAccessButton doi="10.1038/nphys4277" compact={true} />
```

**Variants/States:** `compact` (icon-only vs icon+label); loading state (spinner); hidden entirely when no URL found
**Composes:** Tooltip
**External deps:** axios (`https://bg.api.oa.works/find?id={doi}`), static image asset `oab_color.png`

---

### PublicationButton

`src/components/publications/PublicationButton/PublicationButton.tsx`

A standardized button/link to a publication that can auto-derive its target URL and label (journal + year) from a DOI via the Crossref API, or accept an explicit URL/label; optionally shows a tooltip with the full bibliographic citation on hover.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| id | string | No | - | Component id for Dash callbacks |
| className | string | No | `'tag'` | Class name(s) appended to `mpc-publication-button` |
| doi | string | No | - | DOI used to generate a doi.org link and fetch journal/year from Crossref |
| url | string | No | - | Directly supplied publication URL; if a doi.org URL, the DOI is parsed out for Crossref lookups |
| target | string | No | unclear from code (JSDoc implies `_blank` default) | Anchor `target` attribute value |
| compact | boolean | No | - | Shows icon only, hides label; also defaults `showTooltip` to true |
| showTooltip | boolean | No | - | Shows a tooltip with the bibliographic citation on hover |
| children | ReactNode | No | - | Custom link label; if supplied, no Crossref fetch for label occurs |

**Usage**

```jsx
<PublicationButton doi="10.1093/mnras/stu869" showTooltip={true} />
```

**Variants/States:** `compact` (icon-only), `showTooltip` (citation tooltip, auto-enabled when compact); label/URL auto-fetch only occurs when not already supplied via props/children
**Composes:** Tooltip
**External deps:** axios (`https://api.crossref.org/works/{doi}` and `.../transform/text/x-bibliography`), react-icons (FaBook), uuid (imported but unused)

---

### CrystalToolkitScene

`src/components/crystal-toolkit/CrystalToolkitScene/CrystalToolkitScene.tsx`

The primary component for rendering static or lightly-animated 3D crystal structure / molecular scenes from a human-readable JSON scene graph (generated in Python via `crystal_toolkit.core.scene`), built on three.js. Provides a control bar for fullscreen expand, settings panel toggle, camera reset, screenshot/image export (PNG, DAE, GLTF, GLB, USDZ), and custom file export, plus optional debug view and inset axis indicator.

**Props** (see source for full prop list — ~27 total props)
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| data | any | Yes | - | Scene JSON describing the 3D scene (Python `Scene.to_json()`) |
| id | string | No | - | Component id for Dash callbacks |
| setProps | (value: any) => any | No | `() => null` | Dash-assigned callback for prop changes (image data, camera state, etc.) |
| children | ReactNode | No | - | First child renders as settings panel, second as bottom (legend) panel |
| className | string | No | - | Class name applied to the wrapper (and modal-content when enlarged) |
| debug | boolean | No | - | Enables a debugging view/panel |
| settings | any | No | - | Rendering settings (antialias, renderer 'webgl'/'svg', transparentBackground, background, sphereSegments, staticScene, defaultZoom, zoomToFit2D, extractAxis, etc.) |
| toggleVisibility | any | No | - | Map of object name → 1/0 to show/hide scene nodes |
| imageRequest | any | No | `{}` | Object `{filetype}` that triggers a screenshot/scene export |
| imageType | `'png'\|'dae'\|'gltf'\|'glb'\|'usdz'` | No | `png` | Requested export image/model type |
| imageData / imageDataTimestamp | string / any | No (auto-set) | - | Generated image data and its timestamp |
| fileOptions | string[] | No | - | Options shown in the file-export dropdown |
| fileType / fileTimestamp | string / any | No (auto-set) | - | Last file-export type clicked, and its timestamp |
| onObjectClicked | (value: any) => any | No | - | Callback fired with clicked/selected scene objects |
| inletSize / inletPadding | number | No | - | Size/padding of the axis inlet (corner mini-view) |
| axisView | string | No | - | Orientation/position of the axis inlet (`SW`,`SE`,`NW`,`NE`,`HIDDEN`) |
| animation | `'play'\|'none'\|'slider'` | No | - | Animation style; `slider` shows a RangeSlider scrubber |
| currentCameraState / customCameraState | CameraState | No | - | Current/forced camera position/quaternion/zoom |
| showControls / showExpandButton / showImageButton / showExportButton / showPositionButton | boolean | No | `true` | Toggle individual control-bar buttons |
| sceneSize | number \| string | No | `500` | Width/height of the square scene viewport |

**Usage**

```jsx
<CrystalToolkitScene
  debug={false}
  animation="none"
  inletPadding={10}
  inletSize={100}
  data={sceneJson}
  sceneSize={400}
  toggleVisibility={{}}
  settings={{ renderer: 'webgl', extractAxis: false, zoomToFit2D: true }}
/>
```

**Variants/States:** `animation`: play/none/slider; `settings.renderer`: webgl/svg; `axisView`: SW/SE/NW/NE/HIDDEN; export type: png/dae/gltf/glb/usdz; individual control-bar buttons toggleable
**Composes:** Enlargeable, ButtonBar, Dropdown, Tooltip, ModalCloseButton, RangeSlider, internal `Scene` class, CameraContext/CameraContextProvider
**External deps:** three.js (WebGLRenderer, exporters: ColladaExporter/GLTFExporter/USDZExporter), svgtodatauri, use-resize-observer, react-icons, react-tooltip, uuid

---

### CrystalToolkitAnimationScene

`src/components/crystal-toolkit/CrystalToolkitAnimationScene/CrystalToolkitAnimationScene.tsx`

A variant of `CrystalToolkitScene` dedicated to continuously-animated 3D scenes (e.g. atoms moving/vibrating): on data change it calls `scene.animate()` directly rather than only rendering statically. Shares nearly identical props, control bar, and export functionality with `CrystalToolkitScene`.

**Props** (near-identical shape to CrystalToolkitScene, ~27 props — see that entry for details)
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| data | any | Yes | - | Scene JSON describing the animated 3D scene |
| settings, toggleVisibility, imageRequest/imageType/imageData, fileOptions/fileType, onObjectClicked, inletSize/inletPadding/axisView, animation, currentCameraState/customCameraState, showControls/showExpandButton/showImageButton/showExportButton/showPositionButton, sceneSize | same as CrystalToolkitScene | No | same as CrystalToolkitScene | Same prop contract as CrystalToolkitScene |

**Usage**

```jsx
<CrystalToolkitAnimationScene
  debug={false}
  data={animatedSceneJson}
  sceneSize={400}
  toggleVisibility={{}}
  settings={{ renderer: 'webgl', staticScene: false }}
/>
```

**Variants/States:** Same as CrystalToolkitScene
**Composes:** Enlargeable, ButtonBar, Dropdown, Tooltip, ModalCloseButton, RangeSlider, internal Scene class, CameraContext
**External deps:** three.js, svgtodatauri, use-resize-observer, react-icons, react-tooltip, uuid

---

### PhononAnimationScene

`src/components/crystal-toolkit/PhononAnimationScene/PhononAnimationScene.tsx`

A specialized 3D scene component for visualizing phonon vibration modes of a crystal structure: consumes scene JSON annotated with `app: 'phonon'` plus per-atom `amplitude`, `phases`, `omega` (eigenfrequency), `eigenVectors`, and `velocity`, and animates atoms oscillating according to the phonon eigenmode via `PhononAnimationHelper`. Shares the same control bar/export UI as `CrystalToolkitScene`.

**Props** (near-identical shape to CrystalToolkitScene — see that entry for full list)
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| data | any | Yes | - | Scene JSON with `app: 'phonon'` plus `amplitude`, `phases`, `omega`, `eigenVectors`, `velocity` (0-1) |
| (all other props) | same as CrystalToolkitScene | No | same | Same prop contract as CrystalToolkitScene |

**Usage**

```jsx
<PhononAnimationScene
  debug={false}
  data={{
    app: 'phonon',
    name: 'phonon-scene',
    contents: [],
    omega: 0.0,
    phases: [0, 0],
    amplitude: 150,
    eigenVectors: [
      [
        [2.369e-7, 0],
        [-6.908e-7, 0],
        [-0.002, 0]
      ]
    ],
    velocity: 0.5
  }}
  sceneSize={400}
/>
```

**Variants/States:** Same control/export toggles as CrystalToolkitScene; animation driven automatically by phonon eigenmode data
**Composes:** Enlargeable, ButtonBar, Dropdown, Tooltip, ModalCloseButton, RangeSlider, internal Scene class (selects PhononAnimationHelper when `data.app === 'phonon'`), CameraContext
**External deps:** three.js, svgtodatauri, use-resize-observer, react-icons, react-tooltip, uuid

---

### DynamicCrystalToolkitScene

`src/components/crystal-toolkit/DynamicCrystalToolkitScene/DynamicCrystalToolkitScene.tsx`

A demo/utility wrapper that lets a user paste loosely-formatted JSON (unquoted keys/single quotes) into a textarea, cleans it into valid JSON, and renders it through `CrystalToolkitScene` on button click. Appears to be a developer/testing tool rather than a production-ready reusable component; **not exported from `src/index.ts`** and has no Storybook story.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| (none) | - | - | - | Takes no props; manages all state (textarea input, scene JSON, visibility) internally |

**Usage**

```jsx
<DynamicCrystalToolkitScene />
```

**Variants/States:** None found in code (fixed internal settings: `animation="none"`, `debug={false}`, `inletPadding={10}`, `inletSize={100}`, `sceneSize={400}`)
**Composes:** CrystalToolkitScene
**External deps:** None notable (native `JSON.parse` + regex cleanup)

---

### Download

`src/components/crystal-toolkit/Download/Download.tsx`

A headless (renders `null`) utility component that triggers a browser file download whenever its `data` prop changes, supporting plain text, base64-encoded, and data-URL content. Intended for Dash callback-driven "export this data as a file" patterns rather than any visible UI.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| id | string | Yes | - | Component id for Dash callbacks |
| data | `{filename, content, isBase64?, isDataURL?, mimeType?}` | No | - | When set/changed, triggers a download using a Blob built from `content` |
| isBase64 | boolean | No | `false` | Whether `data.content` is a base64 string (fallback if not in `data`) |
| isDataURL | boolean | No | - | Whether `data.content` is a data URL (fallback if not in `data`) |
| mimeType | string | No | `'text/plain'` | Default MIME type if not specified in `data.mimeType` |
| setProps | (value: any) => any | No | - | Dash-assigned callback |

**Usage**

```jsx
<Download
  id="download-1"
  data={{ filename: 'structure.cif', content: cifString, mimeType: 'chemical/x-cif' }}
/>
```

**Variants/States:** Content encoding: plain text (default), base64, data URL
**Composes:** None
**External deps:** base64-js (`toByteArray`)

---

### ReactGraphComponent

`src/components/crystal-toolkit/graph.component.tsx`

Renders linked/node-edge data as a force-directed network graph using `react-graph-vis` (a React wrapper around vis-network). Per the component's own JSDoc, this was experimental and is not currently used anywhere in the app, though it remains a public export.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| id | string | No | - | Component id for Dash callbacks |
| graph | `{nodes, edges}` | No | - | The graph data to display |
| options | object | No | - | Display options passed to the underlying vis-network graph |
| setProps | function | No | - | Dash-assigned callback |

**Usage**

```jsx
<ReactGraphComponent graph={GRAPH} options={DEFAULT_OPTIONS} />
```

**Variants/States:** None found in code
**Composes:** None
**External deps:** react-graph-vis (vis-network wrapper), prop-types

---

### Scene (scene/Scene.ts)

`src/components/crystal-toolkit/scene/Scene.ts`

**Not a React component** — a plain TypeScript/three.js class (`export default class Scene`) that imperatively manages the WebGL/SVG renderer, camera, controls (OrbitControls/TrackballControls), raycasting/click & tooltip handling, the axis inlet, animation loop, and scene-graph construction from JSON. Exported from `src/index.ts` as `Scene` for advanced/imperative use, but has no props, JSX, or React lifecycle — instantiated and driven directly by `CrystalToolkitScene`, `CrystalToolkitAnimationScene`, and `PhononAnimationScene`. Listed here for completeness only.

**Composes:** N/A — used internally by the three scene components; itself composes `ThreeBuilder`, `TooltipHelper`, `InsetHelper`, `DebugHelper`, `AnimationHelper`/`PhononAnimationHelper`, `ObjectRegistry`
**External deps:** three.js (WebGLRenderer, SVGRenderer, CSS2DRenderer, OrbitControls, TrackballControls, OutlineEffect, Raycaster, etc.)

---

### PeriodicTableSpacer

`src/components/periodic-table/PeriodicTable/PeriodicTableSpacer/PeriodicTableSpacer.tsx`

Renders the empty "gap" region of the periodic table grid (rows 1-3, columns 3-12) which optionally hosts a caller-supplied `plugin` element (e.g. mode switcher, filter) and always shows a "detailed" `PeriodicElement` panel for whichever element is currently hovered.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| plugin | JSX.Element | No | - | Custom component rendered in the spacer slot |
| disabled | boolean | No | - | When true (or no plugin given), renders empty placeholder spans instead of the plugin |

**Usage**

```jsx
<PeriodicTableSpacer
  plugin={
    <PeriodicTableModeSwitcher mode={mode} onSwitch={setMode} onFormulaButtonClick={handleClick} />
  }
/>
```

**Variants/States:** None found in code beyond `disabled` toggling plugin visibility
**Composes:** PeriodicElement; reads `useDetailedElement` from periodic-table-state/table-store.ts (requires `PeriodicContext` ancestor)
**External deps:** None notable

---

### PeriodicTablePluginWrapper

`src/components/periodic-table/PeriodicTablePluginWrapper/PeriodicTablePluginWrapper.tsx`

A minimal layout helper that places its children in either the "first-span" (upper) or "second-span" (lower) grid area of the periodic table spacer region, depending on the `upper` flag. Useful for composing custom plugin content into `PeriodicTableSpacer`.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| upper | boolean | No | - | If true, renders children in the upper ("first-span") slot; otherwise the lower ("second-span") slot |
| children | ReactNode | No | - | Content to place in the selected slot |

**Usage**

```jsx
<PeriodicTablePluginWrapper upper>
  <MyCustomFilterControl />
</PeriodicTablePluginWrapper>
```

**Variants/States:** `upper` true/false
**Composes:** None
**External deps:** None notable

---

## Form inputs

### CheckboxList

`src/components/data-entry/CheckboxList/CheckboxList.tsx`

A simple list of checkboxes rendered from an array of `{value, label}` options, tracking which options are checked and returning the array of checked values via `onChange`. Use for basic multi-select filter lists where a full `Select`/dropdown isn't needed.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| options | `{value: any, label: string\|number, checked?: boolean}[]` | Yes | - | List of checkbox options to render |
| values | any[] | No | - | Array of currently-checked option values (initializes/syncs checked state) |
| onChange | (value: any[]) => void | No | - | Called with the new array of checked values whenever a checkbox is toggled |

**Usage**

```jsx
<CheckboxList
  options={[
    { value: 'FM', label: 'Ferromagnetic' },
    { value: 'NM', label: 'Non-magnetic' }
  ]}
  values={['NM']}
  onChange={(values) => console.log(values)}
/>
```

**Variants/States:** None found in code (no size/theme/disabled props; each option's `checked` state is internal)
**Composes:** None
**External deps:** None notable

---

### DualRangeSlider

`src/components/data-entry/DualRangeSlider/DualRangeSlider.tsx`

A slider with two handles and two numeric text inputs for selecting a min/max range within a domain, supporting linear or logarithmic scales, custom step size, debounced input updates, and configurable tick marks. Use for numeric range filters (e.g. min/max property values).

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| domain | number[] | Yes | - | `[min, max]` possible values; rounded to "nice" tick-friendly bounds |
| value / valueMin / valueMax | number[] / number / number | No | - | Current lower/upper slider values |
| step | number | No | `1` | Increment for slider handle movement |
| isLogScale | boolean | No | `false` | Use a logarithmic scale (domain values treated as exponents, `10^x`) |
| debounce | number | No | `1000` (log) / `500` (linear) | Milliseconds to wait after typing before updating the slider |
| ticks | number \| null | No | `5` | Number of ticks (rounded to nearest 1/2/5/10 by D3); `null` hides ticks |
| inclusiveTickBounds | boolean | No | - | Show a "+" after the upper tick label to indicate an inclusive upper bound |
| onChange | (min: number, max: number) => void | No | `() => undefined` | Fired on final (committed) slider/value change |
| onPropsChange | (props: any) => void | No | `() => undefined` | Fired with the "nice" domain and values |
| className, id, setProps, styleInput, styleSlider | various | No | - | Standard styling/Dash-integration props |

**Usage**

```jsx
<DualRangeSlider domain={[0, 100]} step={1} value={[10, 50]} />
```

**Variants/States:** `isLogScale`, `ticks` (number or null), `debounce` (0 to disable), `inclusiveTickBounds`
**Composes:** Reuses `renderMark`/`renderThumb`/`renderTrack` helpers exported from `RangeSlider`, and shares `RangeSlider.css`
**External deps:** react-range (Range, getTrackBackground), d3, classnames

---

### FilterField

`src/components/data-entry/FilterField/FilterField.tsx`

A generic label/wrapper component for filter/input controls: renders a label with optional tooltip, unit suffix, "active" cancel-link behavior, and inline publication citation buttons (DOIs), wrapping arbitrary child input components (e.g. a `RangeSlider` or `Select`).

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| id | string | No | - | Element id, also used to build tooltip ids |
| className | string | No | - | Extra class(es) for outer wrapper |
| label | string | No | - | Label text shown above the filter |
| tooltip | string | No | - | Tooltip text shown on hovering the label |
| units | string | No | - | Units string appended to the label in parentheses |
| dois | string[] | No | `[]` | DOIs rendered as compact `PublicationButton` tags next to the label |
| active | boolean | No | - | Marks the filter as active, showing a cancel icon and making the label clickable |
| resetFilter | (id: any) => any | No | - | Called (with `id`) when the active label is clicked to reset the filter |
| styleLabel | object | No | - | Inline style for the label container |
| children | ReactNode | No | - | The actual input control(s) rendered below the label |

**Usage**

```jsx
<FilterField
  id="density"
  label="Density"
  units="g/cm³"
  tooltip="Filter by density"
  active={true}
  resetFilter={(id) => console.log('reset', id)}
>
  <RangeSlider domain={[0, 100]} step={1} value={10} />
</FilterField>
```

**Variants/States:** `active` (true/false, toggles cancel-icon + clickable label)
**Composes:** Tooltip, PublicationButton
**External deps:** react-icons (FaRegTimesCircle, FaToggleOn), classnames

---

### GlobalSearchBar

`src/components/data-entry/GlobalSearchBar/GlobalSearchBar.tsx`

A thin, pre-configured wrapper around `MaterialsInput` for top-level site search by mp-id, formula, or elements; on submit it builds a query string from the detected input type/value and navigates to `redirectRoute`. Intended for use as the primary search box in a site-wide search UI.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| redirectRoute | string | Yes | - | Base URL/route to navigate to on submit; input type/value appended as a query param |
| hidePeriodicTable | boolean | No | - | Passed through to `MaterialsInput` to hide the periodic table |
| autocompleteFormulaUrl | string | No | - | API endpoint for formula autocomplete suggestions |
| apiKey | string | No | - | API key sent with autocomplete requests |
| placeholder | string | No | - | Placeholder text for the input |

**Usage**

```jsx
<GlobalSearchBar
  redirectRoute="/materials"
  autocompleteFormulaUrl="https://api.materialsproject.org/materials/formula_autocomplete/"
  placeholder="Search materials..."
/>
```

**Variants/States:** Internally always uses `PeriodicTableMode.TOGGLE`; `hidePeriodicTable` is the only exposed display toggle
**Composes:** MaterialsInput (wraps/configures it entirely)
**External deps:** None notable (internal navigation util)

---

### MaterialsInput

`src/components/data-entry/MaterialsInput/MaterialsInput.tsx`

The flagship search-input component for Materials Project style queries: a text field that can dynamically detect/accept elements, chemical systems, formulas, mp-ids, SMILES, or plain text, two-way bound to an interactive periodic table, with optional type dropdown, submit button, label, help examples, and formula autocomplete. Use for any element/formula/composition-based search UI.

**Props** (see source for full prop list, 25+ total props)
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| value | string | No | `''` | Current/initial input value |
| type | `'elements'\|'chemical_system'\|'formula'\|'mpid'\|'smiles'\|'text'\|'molecule_formula'` | No | `elements` | Current/initial input type |
| allowedInputTypes | MaterialsInputType[] | No | `[type]` | Which types the component may auto-detect/allow |
| placeholder | string | No | - | Input placeholder text |
| errorMessage | string | No | `'Invalid input value'` | Message shown in the error tooltip for invalid input |
| debounce | number | No | - | Milliseconds to debounce the value before calling `onChange` |
| periodicTableMode | `'toggle'\|'focus'\|'none'` | No | - | Controls how/if the periodic table is shown |
| hidePeriodicTable | boolean | No | - | Alternative override to hide the table |
| showTypeDropdown | boolean | No | - | Show a dropdown to switch input type manually |
| showSubmitButton | boolean | No | - | Render a submit button (wraps field in a `<form>`) |
| submitButtonText | string | No | `'Search'` | Submit button label |
| label | string | No | - | Static label box on the left of the input |
| hideWildcardButton | boolean | No | - | Hides the wildcard "\*" button on the periodic table plugin |
| chemicalSystemSelectHelpText / elementsSelectHelpText | string | No | - | Markdown help text per periodic-table selection mode |
| maxElementSelectable | number | No | `20` | Max elements selectable in periodic table/input |
| helpItems | InputHelpItem[] | No | - | Example chips shown when input is empty & focused |
| autocompleteFormulaUrl / autocompleteApiKey | string | No | - | Formula-suggestion API endpoint/key |
| loading | boolean | No | - | Controlled loading state (disables submit) |
| onChange | (value: string) => any | No | `(value) => value` | Fires (debounced) on value change |
| onInputTypeChange | (type) => any | No | - | Fires when detected/selected type changes |
| onSubmit | (event, value?, filterProps?) => any | No | - | Fires on submit button click / form submit |
| onPropsChange | (propsObject: any) => void | No | - | Fires with the full updated props object |

**Usage**

```jsx
<MaterialsInput
  type={'elements'}
  allowedInputTypes={['elements', 'formula']}
  periodicTableMode={'toggle'}
  showSubmitButton={true}
  helpItems={[{ label: 'Search Help' }]}
  autocompleteFormulaUrl="https://api.materialsproject.org/materials/formula_autocomplete/"
  onSubmit={(e, value) => console.log(value)}
/>
```

**Variants/States:** `periodicTableMode` (toggle/focus/none), `showTypeDropdown`, `showSubmitButton`, `loading` (disables submit), error state (warning icon + tooltip), `helpItems` (example-chip help box)
**Composes:** MaterialsInputBox, PeriodicContext, SelectableTable, PeriodicTableModeSwitcher, Tooltip
**External deps:** react-aria-menubutton, uuid, classnames, react-icons

---

### MaterialsInputBox

`src/components/data-entry/MaterialsInput/MaterialsInputBox/MaterialsInputBox.tsx`

The internal text-input control used by `MaterialsInput`; handles raw keystrokes, detects/validates the input type, syncs value changes bidirectionally with the periodic-table context, and renders the `FormulaAutocomplete` and `InputHelp` popups beneath the field. Not typically used standalone outside `MaterialsInput`.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| value | string | Yes | - | Current input value |
| setValue | (value: string) => void | Yes | - | Setter to update the value in the parent |
| setError | (error: string \| null) => void | Yes | - | Setter to report validation errors upward |
| type, allowedInputTypes, placeholder, errorMessage, inputClassName, autocompleteFormulaUrl, autocompleteApiKey, helpItems, maxElementSelectable, showAutocomplete, setShowAutocomplete, onChange, onInputTypeChange, onSubmit | (inherited from MaterialsInput) | No | - | Drilled down from `MaterialsInput` |
| liftInputRef | (value: React.RefObject<HTMLInputElement>) => any | No | - | Exposes the internal `<input>` ref to the parent |
| onFocus / onBlur / onKeyDown | event handlers | No | - | Passed through to the raw `<input>` element |

**Usage**

```jsx
// Used internally by MaterialsInput; not intended for direct standalone use.
<MaterialsInputBox
  value={inputValue}
  type={inputType}
  allowedInputTypes={['elements', 'formula']}
  setValue={setInputValue}
  setError={setError}
/>
```

**Variants/States:** `showAutocomplete` (renders FormulaAutocomplete when formula type + URL provided); help box visibility toggled on focus/empty value
**Composes:** FormulaAutocomplete, InputHelp, Tooltip; uses `useElements` from periodic-table-state/table-store
**External deps:** classnames, uuid, react-icons (FaQuestionCircle)

---

### FormulaAutocomplete

`src/components/data-entry/MaterialsInput/FormulaAutocomplete/FormulaAutocomplete.tsx`

A dropdown menu that fetches and displays formula suggestions from a remote API as the user types a chemical formula, allowing the user to click a suggestion to fill the input and optionally submit. Used internally by `MaterialsInputBox`.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| value | string | Yes | - | Current formula input value used to trigger/format the API request |
| inputType | MaterialsInputType \| null | No | - | Only fetches suggestions when this equals `FORMULA` |
| apiEndpoint | string | Yes | - | URL to GET formula suggestions from (`?formula=...`) |
| apiKey | string | No | - | Sent as `X-Api-Key` header if provided |
| show | boolean | No | - | External control of visibility (still hidden if there are 0 suggestions) |
| onChange | (value: string) => void | No | - | Called with the clicked suggestion's formula |
| onSubmit | (e, value) => void | No | - | Called along with `onChange` when a suggestion is clicked, to auto-submit |
| setError | (value: any) => void | No | - | Called to clear error state when a suggestion is selected |

**Usage**

```jsx
<FormulaAutocomplete
  value="Fe2O"
  inputType={'formula'}
  apiEndpoint="https://api.materialsproject.org/materials/formula_autocomplete/"
  show={true}
  onChange={(formula) => console.log(formula)}
/>
```

**Variants/States:** `show` (true/false, further gated by whether suggestions exist)
**Composes:** None
**External deps:** axios, classnames

---

### InputHelp

`src/components/data-entry/MaterialsInput/InputHelp/InputHelp.tsx`

An interactive help menu rendered below `MaterialsInput`/`MaterialsInputBox` showing labeled groups of example input strings as clickable tag chips that populate the input when clicked. Used to guide users on valid input formats.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| items | `{label?: string\|null, examples?: string[]\|null}[]` | Yes | - | Groups of label + example chips to display |
| show | boolean | No | - | Whether the menu is visible |
| onChange | (value: string) => void | No | - | Called with the clicked example's text |

**Usage**

```jsx
<InputHelp
  items={[
    { label: 'Elements Examples' },
    { label: null, examples: ['Li,Fe', 'Li-Fe', 'Li-Fe-*-*'] }
  ]}
  show={true}
  onChange={(value) => console.log(value)}
/>
```

**Variants/States:** `show` (true/false)
**Composes:** None
**External deps:** None notable

---

### RangeSlider

`src/components/data-entry/RangeSlider/RangeSlider.tsx`

A single-handle slider with a numeric text input for selecting one value within a domain, supporting linear or logarithmic scale, custom step, debounced typing, and configurable tick marks. Use for single-value numeric filters (e.g. "minimum band gap").

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| domain | number[] | Yes | - | `[min, max]` possible values |
| value | number \| string | No | `domain[0]` | Current slider value |
| step | number | No | `1` | Increment for slider handle movement |
| isLogScale | boolean | No | `false` | Use logarithmic scale (domain treated as exponents) |
| debounce | number | No | `1000` (log) / `500` (linear) | Debounce delay (ms) before validating typed input |
| ticks | number \| null | No | `5` | Number of ticks; `null` disables tick rendering |
| inclusiveTickBounds | boolean | No | - | Adds a "+" to the last tick label |
| onChange | (values: number[]) => void | No | - | Fires on final committed slider change |
| className, id, setProps, styleInput, styleSlider | various | No | - | Standard styling/Dash-integration props |

**Usage**

```jsx
<RangeSlider domain={[0, 100]} step={1} value={10} />
```

**Variants/States:** `isLogScale`, `ticks` (number/null), `debounce` (0 to disable), `inclusiveTickBounds`; `no-ticks` CSS class applied automatically when ticks disabled
**Composes:** Exports `renderTrack`/`renderThumb`/`renderMark` helpers reused by `DualRangeSlider`
**External deps:** react-range (Range, getTrackBackground), d3, classnames

---

### Select

`src/components/data-entry/Select/Select.tsx`

A styled wrapper around `react-select` that normalizes value handling (accepts either a raw value or a full `{label, value}` option object), applies consistent class naming, and supports a Dash-style `setProps` callback. Use for any standard single/multi-select dropdown.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| options | `{label: string, value: any}[]` | Yes | - | Dropdown options |
| value | any | No | - | Current selected value — accepts raw value or full option object |
| onChange | (value: any) => any | No | - | Called with the selected option object (or react-select's value shape) |
| setProps | (value: any) => any | No | - | Dash-integration callback; called with `{value}` (raw value) on change |
| arbitraryProps | object | No | - | Extra props spread into the underlying react-select |
| `[id: string]` | any | No | - | Any other prop is passed through directly to react-select (e.g. `isClearable`, `isMulti`, `defaultValue`) |

**Usage**

```jsx
<Select
  isClearable={true}
  value="NM"
  options={[
    { label: 'Ferromagnetic', value: 'FM' },
    { label: 'Non-magnetic', value: 'NM' }
  ]}
/>
```

**Variants/States:** `is-open` CSS class toggled on menu open/close; any react-select prop (`isMulti`, `isClearable`, `isDisabled`) supported via pass-through
**Composes:** None (wraps external react-select)
**External deps:** react-select

---

### Switch

`src/components/data-entry/Switch/Switch.tsx`

A simple boolean on/off toggle rendered as a clickable icon (`FaToggleOn`/`FaToggleOff`) with an optional text label describing the current state. Use for simple boolean filters or settings.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| value | boolean | No | `false` | Current on/off value |
| hasLabel | boolean | No | - | Whether to show a text label next to the icon |
| truthyLabel | string | No | `'On'` | Label text when `value` is true |
| falsyLabel | string | No | `'Off'` | Label text when `value` is false |
| onChange | (value: boolean) => any | No | - | Called with the new boolean value on click |
| id, className, setProps | various | No | - | Standard id/class/Dash-integration props |

**Usage**

```jsx
<Switch
  value={false}
  hasLabel={true}
  truthyLabel="Enabled"
  falsyLabel="Disabled"
  onChange={(v) => console.log(v)}
/>
```

**Variants/States:** `value` (true/false, toggles icon), `hasLabel` (true/false)
**Composes:** None
**External deps:** react-icons (FaToggleOn, FaToggleOff)

---

### TextInput

`src/components/data-entry/TextInput/TextInput.tsx`

A minimal debounced text `<input>` wrapper that keeps local input state in sync with an external `value` prop and calls `onChange` after an optional debounce delay. Use for simple free-text filters/search fields that need debounced updates.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| value | any | Yes | - | Current/initial input value |
| onChange | (value: any) => any | Yes | - | Called with the (debounced) new value |
| debounce | number | No | - | Milliseconds to debounce before calling `onChange`; if omitted, updates immediately |

**Usage**

```jsx
<TextInput value={text} debounce={300} onChange={(value) => setText(value)} />
```

**Variants/States:** `debounce` (number to enable debounced updates, omitted for immediate updates)
**Composes:** None
**External deps:** None notable

---

### ThreeStateBooleanSelect

`src/components/data-entry/ThreeStateBooleanSelect/ThreeStateBooleanSelect.tsx`

A `Select` dropdown pre-configured for boolean filters that need a third "unset"/"Any" state in addition to true/false; automatically appends an `{label: 'Any', value: undefined}` option to the two supplied options. Use for tri-state boolean filters (e.g. "Is Theoretical: Yes / No / Any").

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| options | `{label, value}[]` | Yes | - | Exactly two options — one for `true`, one for `false` (a third "Any" option is added automatically) |
| value | boolean | No | - | Current selected value: `true`, `false`, or `undefined` (maps to "Any") |
| onChange | (value: any) => any | No | - | Called with the selected option's value |

**Usage**

```jsx
<ThreeStateBooleanSelect
  value={true}
  options={[
    { label: 'Yes', value: true },
    { label: 'No', value: false }
  ]}
/>
```

**Variants/States:** Implicit third state "Any" (`value: undefined`) always appended alongside the two provided true/false options
**Composes:** Select
**External deps:** None notable (delegates to Select)

---

### SelectableTable

`src/components/periodic-table/table-state.tsx`

A stateful wrapper around the internal `Table` component that manages element selection/enable/disable state via the periodic-table Rx-based store. This is the main public component for letting users select chemical elements interactively (must be rendered inside a `PeriodicContext`). Exported from `src/index.ts`.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| className | string | No | - | CSS class applied to the container |
| enabledElements | string[] | No | - | Element symbols to mark enabled, e.g. `['H', 'O']` |
| disabledElements | string[] | No | - | Element symbols to mark disabled |
| hiddenElements | string[] | No | - | Element symbols to hide |
| maxElementSelectable | number | Yes | - | Maximum number of elements a user may select |
| onStateChange | (selected: string[]) => void | No | - | Callback fired with the array of selected elements |
| forceTableLayout | TableLayout | No | - | Forces a specific table layout (`spaced`, `compact`, `small`, `map`) |
| forwardOuterChange | boolean | No | - | Whether to forward non-managed (external) changes |
| plugin | JSX.Element | No | - | Component injected into the top spacer area |
| children | any | No | - | Passed through, generally unused directly |
| disabled | boolean | No | - | Disables the whole table (all elements) |

**Usage**

```jsx
<PeriodicContext>
  <SelectableTable
    forceTableLayout={TableLayout.MINI}
    className="max-750"
    maxElementSelectable={5}
    onStateChange={(selected) => console.log(selected)}
  />
</PeriodicContext>
```

**Variants/States:** `forceTableLayout`: SPACED/COMPACT/MINI/MAP; `disabled` toggles disabling all elements
**Composes:** Table (periodic-table.component.tsx); relies on `useElements` from periodic-table-state/table-store.ts (requires ancestor `PeriodicContext`)
**External deps:** None notable (underlying store uses rxjs)

---

### StandalonePeriodicComponent

`src/components/periodic-table/periodic-element/standalone-periodic-component.tsx`

A sizeable, self-contained wrapper around a single `PeriodicElement` button, useful for displaying one element (e.g. in a legend, tooltip, or list) outside of the full periodic table grid and without needing table state/context. Exported from `src/index.ts`.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| size | number | Yes | - | Width and height (px) of the wrapper element |
| disabled | boolean | Yes | - | Whether the element is disabled (still visible) |
| enabled | boolean | Yes | - | Whether the element is selected/enabled |
| hidden | boolean | Yes | - | Whether the element is hidden (still visible) |
| color | string | No | - | Background color override |
| element | MatElement \| string | Yes | - | The element to render — symbol string or full data object |
| displayMode | `SIMPLE\|DETAILED` | No | `SIMPLE` | Simple (number/symbol/name) or detailed (adds weight, shells) |
| onElementClicked | (e) => void | No | no-op | Click callback |
| onElementMouseOver | (e) => void | No | no-op | Mouse-over callback |
| onElementMouseLeave | (e) => void | No | no-op | Mouse-leave callback |

**Usage**

```jsx
<StandalonePeriodicComponent
  size={64}
  element="H"
  enabled={false}
  disabled={false}
  hidden={false}
  displayMode={DISPLAY_MODE.DETAILED}
/>
```

**Variants/States:** `displayMode`: SIMPLE/DETAILED; visual states enabled/disabled/hidden
**Composes:** PeriodicElement
**External deps:** None notable

---

### PeriodicContext

`src/components/periodic-table/periodic-table-state/periodic-selection-context.tsx`

A React Context Provider that instantiates and owns the shared RxJS-backed periodic-table selection store (enabled/disabled/hidden elements, detailed hover element). Must wrap `SelectableTable`/`TableFilter` (or other consumers of the store hooks). Exported from `src/index.ts`.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| enabledElements | string[] \| `{[symbol]: boolean}` | No | `{}` | Initial/controlled set of enabled elements |
| disabledElements | string[] \| `{[symbol]: boolean}` | No | `{}` | Initial/controlled set of disabled elements |
| hiddenElements | string[] \| `{[symbol]: boolean}` | No | `{}` | Initial/controlled set of hidden elements |
| forwardOuterChange | boolean | No | - | Whether external changes should be forwarded via `onStateChange` |
| detailedElement | string | No | - | Initial symbol shown in "detailed" hover panel |
| children | ReactNode | No | - | Child components (e.g. SelectableTable, TableFilter) |

**Usage**

```jsx
<PeriodicContext>
  <SelectableTable maxElementSelectable={5} onStateChange={handleChange} />
</PeriodicContext>
```

**Variants/States:** None found in code (purely a state provider)
**Composes:** Wraps `PeriodicSelectionContext.Provider`
**External deps:** rxjs (indirectly, via the store)

---

### TableFilter

`src/components/periodic-table/periodic-filter/table-filter.tsx`

Renders a two-tier category/sub-category filter UI (e.g. Metals > Alkali, Nonmetals > Halogens) that hides non-matching elements by dispatching `setHiddenElements` on the shared `PeriodicSelectionContext` store. Must be used within a `PeriodicContext` alongside a table component. Exported from `src/index.ts`.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| (none) | - | - | - | Takes no props; all state is internal plus the ambient PeriodicSelectionContext |

**Usage**

```jsx
<PeriodicContext>
  <TableFilter />
  <SelectableTable maxElementSelectable={5} />
</PeriodicContext>
```

**Variants/States:** Filter categories defined in `filter-definitions.ts` (All, Metals, Nonmetals, Gases/Liquids/Solids, etc.)
**Composes:** None (reads/writes PeriodicSelectionContext directly)
**External deps:** None notable

---

### Table (periodic-table.component)

`src/components/periodic-table/periodic-table-component/periodic-table.component.tsx`

Internal, presentational-but-stateful component that renders the full grid of `PeriodicElement`s with responsive layout detection (desktop/tablet/mobile via `react-responsive`), optional d3-based heatmap coloring with a legend, and a `PeriodicTableSpacer` plugin slot. It is the core rendering engine composed by `SelectableTable` (not itself exported from the library's public index, but directly importable).

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| className | string | No | - | Extra class on the outer container |
| disabledElement | `{[symbol]: boolean}` | Yes | - | Dictionary of disabled element symbols |
| enabledElement | `{[symbol]: boolean}` | Yes | - | Dictionary of enabled element symbols |
| hiddenElement | `{[symbol]: boolean}` | Yes | - | Dictionary of hidden element symbols |
| onElementClicked | (mat) => void | Yes | - | Click callback |
| onElementMouseOver | (mat) => void | Yes | - | Hover callback |
| onElementMouseLeave | (mat) => void | No | no-op | Mouse-leave callback |
| forceTableLayout | TableLayout | No | auto (media-query based) | Forces layout instead of responsive detection |
| heatmap | `{[id]: number}` | No | - | Values per element symbol used to colorize a heatmap |
| colorScheme | keyof COLORSCHEME | No | - | Viridis, Turbo, CubeHelix, Cividis, Inferno, Blues, Oranges, Greens, Reds, Purples |
| heatmapMax / heatmapMin | string | No | - | Colors bounding a linear scale when no named colorScheme matches |
| showSwitcher | boolean | No | - | Largely vestigial (see commented code) |
| plugin | JSX.Element | No | - | Component injected in the spacer region |
| selectorWidget | any | No | - | unclear from code, verify in Storybook/tests |
| disabled | boolean | No | - | Disables all elements |

**Usage**

```jsx
<Table
  disabledElement={{}}
  enabledElement={{ H: true }}
  hiddenElement={{}}
  onElementClicked={(el) => console.log(el)}
  onElementMouseOver={(el) => console.log(el)}
  forceTableLayout={TableLayout.SPACED}
/>
```

**Variants/States:** `TableLayout`: SPACED/COMPACT/MINI/MAP; heatmap color schemes; `disabled` state
**Composes:** PeriodicElement, PeriodicTableSpacer
**External deps:** d3-array, d3-scale, d3-scale-chromatic, react-responsive, classnames

---

### PeriodicElement

`src/components/periodic-table/periodic-element/periodic-element.component.tsx`

The lowest-level building block: renders a single clickable element `<button>` (or group placeholder) showing number/symbol (simple mode) or number/symbol/name/weight/shells (detailed mode), with enabled/disabled/hidden styling. Used internally by both `Table` and `StandalonePeriodicComponent`.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| disabled | boolean | Yes | - | Whether the element is disabled (still visible, non-clickable) |
| enabled | boolean | Yes | - | Whether the element is selected |
| hidden | boolean | Yes | - | Whether the element is hidden (still occupies space) |
| color | string | No | - | Background color override (e.g. heatmap) |
| element | MatElement \| string | Yes | - | Element symbol string or full data object |
| displayMode | `SIMPLE\|DETAILED` | No | `SIMPLE` | Simple or detailed rendering |
| onElementClicked | (e) => void | No | no-op | Click handler (skipped for group placeholders) |
| onElementMouseOver | (e) => void | No | no-op | Hover handler |
| onElementMouseLeave | (e) => void | No | no-op | Mouse-leave handler |

**Usage**

```jsx
<PeriodicElement
  element="Fe"
  enabled={false}
  disabled={false}
  hidden={false}
  displayMode={DISPLAY_MODE.SIMPLE}
  onElementClicked={(el) => console.log(el.symbol)}
/>
```

**Variants/States:** SIMPLE/DETAILED display mode; enabled/disabled/hidden states; special "group" placeholder for lanthanide/actinoid range cells
**Composes:** None (leaf component)
**External deps:** None notable

---

### PeriodicTableFormulaButtons

`src/components/periodic-table/PeriodicTableFormulaButtons/PeriodicTableFormulaButtons.tsx`

Renders a row of numeric digit buttons (0-9), parentheses, and an optional wildcard (`*`) button styled like periodic-table element cells — used for building chemical formula strings in conjunction with `PeriodicTableModeSwitcher`.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| onClick | (value: string) => any | Yes | - | Called with the clicked button's value (digit, `(`, `)`, or `*`) |
| hideWildcardButton | boolean | No | `false` | Hides the wildcard (`*`) button and its tooltip |

**Usage**

```jsx
<PeriodicTableFormulaButtons
  onClick={(value) => appendToFormula(value)}
  hideWildcardButton={false}
/>
```

**Variants/States:** `hideWildcardButton` true/false
**Composes:** Tooltip
**External deps:** react-icons (FaAsterisk)

---

### PeriodicTableModeSwitcher

`src/components/periodic-table/PeriodicTableModeSwitcher/PeriodicTableModeSwitcher.tsx`

A tabbed/dropdown control letting users switch between periodic-table selection modes — Formula, "At Least Elements", "Only Elements" (chemical system) — and conditionally renders the formula digit buttons or contextual help text (Markdown) based on the active mode. Used as the `plugin` passed into `SelectableTable`/`PeriodicTableSpacer` inside `MaterialsInput`.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| mode | PeriodicTableSelectionMode | Yes | - | Currently active mode |
| allowedModes | PeriodicTableSelectionMode[] | No | `['Formula', 'At Least Elements', 'Only Elements']` | Which modes appear as selectable tabs/menu items |
| hideWildcardButton | boolean | No | - | Passed through to PeriodicTableFormulaButtons |
| chemicalSystemSelectHelpText | string | No | - | Markdown help text shown in CHEMICAL_SYSTEM mode |
| elementsSelectHelpText | string | No | - | Markdown help text shown in ELEMENTS mode |
| onSwitch | (mode) => any | Yes | - | Called when the user picks a different mode |
| onFormulaButtonClick | (value: string) => any | Yes | - | Called with formula-button/wildcard value clicked |

**Usage**

```jsx
<PeriodicTableModeSwitcher
  mode={PeriodicTableSelectionMode.FORMULA}
  onSwitch={(m) => setMode(m)}
  onFormulaButtonClick={(v) => appendToFormula(v)}
/>
```

**Variants/States:** `PeriodicTableSelectionMode`: CHEMICAL_SYSTEM/ELEMENTS/FORMULA; also has both a tabs selector UI and a dropdown menu UI
**Composes:** PeriodicTableFormulaButtons, Tooltip, Markdown
**External deps:** react-aria-menubutton, react-icons, classnames

---

## Navigation

### Dropdown

`src/components/navigation/Dropdown/Dropdown.tsx`

A generic dropdown menu built on `react-aria-menubutton` that renders a trigger button and a list of items/children for display or navigation purposes (explicitly not intended for option-selection or non-link actions).

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| id | string | No | - | ID used to identify this component in Dash callbacks |
| setProps | (value: any) => any | No | - | Dash-assigned callback fired when properties change |
| className | string | No | - | Class name(s) to append to the default class (`dropdown`) |
| triggerLabel | string | No | - | Text displayed in the button that triggers the dropdown |
| triggerClassName | string | No | `'button'` | Class name(s) applied to the trigger button |
| triggerIcon | string \| ReactNode | No | - | Icon to display to the left of the trigger label |
| items | React.ReactNode[] | No | `[]` | List of strings/nodes to display inside the dropdown menu |
| isArrowless | boolean | No | - | Removes the arrow to the right of the trigger label |
| isUp | boolean | No | - | Makes the dropdown menu open upwards |
| isRight | boolean | No | - | Aligns the dropdown menu with the right of the trigger |
| closeOnSelection | boolean | No | `true` | Set false to keep the menu open when an item is clicked |
| children | ReactNode | No | - | Components to use as dropdown items instead of `items` |

**Usage**

```jsx
<Dropdown items={['One', 'Two', 'Three']} triggerLabel="Items" />
```

**Variants/States:** `isUp` (open direction), `isRight` (alignment), `isArrowless`, `closeOnSelection`
**Composes:** None (uses react-aria-menubutton primitives directly)
**External deps:** react-aria-menubutton, react-icons (FaAngleDown/FaAngleUp), classnames

---

### Link

`src/components/navigation/Link/Link.tsx`

A Dash-compatible anchor/link component (adapted from `dash-core-components`) that intercepts clicks to update the browser location via `pushState` instead of a full page reload, with an option to preserve existing query parameters; not compatible with react-router.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| children | ReactNode | Yes | - | Content of the link |
| href | string | Yes | - | URL of the linked resource |
| target | string | No | - | Where to open the link reference |
| refresh | boolean | No | - | If true, does a full page reload instead of pushState navigation |
| title | string | No | - | Title attribute for supplementary info |
| className | string | No | - | CSS class name(s) |
| style | object | No | - | Inline CSS style overrides |
| id | string | No | - | ID used to identify the component in Dash callbacks |
| loading_state | any | No | - | Loading state object from dash-renderer |
| preserveQuery | boolean | No | - | If true, keeps current query parameters when following the link |

**Usage**

```jsx
<Link href="/page">Link to page</Link>
```

**Variants/States:** `preserveQuery` (true/false), `refresh` (true/false, full reload vs SPA navigation)
**Composes:** None
**External deps:** None notable (uses native DOM/window APIs; polyfills CustomEvent for IE)

---

### Navbar

`src/components/navigation/Navbar/Navbar.tsx`

A top-level responsive navigation bar with a brand item, a list of navigation items (which can be plain links or nested dropdowns), a mobile burger-menu/collapsible variant, and a slot (`children`) for arbitrary components like a notification dropdown.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| id | string | No | - | ID for the root `<nav>` element |
| className | string | No | - | Additional class name(s) for the navbar |
| items | NavbarItem[] | Yes | `[]` | List of navbar items; items with an `items` array render as `NavbarDropdown` |
| brandItem | NavbarItem | Yes | - | Item rendered as the navbar brand/logo/link |
| children | ReactNode | No | - | Extra component(s) rendered at the end of the navbar (e.g. a notification dropdown) |

`NavbarItem` fields (used within `items`/`brandItem`): `className`, `label`, `href`, `target`, `icon`, `image`, `isDivider`, `isMenuLabel`, `items` (nested), `isArrowless`, `isRight`, `isActiveOnClick`, `isModal`, `id`, `header`, `content`, `refresh`.

**Usage**

```jsx
<Navbar
  brandItem={{ label: 'MP React', href: '/materials' }}
  items={[
    { label: 'Materials', href: '/materials' },
    {
      label: 'More',
      isRight: true,
      items: [
        { label: 'Other Pages', isMenuLabel: true },
        { label: 'Publications', href: '/publications' }
      ]
    }
  ]}
/>
```

**Variants/States:** Mobile burger menu (toggled via FaBars/FaTimes); item-level `isRight`, `isArrowless`, `isActiveOnClick`, `isModal`, `isDivider`, `isMenuLabel`
**Composes:** Link, NavbarDropdown
**External deps:** react-collapsible (mobile nested menu), react-icons (FaBars/FaTimes), classnames

---

### NavbarDropdown

`src/components/navigation/NavbarDropdown/NavbarDropdown.tsx`

A dropdown submenu used inside `Navbar` for items that have nested `items`; supports hover-to-open (default), click-to-open (`isActiveOnClick`), and a modal-per-item mode (`isModal`) that opens a `Modal` panel instead of navigating.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| className | string | No | - | Class name for the wrapping navbar-item |
| items | NavbarItem[] | Yes | `[]` | Nested items to render in the dropdown |
| isArrowless | boolean | No | - | Hides the dropdown arrow on the trigger link |
| isRight | boolean | No | - | Aligns the dropdown menu to the right |
| isActiveOnClick | boolean | No | - | Opens the dropdown on click instead of hover |
| isModal | boolean | No | - | Renders each item as a trigger that opens a `Modal` with `header`/`content` instead of a link |
| displayDot | boolean | No | - | Declared but unused in render logic — unclear from code, verify in Storybook/tests |
| children | ReactNode | No | - | Content of the trigger link (label/icon) |

**Usage**

```jsx
<NavbarDropdown items={[{ label: 'Publications', href: '/publications' }]} isRight>
  More
</NavbarDropdown>
```

**Variants/States:** hover-open (default) vs `isActiveOnClick` vs `isModal`; `isRight`; `isArrowless`; item-level `isDivider`/`isMenuLabel`
**Composes:** Link, Modal, ModalContextProvider, ModalTrigger
**External deps:** None notable (has a likely unintended import of `IsArrowless` from a Storybook story file — see overlap notes)

---

### NotificationDropdown

`src/components/navigation/NotificationDropdown/NotificationDropdown.tsx`

A bell-icon navbar dropdown for displaying a list of notifications/messages, tracking read/unread state per item, showing an unread badge dot on the bell, and opening each notification's detail in a `Modal` (rendered via `ReactMarkdown`); closes when clicking outside.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| className | string | No | - | Class name for the wrapping element |
| id | string | No | - | ID of the component |
| notifyLevel | string | No | - | When `'Message'`/`'message'`, enables per-item read/unread tracking |
| hasUnread | boolean | No | `false` | Initial state for whether there are unread notifications (drives bell badge) |
| isHidden | boolean | No | - | If true, renders an empty `<div>` instead of the dropdown |
| items | NotificationItem[] | Yes | `[]` | List of notification items to display |
| isRight | boolean | No | - | Aligns dropdown to the right |
| isModal | boolean | No | - | Declared but unclear from code how it changes rendering |
| link | string | No | - | href for the "More" link at the bottom of the dropdown |

**Usage**

```jsx
<NotificationDropdown
  items={[{ id: '1', header: 'New result', content: 'Your job finished.' }]}
  link="/notifications"
/>
```

**Variants/States:** `isHidden`, `hasUnread`/badge dot, `notifyLevel` (toggles read-tracking behavior), `isRight`, `isModal`
**Composes:** Bell, Modal, ModalContextProvider, ModalTrigger
**External deps:** react-markdown (renders notification content as Markdown)

---

### Bell

`src/components/navigation/NotificationDropdown/Bell.tsx`

A small presentational icon subcomponent rendering a Font Awesome bell icon, optionally stacked with a badge dot or a numbered badge to indicate unread notifications; used internally by `NotificationDropdown` but exported separately.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| className | string | No | - | Extra class name(s) applied to the bell `<i>` icon |
| showBadge | boolean | No | - | Shows a badge (dot or number) stacked on the bell |
| showNumber | boolean | No | - | With `showBadge`, shows `badgeNumber` instead of a plain dot |
| badgeNumber | string | No | - | Number/text to display in the badge when `showNumber` is true |

**Usage**

```jsx
<Bell showBadge showNumber badgeNumber="3" />
```

**Variants/States:** no badge (default) / badge dot / numbered badge
**Composes:** None
**External deps:** Font Awesome CSS classes (`fa`, `fa-stack`, `fa-bell`)

---

### Scrollspy

`src/components/navigation/Scrollspy/Scrollspy.tsx`

Builds an in-page table-of-contents/menu (with optional nested sub-items) from a `menuGroups` array and highlights the link corresponding to the section currently scrolled into view, using a window scroll listener and `getBoundingClientRect`.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| menuGroups | MenuGroup[] | Yes | - | Groups of menu items; each item has a `label` and `targetId`, and optional nested `items` |
| activeClassName | string | Yes | `'is-active'` | Class name applied to the active link |
| menuClassName | string | No | `'menu'` | Class name applied to the outer `<aside>` |
| menuGroupLabelClassName | string | No | `'menu-label'` | Class name applied to each group's label `<p>` |
| menuItemContainerClassName | string | No | `'menu-list'` | Class name applied to each `<ul>` of items |
| menuItemClassName | string | No | `''` | Class name applied to each `<li>` |
| offset | number | No | `-20` | Scroll offset (px) from an item that triggers it becoming active |

**Usage**

```jsx
<Scrollspy
  menuGroups={[
    {
      label: 'Table of Contents',
      items: [
        { label: 'Crystal Structure', targetId: 'one' },
        { label: 'Properties', targetId: 'two', items: [{ label: 'Prop One', targetId: 'three' }] }
      ]
    }
  ]}
  menuClassName="menu"
  menuItemContainerClassName="menu-list"
  activeClassName="is-active"
/>
```

**Variants/States:** None found in code beyond styling class overrides
**Composes:** None
**External deps:** None notable (native DOM scroll listener + getBoundingClientRect)

---

### Sidebar

`src/components/navigation/Sidebar/Sidebar.tsx`

An application-switcher sidebar (hardcoded list of Materials Project "apps" such as Explore, Analyze, Characterize, Design, Apply) that renders horizontally or vertically and shows a hoverable tooltip flyout of sub-apps for the currently hovered/selected app.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| width | number | No | - | Sidebar width in px (used when `layout === 'vertical'`) |
| height | number | No | - | Sidebar height in px (used when `layout === 'horizontal'`) |
| onAppSelected | (appId: string) => void | Yes | - | Callback fired when a sub-app is selected |
| currentApp | string | Yes | - | ID of the currently active app/sub-app, used to highlight state |
| layout | `'horizontal'\|'vertical'` | Yes | - | Controls sidebar orientation and tooltip placement |

**Usage**

```jsx
<Sidebar
  layout="vertical"
  width={80}
  currentApp="mat-explore"
  onAppSelected={(appId) => console.log(appId)}
/>
```

**Variants/States:** `layout`: vertical vs horizontal (affects dimension prop used and tooltip placement)
**Composes:** None
**External deps:** react-tooltip (flyout submenu), react-icons/ai; note: app data (`mainApps`) is hardcoded/domain-specific to Materials Project, reducing generic reusability

---

### Tabs

`src/components/navigation/Tabs/Tabs.tsx`

A labeled-tabs component wrapping `react-tabs`, adapted to be Dash-friendly: it exposes/syncs the active `tabIndex` via `setProps` for use in Dash callbacks, and lazily renders each tab's content only once activated, keeping it mounted (hidden via CSS) afterward for state preservation.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| id | string | No | - | ID used to identify this component in Dash callbacks |
| setProps | (value: any) => any | No | `() => null` | Dash-assigned callback invoked with updated `tabIndex` |
| className | string | No | - | Class name applied to the top-level wrapper (in addition to `mpc-tabs`) |
| children | ReactNode | Yes | - | Content for each tab; order must correspond to `labels` |
| labels | string[] | Yes | - | Labels for each tab; length must equal number of children |
| tabIndex | number | No | `0` | Current/default active tab index; can be changed externally |
| arbitraryProps | object | No | - | Arbitrary extra props passed through to the underlying react-tabs component |

**Usage**

```jsx
<Tabs labels={['One', 'Two']}>
  <div>Content for tab one</div>
  <div>Content for tab two</div>
</Tabs>
```

**Variants/States:** Active tab index (controlled/uncontrolled via `setProps`); tab content caching state (not-yet-activated / activated-visible / activated-hidden)
**Composes:** None
**External deps:** react-tabs, classnames

---

## Overlays/Feedback

### Drawer

`src/components/data-display/Drawer/Drawer.tsx`

Renders a right-side sliding drawer panel that becomes active/visible when its `id` matches the currently active drawer stored in the surrounding `DrawerContextProvider`. Must be paired with a `DrawerTrigger` sharing the same `id`/`forDrawerId`.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| id | string | Yes | - | Unique id; matched against the context's `activeDrawer` |
| className | string | No | - | Extra class name |
| setProps | (value: any) => any | No | - | Dash prop-change callback |

**Usage**

```jsx
<DrawerContextProvider>
  <DrawerTrigger forDrawerId="drawer-1">
    <button className="button">Drawer 1</button>
  </DrawerTrigger>
  <Drawer id="drawer-1">
    <h2>Drawer Content</h2>
  </Drawer>
</DrawerContextProvider>
```

**Variants/States:** Active (`is-active`) vs inactive, based on `activeDrawer === id`
**Composes:** ModalCloseButton, DrawerContextProvider (`useDrawerContext`)
**External deps:** classnames

---

### DrawerContextProvider

`src/components/data-display/Drawer/DrawerContextProvider.tsx`

A React context provider (not a visible UI element) that tracks which `Drawer` (by id) is currently active/open, exposed via the `useDrawerContext` hook to `Drawer` and `DrawerTrigger` children.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| children | ReactNode | No | - | Must wrap one or more `DrawerTrigger`/`Drawer` pairs |

**Usage**

```jsx
<DrawerContextProvider>{/* DrawerTrigger and Drawer components go here */}</DrawerContextProvider>
```

**Variants/States:** Internal state: `activeDrawer: string | null`
**Composes:** None directly (provides context consumed by Drawer/DrawerTrigger)
**External deps:** None notable

---

### DrawerTrigger

`src/components/data-display/Drawer/DrawerTrigger.tsx`

A clickable `<span>` wrapper that toggles open/closed the `Drawer` in the same `DrawerContextProvider` whose `id` matches `forDrawerId`.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| id | string | No | - | Component id for Dash callbacks |
| className | string | No | - | Extra class name (added to `mpc-drawer-trigger`) |
| setProps | (value: any) => any | No | - | Dash prop-change callback |
| forDrawerId | string | Yes | - | Id of the `Drawer` this trigger opens/closes |

**Usage**

```jsx
<DrawerTrigger forDrawerId="drawer-1">
  <button className="button">Open Drawer</button>
</DrawerTrigger>
```

**Variants/States:** None found in code (toggles the shared `activeDrawer` context state)
**Composes:** DrawerContextProvider (`useDrawerContext`)
**External deps:** None notable

---

### Enlargeable

`src/components/data-display/Enlargeable/Enlargeable.tsx`

Wraps arbitrary content/children so it can be expanded into a full-screen Bulma modal via a corner expand/compress button. State can be self-managed or controlled from outside via `expanded`/`setExpanded` props.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| id | string | No | - | Component id for Dash callbacks |
| setProps | (value: any) => any | No | - | Dash prop-change callback |
| className | string | No | `''` | Extra class name applied to the content wrapper |
| expanded | boolean | No | - | Controlled expanded state (requires `setExpanded` too) |
| setExpanded | Dispatch<SetStateAction<boolean>> | No | - | Setter for controlled expanded state |
| hideButton | boolean | No | - | Hide the built-in expand/compress button |

**Usage**

```jsx
<Enlargeable>
  <img src="large-structure.png" />
</Enlargeable>
```

**Variants/States:** Expanded (full-screen modal) vs collapsed (inline); self-managed or externally controlled; `hideButton` toggle
**Composes:** None
**External deps:** classnames, react-icons (FaCompress/FaExpand)

---

### Modal

`src/components/data-display/Modal/Modal.tsx`

Renders a Bulma modal whose visibility is driven by its enclosing `ModalContextProvider`. Displays a close ("x") button unless `forceAction` is set on the context, in which case the modal can only be closed programmatically.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| id | string | No | - | Component id for Dash callbacks |
| className | string | No | - | Extra class applied to the modal-content div |
| setProps | (value: any) => any | No | - | Dash prop-change callback |

**Usage**

```jsx
<ModalContextProvider>
  <ModalTrigger>
    <button className="button">Open Modal</button>
  </ModalTrigger>
  <Modal>
    <div className="panel">
      <div className="panel-heading">Panel</div>
      <div className="panel-block p-5">content</div>
    </div>
  </Modal>
</ModalContextProvider>
```

**Variants/States:** Active/inactive (`is-active` class, from context); `forceAction` mode hides close button and disables background-click-to-close
**Composes:** ModalCloseButton, ModalContextProvider (`useModalContext`)
**External deps:** None notable

---

### ModalContextProvider

`src/components/data-display/Modal/ModalContextProvider.tsx`

Context provider (non-visual) that tracks a modal's `active` and `forceAction` state, syncing `active` back out via `setProps` (for Dash) and supporting externally-controlled `active`/`forceAction` props. Also clips document scrolling while the modal is active.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| setProps | (value: any) => any | No | `() => null` | Dash prop-change callback, called with `{active}` |
| active | boolean | No | `false` | Current/default open state; can be changed from outside (e.g. Dash callback) |
| forceAction | boolean | No | `false` | Prevents modal from closing without an explicit in-modal action |

**Usage**

```jsx
<ModalContextProvider active={isOpen} forceAction>
  {/* ModalTrigger and Modal children */}
</ModalContextProvider>
```

**Variants/States:** `active` true/false; `forceAction` true/false
**Composes:** None directly (provides context consumed by Modal/ModalTrigger)
**External deps:** None notable

---

### ModalTrigger

`src/components/data-display/Modal/ModalTrigger.tsx`

A clickable `<span>` that toggles the `active` state of the enclosing `ModalContextProvider`, thereby opening/closing the paired `Modal`.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| id | string | No | - | Component id for Dash callbacks |
| className | string | No | - | Extra class (added to `mpc-modal-trigger`) |
| setProps | (value: any) => any | No | - | Dash prop-change callback |

**Usage**

```jsx
<ModalTrigger>
  <button className="button">Open Modal</button>
</ModalTrigger>
```

**Variants/States:** None found in code (toggles shared `active` context state)
**Composes:** ModalContextProvider (`useModalContext`)
**External deps:** None notable

---

### ModalCloseButton

`src/components/data-display/Modal/ModalCloseButton/ModalCloseButton.tsx`

A small "x" close button (Bulma `modal-close` style) rendered in the top-right of `Modal` and `Drawer`.

**Props**
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| id | string | No | - | Component id for Dash callbacks |
| className | string | No | - | Extra class (added to `mpc-modal-close modal-close`) |
| setProps | (value: any) => any | No | - | Dash prop-change callback |
| onClick | () => any | No | - | Handler invoked on click (typically closes the parent modal/drawer) |

**Usage**

```jsx
<ModalCloseButton onClick={() => setActive(false)} />
```

**Variants/States:** None found in code
**Composes:** None
**External deps:** None notable

---

### Tooltip

`src/components/data-display/Tooltip/Tooltip.tsx`

A thin wrapper around `react-tooltip` for showing hover tooltips. Must be paired with a trigger element carrying `data-tip` and `data-for={tooltipId}` attributes.

**Props** (see source for full prop list, ~16 total props, mostly passed straight through to react-tooltip)
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| id | string | No | - | Tooltip id, matched by trigger's `data-for` |
| children | ReactNode | No | - | Tooltip content |
| place | Place | No | `'top'` | Tooltip position |
| effect | Effect | No | `'solid'` | `'solid'` or `'float'` (follows mouse) |
| event / eventOff / globalEventOff | string | No | - | Custom show/hide trigger events |
| offset | object | No | - | Pixel offsets (left/right/top/bottom) |
| multiline | boolean | No | `true` | Wraps content in a fixed-width, normal-whitespace div |
| html | boolean | No | - | Allow HTML content |
| delayShow / delayHide | number | No | `350` / - | Show/hide delay in ms |
| border | boolean | No | - | 1px white border |
| disable | boolean | No | - | Disable tooltip behavior |
| scrollHide | boolean | No | - (react-tooltip default `true`) | Hide tooltip on scroll |
| clickable | boolean | No | - | Allow mouse/touch interaction with the tooltip itself |

**Usage**

```jsx
<button className="button" data-tip data-for="tooltip-1">Hover me</button>
<Tooltip id="tooltip-1">This is a solid tooltip</Tooltip>
```

**Variants/States:** `effect`: solid/float; `multiline` on/off; `disable` on/off
**Composes:** None
**External deps:** react-tooltip

---

## Potential Overlaps

**Overlays**

- **Modal vs Drawer vs Enlargeable** — three separate overlay mechanisms with near-identical context/trigger patterns (`ModalContextProvider`+`ModalTrigger`+`Modal` vs `DrawerContextProvider`+`DrawerTrigger`+`Drawer`), plus `Enlargeable`, which independently reimplements a full-screen Bulma modal (own expand/compress button, self-managed or controlled state) instead of reusing `ModalContextProvider`/`Modal`. `Drawer` even directly reuses `ModalCloseButton` from `Modal`, showing the two are conceptually siblings that could share more logic.
- **NavbarDropdown and NotificationDropdown both duplicate the `Modal`/`ModalContextProvider`/`ModalTrigger` per-item pattern** for showing item detail popups — nearly identical modal-per-item code exists in both components.

**Download / export**

- **DownloadButton vs DownloadDropdown** — near-duplicate components; `DownloadButton` triggers a single fixed `filetype` download on click, while `DownloadDropdown` offers the same JSON/CSV download logic (same `downloadAs`/`DownloadType` utility) via a dropdown menu of format choices. Could likely be merged into one component with an optional "show format picker" flag.

**Cards / data display**

- **DataCard vs DataBlock vs SynthesisRecipeCard** — `SynthesisRecipeCard` is implemented as a specialized configuration of `DataBlock` (custom `columns`/`data`/`footer`), so it fully overlaps with `DataBlock` rather than being a distinct rendering primitive. `DataCard` is a separate, simpler card layout (title/subtitle/4-key grid + left image) that is _not_ built on `DataBlock`/`Column` definitions, creating two incompatible "card" patterns in the same folder — the unimplemented `SearchUIDataCards` uses `DataCard`, while a table/detail-style layout would more naturally reuse `DataBlock`.
- **BibCard vs BibjsonCard vs CrossrefCard** — layered hierarchy, not independent alternatives. `BibCard` is the actual rendering component; `BibjsonCard` and `CrossrefCard` are thin format-adapters (bibjson vs Crossref API JSON) that map onto `BibCard`'s props, with `CrossrefCard` additionally supporting a live API fetch via `identifier`.

**Tables**

- **DataTable vs SearchUIDataTable** — both wrap `react-data-table-component` with very similar column/sort/pagination/selection logic, but `DataTable` is standalone/prop-driven (`data`, `columns`, `selectableRows`) while `SearchUIDataTable` duplicates most of that logic hard-wired to `SearchUIContext` state (server-side sort/pagination) instead of reusing `DataTable` internally. `SearchUIDataHeader` similarly reimplements a `ColumnsMenu`/result-count header nearly identical to `DataTable`'s own `hasHeader` section.
- **Paginator reused across three "SearchUI view" components** — `SearchUIDataTable`, `SearchUIDataCards` (unimplemented), and `SearchUISynthesisRecipeCards` each independently define a local `CustomPaginator` wrapper around the same `Paginator` component with nearly identical props, rather than sharing one implementation.
- **SearchUIContainer vs MatscholarSearchUIContainer** — `MatscholarSearchUIContainer` appears to be a near-duplicate/variant of `SearchUIContainer` adding a `matscholarEndpoint` fallback search path; its exact relationship/prop overlap with `SearchUIContainer` was not fully verified from source and should be checked directly if deduplication is being considered.

**Sliders / selects**

- **RangeSlider vs DualRangeSlider** — near-identical implementations; `DualRangeSlider` literally imports and reuses `renderTrack`/`renderThumb`/`renderMark` and the CSS file from `RangeSlider`. The only functional difference is single-value vs. two-handle min/max range. Could likely be merged into one component with a `mode`/`dual` prop.
- **Select vs ThreeStateBooleanSelect** — `ThreeStateBooleanSelect` is a very thin, special-cased wrapper around `Select` (adds one "Any" option). Could be replaced by using `Select` directly with a pre-built options array.
- **CheckboxList vs Select (isMulti)** — `CheckboxList` provides multi-select functionality that overlaps with what `Select` can already do via `isMulti={true}` (react-select pass-through prop); `CheckboxList` is a simpler custom implementation without react-select's search/async features.

**Search inputs**

- **GlobalSearchBar vs MaterialsInput vs SearchUISearchBar** — `GlobalSearchBar` and `SearchUISearchBar` are both fixed-configuration wrappers around `MaterialsInput` rather than distinct implementations — they add no new UI beyond preset props and submit/navigation behavior specific to their use case (site-wide search vs SearchUI search bar).
- **MaterialsInputBox vs MaterialsInput** — not truly independent/reusable; `MaterialsInputBox` is an internal sub-part of `MaterialsInput` (raw `<input>` + periodic table sync) and isn't meant to be used standalone, similar to how `FormulaAutocomplete` and `InputHelp` are internal helpers surfaced only through `MaterialsInputBox`.

**Dropdown menus**

- **Dropdown (navigation) vs NavbarDropdown vs NotificationDropdown vs SortDropdown vs DownloadDropdown** — at least five separate, independent re-implementations of "toggleable dropdown menu" logic exist across the codebase (`navigation/Dropdown` on react-aria-menubutton; `NavbarDropdown` and `NotificationDropdown` with bespoke hover/click-toggle + outside-click-to-close logic; `SortDropdown` and `DownloadDropdown` in data-display, also on react-aria-menubutton but with separate open/close state). None of these consistently reuse a single shared dropdown primitive — consolidating around one open-state/positioning implementation would reduce duplication.
- **NavbarDropdown has a stray import** of `IsArrowless` from `src/stories/navigation/Dropdown.stories.tsx` — a story file being imported into production component code, likely an unintended/dead import.
- **Bell.tsx imports `FaBars`/`FaTimes`** from `react-icons/fa` but does not appear to use them — likely leftover/dead import, possibly copy-pasted from `Navbar.tsx`.

**Periodic table**

- **SelectableTable (public) vs internal Table** — `SelectableTable` is a thin stateful wrapper that binds `Table` to the shared `PeriodicSelectionContext` store; `Table` itself is the grid-rendering/layout/heatmap engine and can be used standalone (fully controlled) without context if a consumer wires up its own state.
- **StandalonePeriodicComponent vs PeriodicElement vs element cells inside Table** — all three ultimately render a single element button via `PeriodicElement`; `StandalonePeriodicComponent` is just a sized wrapper around one `PeriodicElement` for use outside the full grid.
- **PeriodicTableSpacer vs PeriodicTablePluginWrapper** — both are layout-slot components for the same "gap" region of the periodic table grid, each splitting the area into an upper/first and lower/second span. `PeriodicTableSpacer` is the one actually wired into `Table`/`SelectableTable` (and shows the hover "detailed element" panel), whereas `PeriodicTablePluginWrapper` is a more generic, presentation-only splitter not otherwise referenced elsewhere in the tree.
- **PeriodicTableModeSwitcher's formula-mode branch duplicates `PeriodicTableFormulaButtons`** — it renders `PeriodicTableFormulaButtons` for FORMULA mode but hand-rolls near-identical wildcard-button markup inline for CHEMICAL_SYSTEM mode instead of reusing/parameterizing the shared component.

**Crystal Toolkit 3D scenes**

- **CrystalToolkitScene vs CrystalToolkitAnimationScene vs PhononAnimationScene** — near-duplicates sharing almost the entire prop interface, control-bar UI, and export logic (PNG/DAE/GLTF/GLB/USDZ). They differ only in how/when they invoke the underlying `Scene` class's `animate()` method: `CrystalToolkitScene` animates only if `settings.animation === 'play'`; `CrystalToolkitAnimationScene` calls `animate()` immediately for continuously-animated scenes; `PhononAnimationScene` calls `animate()` for phonon-specific data (`app: 'phonon'`, `omega`, `phases`, `amplitude`, `eigenVectors`, `velocity`). Given the ~95% code duplication, these look like copy-paste forks of one base component — a strong candidate for consolidation into one parameterized `CrystalToolkitScene`.
- **CrystalToolkitScene vs DynamicCrystalToolkitScene** — `DynamicCrystalToolkitScene` is a thin wrapper/demo harness around `CrystalToolkitScene` (paste-JSON textarea), not part of `src/index.ts` public exports, and has no Storybook story — likely a leftover dev tool.
- **Scene.ts ("Scene" export) vs the `*Scene` React components** — `Scene` is a non-React, imperative three.js class re-exported at the top level and easily confused by name with `CrystalToolkitScene`/`CrystalToolkitAnimationScene`/`PhononAnimationScene`; it is the rendering engine all three instantiate internally, not meant for standalone JSX use.

**Publications action buttons**

- **BibtexButton vs OpenAccessButton vs PublicationButton** — all three are near-identical "tag/badge"-styled anchor buttons sharing the same prop shape (`id`, `className` defaulting to `'tag'`, `doi`, `url`, `target`), composed together inside `BibCard`'s action row. They differ only in destination/behavior (BibTeX export via doi2bib.org, open-access PDF via oa.works, publication link via Crossref). Given the shared prop contract and duplicated doi→URL-building/fetch pattern, these could likely be refactored into a single generic "reference link button" parameterized by lookup service and label.
