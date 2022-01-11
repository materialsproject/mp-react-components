import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { default as ReactDataTable } from 'react-data-table-component';
import { FaCaretDown } from 'react-icons/fa';
import { Column, ColumnFormat, ConditionalRowStyle } from '../SearchUI/types';
import { getColumnsFromKeys, initColumns } from '../../../utils/table';
import { Paginator } from '../Paginator';
import { ColumnsMenu } from './ColumnsMenu';
import './DataTable.css';
import classNames from 'classnames';
import { Markdown } from '../Markdown';

export interface DataTableProps {
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
   * Class name(s) to append to the component's default class.
   * By default, the .box and .p-0 classes are applied to the table, but these will be
   * overridden if a className is supplied.
   */
  className?: string;
  /**
   * Array of data objects to display in the table
   */
  data: any[];
  /**
   * An array of column definition objects to control what is rendered in the table.
   * See `Column` documentation for specifics on how to construct `Column` objects.
   */
  columns?: Column[];
  /**
   * Optionally include a field to sort by on initial load
   * Must be a valid field and included in your list of columns
   */
  sortField?: string;
  /**
   * If including a sortField, set whether it should ascend by default
   * True for ascending, False for descending
   */
  sortAscending?: boolean;
  /**
   * Optionally include a secondary sort field. If the sortField ever becomes the same as
   * the secondarySortField, the secondary field is removed.
   * Must be a valid field and included in your list of columns.
   */
  secondarySortField?: string;
  /**
   * If including a secondarySortField, set whether it should ascend by default.
   * True for ascending, False for descending.
   */
  secondarySortAscending?: boolean;
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
   * Combine with selectableRows prop to only allow one row to be selected at a time.
   */
  singleSelectableRows?: boolean;
  /**
   * Set to true to show a header with total number of rows and a columns selector
   */
  hasHeader?: boolean;
  /**
   * Optional class name to apply to the table header
   */
  headerClassName?: string;
  /**
   * A noun in singular form to describe what a result represents (e.g. "material").
   * This is displayed in the table header.
   */
  resultLabel?: string;
  /**
   * Plural form of the result label. If none supplied, it will automatically be the result label plus an "s"
   */
  resultLabelPlural?: string;
  /**
   * Set to true to paginate the table records
   */
  pagination?: boolean;
  /**
   * If true, an expanded component will be used for pagination (same as in `SearchUI`).
   * If false, a compact version will be used.
   */
  paginationIsExpanded?: boolean;
  /**
   * Content to display below the table but inside the table's box wrapper.
   * Accepts markdown.
   */
  footer?: ReactNode;
  /**
   * This is a temporary solution to allow SearchUI's to render in Storybook.
   * There is an issue with the dynamic column header components that causes
   * Storybook to crash. Rendering column headers as plain strings fixes the problem.
   * Note that this will disable column tooltips and unit labels.
   */
  disableRichColumnHeaders?: boolean;
}

/**
 * Component for rendering data in a table.
 * Uses react-data-table-component under the hood.
 */
export const DataTable: React.FC<DataTableProps> = ({
  className = 'box p-0',
  resultLabel = 'record',
  resultLabelPlural = resultLabel + 's',
  headerClassName = 'title is-6',
  ...otherProps
}) => {
  const props = {
    className,
    resultLabel,
    resultLabelPlural,
    headerClassName,
    ...otherProps
  };
  const columnDefs = props.columns || getColumnsFromKeys(props.data[0]);
  /**
   * If table rows are set to be clickable, a radio button column will be added to the column defs,
   * an isClicked property will be added to each record, and an id will be added to each record to
   * keep track of which row was clicked.
   */
  if (props.singleSelectableRows) {
    columnDefs.unshift({
      selector: '_isSelected',
      title: '',
      formatType: ColumnFormat.RADIO,
      width: '48px',
      onChange: handleClickedRow
    });
  }
  const [columns, setColumns] = useState(() => {
    return initColumns(columnDefs, props.disableRichColumnHeaders);
  });
  const [tableColumns, setTableColumns] = useState(columns);
  /**
   * Add _isSelected property to track which rows are selected.
   * Add _index property so that rows can be uniquely identified for selection logic.
   * The _index value is simply the row's index in the full unsorted data array.
   */
  const [data, setData] = useState(() => {
    if (props.selectableRows) {
      return props.data.map((d, i) => {
        d._isSelected = false;
        d._index = i;
        return d;
      });
    } else {
      return props.data;
    }
  });
  const [toggleClearRows, setToggleClearRows] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const hasMultiSelectableRows = props.selectableRows && !props.singleSelectableRows;

  /**
   * In order for the table to allow for data to be set from outside the component (i.e. via dash callback),
   * row selection needs to be handled in an explicit data variable. Otherwise, all rows would become deselected
   * once the data hook effect is triggered. This happens because that hook forces a re-render and react-data-table
   * would refresh its internal row state.
   */

  /**
   * Event triggered when a row checkbox is clicked.
   * This only pertains to multi selectable rows.
   * This event is triggered by react-data-table-component's onSelectedRowsChange and therefore
   * has access to rowState which is managed internally by react-data-table-component.
   */
  const handleSelectedRowsChange = (rowState) => {
    if (rowState.selectedRows != props.selectedRows) {
      const newData = data.map((d) => {
        const selected = rowState.selectedRows.find((r) => r._index === d._index);
        if (selected) {
          d._isSelected = true;
          selected._isSelected = true;
        } else {
          d._isSelected = false;
        }
        return { ...d };
      });
      setData(newData);
      if (props.setProps)
        props.setProps({ ...props, data: [...newData], selectedRows: rowState.selectedRows });
    }
  };

  /**
   * Event triggered when any part of a row is clicked.
   * Define this function using a function declaration so that
   * it gets hoisted and can be used in the _isSelected column def.
   */
  function handleClickedRow(row) {
    const newData = data.map((d) => {
      if (props.singleSelectableRows) {
        d._isSelected = d._index === row._index ? true : false;
      } else if (d._index === row._index) {
        d._isSelected = !d._isSelected;
      }
      return { ...d };
    });
    const newSelectedRows = newData.filter((d) => d._isSelected);
    setData(newData);
    if (props.setProps)
      props.setProps({ ...props, data: [...newData], selectedRows: newSelectedRows });
  }

  const CustomPaginator = ({
    rowsPerPage,
    rowCount,
    onChangePage,
    onChangeRowsPerPage,
    currentPage,
    isTop = false
  }) => (
    <Paginator
      rowCount={rowCount}
      rowsPerPage={rowsPerPage}
      currentPage={currentPage}
      onChangePage={onChangePage}
      onChangeRowsPerPage={onChangeRowsPerPage}
      isTop={isTop}
    />
  );

  const conditionalRowStyles: any[] | undefined = props.conditionalRowStyles?.map((c) => {
    c.when = (row) => row[c.selector] === c.value;
    return c;
  });

  /**
   * Update data if changed from outside component (e.g. via dash callback)
   */
  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  /**
   * Update columns if changed from outside component (e.g. via dash callback)
   */
  useEffect(() => {
    setColumns(initColumns(columnDefs, props.disableRichColumnHeaders));
  }, [props.columns]);

  /**
   * tableColumns should include only the columns that are viewable in the table (i.e. not hidden)
   */
  useEffect(() => {
    setTableColumns(columns.filter((c) => !c.hidden));
  }, [columns]);

  return (
    <div id={props.id} className={classNames('mpc-data-table', props.className)}>
      {props.hasHeader && (
        <div className="mpc-data-table-header">
          <div className="level is-mobile">
            <div className="level-left">
              <div className={props.headerClassName}>
                {data.length} {data.length === 1 ? props.resultLabel : props.resultLabelPlural}
              </div>
            </div>
            <div className="level-right">
              <ColumnsMenu columns={tableColumns} setColumns={setTableColumns} />
            </div>
          </div>
        </div>
      )}
      <div className="react-data-table-outer-container">
        <div
          data-testid="react-data-table-container"
          className="react-data-table-container"
          ref={tableRef}
        >
          <ReactDataTable
            className="react-data-table"
            noHeader
            theme="material"
            columns={tableColumns}
            data={data}
            highlightOnHover
            pagination={props.pagination}
            paginationComponent={props.paginationIsExpanded ? CustomPaginator : undefined}
            sortIcon={<FaCaretDown />}
            defaultSortField={props.sortField}
            defaultSortAsc={props.sortAscending}
            customStyles={{
              rows: {
                style: {
                  minHeight: '4em'
                }
              }
            }}
            onRowClicked={props.selectableRows ? handleClickedRow : undefined}
            conditionalRowStyles={conditionalRowStyles}
            selectableRows={hasMultiSelectableRows}
            onSelectedRowsChange={handleSelectedRowsChange}
            selectableRowSelected={(row) => {
              return row._isSelected;
            }}
            clearSelectedRows={toggleClearRows}
          />
        </div>
      </div>
      {props.footer && (
        <div className="mpc-data-table-footer">
          <Markdown>{props.footer}</Markdown>
        </div>
      )}
    </div>
  );
};
