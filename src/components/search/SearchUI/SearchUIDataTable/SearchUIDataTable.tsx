import React, { useEffect, useRef, useState } from 'react';
import { useSearchUIContext, useSearchUIContextActions } from '../SearchUIContextProvider';
import DataTable from 'react-data-table-component';
import { Paginator } from '../../Paginator';
import { FaCaretDown } from 'react-icons/fa';

/**
 * Component for rendering data returned within a SearchUI component
 * Table data and interactions are hooked up to the SearchUIContext state and actions
 */

interface Props {
  className?: string;
}

export const SearchUIDataTable: React.FC<Props> = (props) => {
  const state = useSearchUIContext();
  const actions = useSearchUIContextActions();
  const [toggleClearRows, setToggleClearRows] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  const handlePageChange = (page: number) => {
    /** Scroll table back to top when page changes */
    if (tableRef.current) {
      tableRef.current.children[0].scrollTop = 0;
    }
    actions.setPage(page);
    setToggleClearRows(!toggleClearRows);
  };

  const handleSort = (column, sortDirection) => {
    const sortAscending = sortDirection === 'asc' ? true : false;
    actions.setSort(column.selector, sortAscending);
    setToggleClearRows(!toggleClearRows);
  };

  const handleSelectedRowsChange = (rowState) => {
    console.log(rowState);
    actions.setSelectedRows(rowState.selectedRows);
  };

  const CustomPaginator = () => (
    <Paginator
      rowCount={state.totalResults}
      rowsPerPage={state.resultsPerPage}
      currentPage={state.page}
      onChangePage={handlePageChange}
    />
  );

  const conditionalRowStyles: any[] = state.conditionalRowStyles!.map((c) => {
    c.when = (row) => row[c.selector] === c.value;
    return c;
  });

  return (
    <div className="mpc-search-ui-data-table">
      {state.results.length > 15 && <CustomPaginator />}
      <div className="columns react-data-table-outer-container">
        <div
          data-testid="react-data-table-container"
          className="column react-data-table-container"
          ref={tableRef}
        >
          <DataTable
            className="react-data-table"
            noHeader
            theme="material"
            columns={state.columns.filter((c) => !c.hidden)}
            data={state.results}
            highlightOnHover
            pagination
            paginationServer
            paginationComponent={CustomPaginator}
            sortServer
            sortIcon={<FaCaretDown />}
            defaultSortField={state.sortField}
            defaultSortAsc={state.sortAscending}
            onSort={handleSort}
            customStyles={{
              rows: {
                style: {
                  minHeight: '3em',
                },
              },
            }}
            conditionalRowStyles={conditionalRowStyles}
            selectableRows={state.selectableRows}
            onSelectedRowsChange={handleSelectedRowsChange}
            clearSelectedRows={toggleClearRows}
            // selectableRowSelected={(row) => {
            //   const isSelected = state.selectedRows?.find(s => s.material_id === row.material_id);
            //   console.log(state.selectedRows);
            //   console.log(row);
            //   return isSelected;
            // }}
          />
        </div>
      </div>
    </div>
  );
};
