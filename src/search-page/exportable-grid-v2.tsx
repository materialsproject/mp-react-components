import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import * as React from 'react';
import MGrid from './search-grid/card-grid';
import DataTable from 'react-data-table-component';
import ReactTooltip from 'react-tooltip';
import Dropdown, {
  DropdownToggle,
  DropdownMenu,
  DropdownMenuWrapper,
  MenuItem,
  DropdownButton
} from '@trendmicro/react-dropdown';

import { debounce } from 'ts-debounce';

import { FilterComponent } from './search-grid/filter';
import { columns } from './search-grid/table-definitions';
import { useCallback, useMemo, useRef, useState } from 'react';
import { downloadCSV, downloadExcel, downloadJSON } from './utils';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import copy from 'copy-to-clipboard';
import { AiOutlineCaretLeft } from 'react-icons/ai';
import { cardsDefinition, initialGrid } from './search-grid/cards-definition';
import CheckBox from 'rc-checkbox';
import { PeriodicContext } from '..';

const font = { fontFamily: 'Helvetica Neue' };
const conditionalRowStyles = [
  {
    when: row => row.theoretical,
    style: {
      backgroundColor: 'rgba(181, 232, 148, 0.21)'
    }
  }
];

// this adds the print view
export function MTGrid(props) {
  const onChange = props.onChange;
  const debouncedOnChange = useMemo(() => debounce(onChange, 500), [onChange]);
  const gridMemo = useMemo(
    () => (
      <MGrid
        allDefinitions={cardsDefinition}
        initCards={initialGrid}
        onChange={p => {
          const propsCopy = { ...p };
          delete propsCopy['viewMode'];
          delete propsCopy['map'];
          delete propsCopy['allDefinitions'];
          delete propsCopy['allDefinitionsMap'];
          delete propsCopy['onChangeRef'];
          debouncedOnChange(propsCopy);
        }}
      />
    ),
    [cardsDefinition, initialGrid, props.onChange]
  );
  const { printView, setPrintView } = React.useContext(PrintViewContext);
  return (
    <div className={`search-grid ${!!printView ? 'print' : ''}`}>
      {printView && (
        <div
          style={{
            padding: '10px 20px',
            border: '1px solid grey',
            borderRadius: 5,
            display: 'inline-block'
          }}
          onClick={() => setPrintView(false)}
        >
          <AiOutlineCaretLeft />
        </div>
      )}
      <DndProvider backend={Backend}>{gridMemo}</DndProvider>
    </div>
  );
}

const PrintViewContext = React.createContext<any>({});
export function MtPrintViewContext(props) {
  const [printView, setPrintView] = useState(false);
  return (
    <PrintViewContext.Provider value={{ printView, setPrintView }}>
      {...props.children}
    </PrintViewContext.Provider>
  );
}

export function MtMaterialTable(props) {
  const { printView, setPrintView } = React.useContext(PrintViewContext);
  const [scolumns, setColumns] = React.useState(columns);
  const rows = useRef<any[]>([]);
  const [filterValue, setFilterValue] = React.useState(false);

  const realData = useMemo(
    () =>
      props.data && (filterValue ? props.data.filter(r => !!r['has_bandstructure']) : props.data),
    [props.data, filterValue]
  );

  const subHeaderComponentMemo = React.useMemo(() => {
    return (
      <>
        <div
          onDoubleClick={e => {
            e.stopPropagation();
            e.preventDefault();
            scolumns.forEach(s => ((s as any).omit = false));
            setColumns([...scolumns]);
          }}
        >
          <Dropdown
            onSelect={c => {
              (scolumns[c] as any).omit = !(scolumns[c] as any).omit;
              setColumns([...scolumns]);
            }}
          >
            <Dropdown.Toggle
              style={{ padding: '9px 35px', borderRadius: 5, marginRight: 15 }}
              btnStyle="flat"
            >
              Show / Hide Columns
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {scolumns.map((c, idx) => (
                <MenuItem key={c.name} eventKey={idx}>
                  <CheckBox value={!(c as any).omit} checked={!(c as any).omit} /> {c.name}
                </MenuItem>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <FilterComponent onFilter={e => setFilterValue(!filterValue)} filterValue={filterValue} />
      </>
    );
  }, [filterValue, scolumns]);

  const cb = useCallback(r => {
    rows.current = r.selectedRows;
  }, []);

  const contextActions = React.useMemo(() => {
    const handlePrint = e => {
      setPrintView(true);
    };
    const handleCopy = e => {
      copy(JSON.stringify(rows.current), {
        debug: true,
        message: 'Press #{key} to copy'
      });
      toast.success(`Copied ${rows.current.length} rows to clipboard`);
    };
    const handleEdit = e => {};

    return (
      <>
        <ToastContainer />
        <Dropdown
          onSelect={eventKey => {
            let err;
            switch (eventKey) {
              case 1:
                err = downloadJSON(rows.current);
                break;
              case 2:
                err = downloadCSV(rows.current);
                break;
              case 3:
                err = downloadExcel(rows.current);
                break;
            }
            if (err) {
              toast.success(`Successfully downloaded ${rows.current.length} materials`);
            } else {
              toast.error('Not able to generate material file');
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
        <button className="header-button" key="copy" onClick={handleCopy}>
          Copy
        </button>

        <button className="header-button" key="print" onClick={handlePrint}>
          Print
        </button>

        <button className="header-button" key="delete" onClick={handlePrint}>
          Edit
        </button>
      </>
    );
  }, []);

  return (
    <>
      <ReactTooltip id="no-bs" type="warning" effect="solid">
        <span style={font}>Gap value is approximate and using a loose k-point mesh</span>
      </ReactTooltip>
      <DataTable
        subHeader
        keyField="material_id"
        subHeaderComponent={subHeaderComponentMemo}
        contextActions={contextActions}
        title="Materials"
        theme="material"
        onSelectedRowsChange={cb}
        conditionalRowStyles={conditionalRowStyles}
        style={font}
        columns={scolumns}
        data={realData}
        className={!realData || realData.length === 0 ? 'empty-table' : ''}
        selectableRows
        pagination={!printView}
        highlightOnHover
      />
    </>
  );
}

export default function MTGridWithContext(props) {
  //FIXME(chab) investigate if it's worth wrapping the grid with useMemo.
  // currently it's NOT, because we do not expect a NEW context
  return (
    <PeriodicContext>
      <MTGrid {...props} />
    </PeriodicContext>
  );
}
