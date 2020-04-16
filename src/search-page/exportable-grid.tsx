import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import * as React from 'react';
import MGrid from './card-grid';
import { PeriodicContext } from '../periodic-table';
import useAxios from 'axios-hooks';
import DataTable from 'react-data-table-component';
import Loader from 'react-loader-spinner';
import ReactTooltip from 'react-tooltip';
import Dropdown, {
  DropdownToggle,
  DropdownMenu,
  DropdownMenuWrapper,
  MenuItem,
  DropdownButton
} from '@trendmicro/react-dropdown';

import { AxiosRequestConfig } from 'axios';
import { FilterComponent } from './search-grid/filter';
import { columns, onChange } from './search-grid/table-definitions';
import { useCallback, useRef } from 'react';
import { downloadCSV, downloadExcel, downloadJSON } from './utils';

//TODO(chab) what we do with provenance

const conditionalRowStyles = [
  {
    when: row => row.theoretical,
    style: {
      backgroundColor: 'rgba(181, 232, 148, 0.21)'
    }
  }
];

const axiosConfig: AxiosRequestConfig = {
  headers: {
    'X-API-KEY': 'fJcpJy6hRNF3DzBo',
    'Access-Control-Allow-Origin': 'localhost',
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  url: 'https://materialsproject.org/rest/v2/query',
  method: 'POST'
};

// you have to put the whole field eg : x.y.z for the query

function ExportableGrid() {
  const [filterValue, setFilterValue] = React.useState(false);
  const [
    { data: putData, loading: putLoading, error: putError },
    executePost
  ] = useAxios(axiosConfig, { manual: true });
  const rows = useRef<any[]>([]);

  const subHeaderComponentMemo = React.useMemo(() => {
    return (
      <FilterComponent onFilter={e => setFilterValue(!filterValue)} filterValue={filterValue} />
    );
  }, [filterValue]);

  const cb = useCallback(r => {
    rows.current = r.selectedRows;
  }, []);

  const contextActions = React.useMemo(() => {
    const handlePrint = e => {
      console.log(e);
    };
    return (
      <>
        <Dropdown
          onSelect={eventKey => {
            console.log(eventKey);
            switch (eventKey) {
              case 1:
                downloadJSON(rows.current);
                break;
              case 2:
                downloadCSV(rows.current);
                break;
              case 3:
                downloadExcel(rows.current);
                break;
            }
          }}
        >
          <Dropdown.Toggle
            style={{ padding: '9px 35px', borderRadius: 5, marginRight: 15 }}
            btnStyle="flat"
          >
            Export
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <MenuItem eventKey={1}>Export as JSON</MenuItem>
            <MenuItem eventKey={2}>Export as CSV</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey={3}>Export as XLS</MenuItem>
          </Dropdown.Menu>
        </Dropdown>

        <button
          key="copy"
          onClick={handlePrint}
          style={{ padding: '10px 35px', borderRadius: '5px', fontSize: 15 }}
        >
          Copy
        </button>

        <button
          key="print"
          onClick={handlePrint}
          style={{ padding: '10px 35px', borderRadius: '5px', fontSize: 15 }}
        >
          Print
        </button>

        <button
          key="delete"
          onClick={handlePrint}
          style={{ padding: '10px 35px', borderRadius: '5px', fontSize: 15 }}
        >
          Edit
        </button>
      </>
    );
  }, []);

  return (
    <>
      <ReactTooltip id="no-bs" type="warning" effect="solid">
        <span style={{ fontFamily: 'Helvetica Neue' }}>
          Gap value is approximate and using a loose k-point mesh
        </span>
      </ReactTooltip>

      <DndProvider backend={Backend}>
        <MGrid onChange={c => onChange(c, executePost)} />
      </DndProvider>
      <DataTable
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        contextActions={contextActions}
        title="Materials"
        theme="material"
        onSelectedRowsChange={cb}
        conditionalRowStyles={conditionalRowStyles}
        style={{ fontFamily: 'Helvetica Neue' }}
        columns={columns}
        data={
          putData &&
          (filterValue ? putData.response.filter(r => !!r['has_bandstructure']) : putData.response)
        }
        progressPending={putLoading}
        progressComponent={<Loader type="Bars" color="#00BFFF" height={80} width={100} />}
        selectableRows
        highlightOnHover
        pagination
      />
    </>
  );
}

export default function gridWithContext() {
  return (
    <PeriodicContext>
      <ExportableGrid />
    </PeriodicContext>
  );
}
