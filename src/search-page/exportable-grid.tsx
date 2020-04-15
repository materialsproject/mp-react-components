import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import * as React from 'react';
import { useContext, useState } from 'react';
import MGrid from './card-grid';
import { Card, CardState, Widget, WIDGET } from './cards-definition';
import { PeriodicContext, SelectableTable } from '../periodic-table';
import { TableLayout } from '../periodic-table/periodic-table-component/periodic-table.component';
import { PeriodicSelectionContext } from '../periodic-table/periodic-table-state/table-store';
import useAxios from 'axios-hooks';
import { useRef } from 'react';
import DataTable, { createTheme, IDataTableColumn } from 'react-data-table-component';
import Loader from 'react-loader-spinner';
import CheckBox from 'rc-checkbox';
import ReactTooltip from 'react-tooltip';

import Dropdown, {
  DropdownToggle,
  DropdownMenu,
  DropdownMenuWrapper,
  MenuItem,
  DropdownButton
} from '@trendmicro/react-dropdown';

import { MatgenUtilities } from '../utils/matgen';
import { AiOutlineWarning } from 'react-icons/ai';
//TODO(chab) what we do with provenance

let q;

const conditionalRowStyles = [
  {
    when: row => row.theoretical,
    style: {
      backgroundColor: 'rgba(181, 232, 148, 0.21)'
    }
  }
];

// you have to put the whole field eg : x.y.z for the query

function ExportableGrid() {
  const [selectionStyle, setSelectionStyle] = useState('select');
  const { observable, actions } = useContext(PeriodicSelectionContext);
  const selectedElements = useRef<string[]>([]);

  const [filterValue, setFilterValue] = React.useState(false);

  const subHeaderComponentMemo = React.useMemo(() => {
    return (
      <FilterComponent onFilter={e => setFilterValue(!filterValue)} filterValue={filterValue} />
    );
  }, [filterValue]);

  const contextActions = React.useMemo(() => {
    const handlePrint = () => {};
    return (
      <>
        <Dropdown onSelect={eventKey => {}}>
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

  const [{ data: putData, loading: putLoading, error: putError }, executePost] = useAxios(
    {
      headers: {
        'X-API-KEY': 'fJcpJy6hRNF3DzBo',
        'Access-Control-Allow-Origin': 'localhost',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      url: 'https://materialsproject.org/rest/v2/query',
      method: 'POST'
    },
    { manual: true }
  );

  function fetchElements() {
    const params = new URLSearchParams();

    const query =
      selectedElements.current.length > 0
        ? { ...q, elements: { $all: selectedElements.current } }
        : q;
    params.append('properties', JSON.stringify(p));
    params.append('criteria', JSON.stringify(query));
    executePost({ data: params }).then(() => {
      setTimeout(() => {
        ReactTooltip.rebuild();
      }, 0);
    });
  }

  return (
    <>
      <ReactTooltip id="no-bs" type="warning" effect="solid">
        <span style={{ fontFamily: 'Helvetica Neue' }}>
          Gap value is approximate and using a loose k-point mesh
        </span>
      </ReactTooltip>

      {/*<button data-tip data-for="no-bs" onClick={() => fetchElements()}>
        {' '}
        MAKE REQUEST
      </button>*/}
      <div className="form-check">
        <label>
          <input
            type="radio"
            name="selection-style"
            value="select"
            checked={selectionStyle === 'select'}
            className="form-check-input"
            onChange={() => {
              setSelectionStyle('select');
              actions.selectionStyle = 'select';
            }}
          />
          Choose elements to include on the search
        </label>
      </div>

      <div className="form-check">
        <label>
          <input
            type="radio"
            name="selection-style"
            value="enableDisable"
            checked={selectionStyle === 'enableDisable'}
            onChange={() => {
              setSelectionStyle('enableDisable');
              actions.selectionStyle = 'enableDisable';
            }}
          />
          Choose elements to not include the search
        </label>
      </div>

      <SelectableTable
        maxElementSelectable={20}
        forceTableLayout={TableLayout.COMPACT}
        hiddenElements={[]}
        enabledElements={[]}
        onStateChange={c => {
          selectedElements.current = c;
        }}
        disabledElements={[]}
      />

      <DndProvider backend={Backend}>
        <MGrid
          onChange={c => {
            const query = {};
            // filter cards
            const cards = c.cardSettings.reduce((acc, card, idx) => {
              if (card.state !== CardState.PRISTINE && !card.disabled) {
                acc.push({ cardDef: c.cardDef[idx], cardSettings: card });
              }
              return acc;
            }, []);
            // write mongodb query
            if (cards.length === 0) {
              return;
            } // do not query for empty cards

            cards.forEach(card => {
              // look at card widget
              const def: Card = card.cardDef;
              def.widgets.forEach((widget: Widget, widgetIndex) => {
                if (card.cardSettings.widgetState[widgetIndex] === CardState.PRISTINE) {
                  return;
                }
                if (widget.type === WIDGET.SLIDERS) {
                  const key = widget.id;
                  const prefix = def.bypassIdForKey ? '' : def.id + '.';
                  query[prefix + key] = {
                    $gte: card.cardSettings.values[widgetIndex][0],
                    $lte: card.cardSettings.values[widgetIndex][1]
                  };
                } else if (widget.type === WIDGET.TAG_SEARCH) {
                  card.cardSettings.values[widgetIndex] &&
                    (query[card.cardSettings.id] = card.cardSettings.values[widgetIndex]);
                } else if (widget.type === WIDGET.SP_SEARCH) {
                  const spaceGroups = card.cardSettings.values[widgetIndex];
                  query['spacegroup.number'] = {
                    $in: spaceGroups.map(s => s['space-group.number'])
                  };
                } else if (widget.type === WIDGET.CHECKBOX_LIST) {
                  //TODO(chab) fix the update logic of the widget.
                  console.log(card.cardSettings, card.cardDef);
                  query['provenance'] = card.cardSettings.values[0];
                }
              });
            });

            q = query;
            // we are queuing update, otherwise, we would trigger a re-render immediately
            // FIXME(chab) the reducer should be defined here anyway
            setTimeout(() => fetchElements(), 0);
          }}
        />
      </DndProvider>
      <DataTable
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        contextActions={contextActions}
        title="Materials"
        theme="material"
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
    <PeriodicContext disabledElements={['H', 'Cl']}>
      <ExportableGrid />
    </PeriodicContext>
  );
}

// fix typings
const columns = [
  {
    name: 'Material Id',
    selector: 'material_id',
    sortable: true
  },
  {
    name: 'Formula',
    selector: 'full_formula',
    cell: row => {
      return (
        <div dangerouslySetInnerHTML={{ __html: MatgenUtilities.htmlFormula(row.full_formula) }} />
      );
    },
    sortable: true
  },
  /*{
    name: "Spacegroup",
    selector: "year",
    sortable: true
  },*/
  {
    name: 'Volume',
    selector: 'volume',
    format: r => r.volume.toFixed(2),
    sortable: true
  },
  {
    name: 'Number of sites',
    selector: 'nsites',
    sortable: true
  },
  {
    name: 'Energy above Hull',
    selector: 'e_above_hull',
    sortable: true
  },
  {
    name: 'Density',
    selector: 'density',
    format: r => r.density.toFixed(2),
    sortable: true
  },
  {
    name: 'Band Gap',
    querySelector: 'band_gap.search_gap.band_gap',
    cell: row => (
      <div data-tip data-for="no-bs">
        {' '}
        {row['band_gap.search_gap.band_gap'].toFixed(2)}
        <span> {!row['has_bandstructure'] ? <AiOutlineWarning /> : ''}</span>
      </div>
    ),
    selector: r => r['band_gap.search_gap.band_gap'],
    sortable: true
  }
];

const p = columns.map(q => (q.querySelector ? q.querySelector : q.selector));
p.push('theoretical', 'has_bandstructure', 'tags');
// search_gap.band_gap does not work

const FilterComponent = ({ filterValue, onFilter }) => (
  <>
    Show only material with bandgap
    <CheckBox onChange={onFilter} value={filterValue} />
  </>
);
