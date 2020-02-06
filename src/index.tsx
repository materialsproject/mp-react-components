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
import { TableLayout } from "./periodic-table/periodic-table-component/periodic-table.component";
import { scene } from "./crystal-toolkit-components/components-v2/scene/simple-scene";
import Simple3DSceneComponent
  from "./crystal-toolkit-components/components-v2/Simple3DScene/Simple3DSceneComponent.react";

const mountNodeSelector = 'app';
const mountNode = document.getElementById(mountNodeSelector);

let elements: any[] = [];

function SelectedComponent() {
  const {enabledElements} = useElements();
  // try to delete the key in the store instead
  const getElementsList = () => Object.keys(enabledElements).filter((el) => (enabledElements)[el]);

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
  const getElementsList = () => Object.keys(enabledElements).filter((el) => (enabledElements)[el]);
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
        sz(['Cl', 'Na', 'Be']);
        sd(['K', 'Be']);}}>CLICK ME</div>

      <PeriodicContext>
        <div>
          <SelectableTable
            forwardOuterChange={true}
            maxElementSelectable={sel}
            hiddenElements={props.e}
            onStateChange={(a) => {
              console.log('new elements', a);
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
    <div style={{width: '500px', height: '500px'}}>
      <Simple3DSceneComponent data={scene} toggleVisibility={{}}/>
    </div>

    <div>
      {<TestComponent d={['B']} b={[]} e={[]}/>}
      {<PeriodicContext>
        <div>
          <div>
            <SelectableTable
              maxElementSelectable={2}
              forceTableLayout={TableLayout.COMPACT}
              hiddenElements={[]}
              onStateChange={(enabledElements) => {
                elements = Object.keys(enabledElements).filter((el) => (enabledElements)[el]);
              }}
              enabledElements={[]}
              disabledElements={['H', 'C']} />
            <TableFilter/>
            <SelectableTable
              maxElementSelectable={1}
              forceTableLayout={TableLayout.MAP}
              enabledElements={['H', 'C']}
              disabledElements={[]}
              hiddenElements={[]}/>
          </div>
          <SelectedComponentSimple/>
        </div>
      </PeriodicContext>}

    </div>
  </>

, mountNode);
console.log('RUNNING in',  process.env.NODE_ENV, 'DEBUGGING IS', process.env.DEBUG);
