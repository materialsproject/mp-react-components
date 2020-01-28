/**
 *
 *  App bootstrapping. See index.html
 *
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import "./styles.less";
import { SelectableTable } from "./periodic-table/table-state";
import { TableFilter } from "./periodic-table/periodic-filter/table-filter";
import { StandalonePeriodicComponent } from "./periodic-table/periodic-element/standalone-periodic-component";
import { useElements } from "./periodic-table/periodic-table-state/table-store";
import { PeriodicContext } from "./periodic-table/periodic-table-state/periodic-selection-context";
import { TableLayout } from "./periodic-table/periodic-table-component/periodic-table.component";

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

ReactDOM.render(
  <>
    <PeriodicContext>
      <div>
        <SelectableTable
          hiddenElements={{}}
          onStateChange={(a: any) => {
            console.log('new elements', a);
          }}
          enabledElements={{'H': true, 'C': true}}
          disabledElements={{'Na':true, 'Ca':true}} />
        <TableFilter/>
        <SelectedComponent/>
        <div>{elements}</div>
      </div>
    </PeriodicContext>

    <PeriodicContext>
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
    </PeriodicContext>
  </>

, mountNode);
console.log('RUNNING in',  process.env.NODE_ENV, 'DEBUGGING IS', process.env.DEBUG);
