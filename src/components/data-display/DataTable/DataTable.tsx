import React, { useEffect, useRef, useState } from 'react';
import { default as ReactDataTable } from 'react-data-table-component';
import { FaCaretDown } from 'react-icons/fa';
import { Column, ConditionalRowStyle } from '../SearchUI/types';
import { getColumnsFromKeys, initColumns } from '../../../utils/table';
import { Paginator } from '../Paginator';
import { ColumnsMenu } from './ColumnsMenu';
import './DataTable.css';
import classNames from 'classnames';

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
   * Class name(s) to append to the component's default class
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
  resultLabelPlural = `${resultLabel}s`,
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
  const [columns, setColumns] = useState(() => {
    return initColumns(columnDefs, props.disableRichColumnHeaders);
  });
  const [tableColumns, setTableColumns] = useState(() => columns.filter((c) => !c.hidden));
  const [data, setData] = useState(props.data);
  const [toggleClearRows, setToggleClearRows] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  const handleSelectedRowsChange = (rowState) => {
    if (props.setProps) props.setProps({ ...props, selectedRows: rowState.selectedRows });
  };

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

  return (
    <div className={classNames('mpc-data-table', props.className)}>
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
            paginationComponent={props.paginationIsExpanded ? CustomPaginator : null}
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
            conditionalRowStyles={conditionalRowStyles}
            selectableRows={props.selectableRows}
            onSelectedRowsChange={handleSelectedRowsChange}
            clearSelectedRows={toggleClearRows}
          />
        </div>
      </div>
    </div>
  );
};
