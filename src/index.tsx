/**
 *
 *  App bootstrapping. See index.html
 *
 */
import * as React from "react";
import { useState } from "react";
import * as ReactDOM from "react-dom";
import "./styles.less";
import { SelectableTable } from "./periodic-table/table-state";
import { TableFilter } from "./periodic-table/periodic-filter/table-filter";
import { StandalonePeriodicComponent } from "./periodic-table/periodic-element/standalone-periodic-component";
import { useElements } from "./periodic-table/periodic-table-state/table-store";
import { PeriodicContext } from "./periodic-table/periodic-table-state/periodic-selection-context";
import { Table, TableLayout } from "./periodic-table/periodic-table-component/periodic-table.component";
import { Formulas, FormulaWithTable } from "./experiment/formulas";


const mountNodeSelector = 'app';
const mountNode = document.getElementById(mountNodeSelector);

let elements: any[] = [];

function SelectedComponent() {
  const {enabledElements} = useElements();
  // try to delete the key in the store instead
  const getElementsList = () => Object.keys(enabledElements).filter((el) => (enabledElements as any)[el]);

  return (<div className='cmp-list' style={{margin: '10px', 'display': 'flex'}}>
    {getElementsList().map((elt: any) =>
    <StandalonePeriodicComponent key={elt} size={50} disabled={false}
                                 enabled={false}
                                 hidden={false}
                                 element={elt}
                                 onElementClicked={() => {}}
                                 onElementHovered={() => {}}/>
    )}</div>);
}

function SelectedComponentSimple() {
  const {enabledElements} = useElements();
  // try to delete the key in the store instead
  const getElementsList = () => Object.keys(enabledElements).filter((el) => (enabledElements as any)[el]);
  return (<ul>
    {getElementsList().map(el => <li key={el}>{el}</li>)}
  </ul>)
}

function TestComponent(props: any) {

  const [d, sd] = useState(props.d as any);
  const [z, sz] = useState(props.e as any);
  const [sel ,ss] = useState(2);

  return (
    <div>
      <div onClick={() => { console.log('CLICKED');
        ss(1);
        sz([]);
        sd(['K', 'Be']);}}>CLICK ME</div>

      <PeriodicContext>
        <div>
          <SelectableTable
            maxElementSelectable={sel}
            hiddenElements={props.e}
            onStateChange={(a: any) => {
              //console.log('new elements', a);
            }}
            enabledElements={z}
            disabledElements={d} />
          <TableFilter/>
          <SelectedComponent/>
          <div>{props.toString()}</div>
        </div>
      </PeriodicContext>)
    </div>)
}



ReactDOM.render(
  <>
    <div>
      <FormulaWithTable/>
      <Table
        onElementHovered={() => {}}
        onElementClicked={() => {}}
        disabledElement={{}}
        hiddenElement={{}}
        enabledElement={{}}
        forceTableLayout={TableLayout.MAP}
        heatmapMax={'#FFFFFF'}
        heatmapMin={'#EEAAAA'}
        heatmap={
          {
            'K': 12,
            'O': 15,
            'Pb': 200,
            'He': 45,
            'Ti': 59,
            'V': 200,
            'Fe': 180,
            'Co': 170,
            'Ni': 160,
            'Y': 150,
            'Re': 140,
            'Os': 130,
            'Ir': 120,
            'Pt': 110,
            'Au': 100,
            'Rf': 90,
            'Db': 80,
            'Sg': 70,
            'Bh': 40,
            'Hs': 15,
            'Mt': 1,
            'Gd': 33,
            'Pa': 15,
            'Ac': 12,
            'Fr': 100,
            'Cs': 120,
            'Rb': 130,
            'Na': 140,
            'I': 150,
            'S': 160,
            'Hg': 170,
            'Ds': 10,
            'Rg': 5,
            'Cn': 1
          }
        }/>
      {/*<TestComponent d={['B']} b={[]} e={[]}/> */}
      {/*<PeriodicContext>
        <div>
          <div>
            <SelectableTable
              forceTableLayout={TableLayout.COMPACT}
              hiddenElements={{}}
              onStateChange={(enabledElements: any) => {
                elements = Object.keys(enabledElements).filter((el) => (enabledElements as any)[el]);
              }}
              enabledElements={{'H': true, 'C': true}}
              disabledElements={{'Na':true, 'Ca':true}} />
            <TableFilter/>
            <SelectableTable
              forceTableLayout={TableLayout.MAP}
              enabledElements={{'H': true, 'C': true}}
              disabledElements={{'Na':true, 'Ca':true}}
              hiddenElements={{}}/>
          </div>
          <SelectedComponentSimple/>
        </div>
      </PeriodicContext>*/}

    </div>
  </>

, mountNode);
console.log('RUNNING in',  process.env.NODE_ENV, 'DEBUGGING IS', process.env.DEBUG);
