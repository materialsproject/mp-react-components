import * as React from "react";
import { useState } from "react";
import { Table, TableLayout } from "../periodic-table/periodic-table-component/periodic-table.component";
import { action } from "@storybook/addon-actions";
import { SelectableTable } from "../periodic-table/table-state";
import { useElements } from "../periodic-table/periodic-table-state/table-store";
import { TableFilter } from "../periodic-table/periodic-filter/table-filter";
import { StandalonePeriodicComponent } from "../periodic-table/periodic-element/standalone-periodic-component";
import { PeriodicContext } from "../periodic-table";

export default {
  component: Table,
  title: 'Periodic Table'
};

const disabledElement = {Be:true, Na:true, Cl:true};
const selectedElement = {O:true, H:true, Be:true};

function SelectedComponent() {
  const {enabledElements} = useElements();
  // try to delete the key in the store instead
  const getElementsList = () => Object.keys(enabledElements).filter((el) => (enabledElements as any)[el]);
  return (<ul>
    {getElementsList().map(el => <li key={el}>{el}</li>)}
  </ul>)
}

export const table = () => <>
  <div>This a periodic table with no state management.
    You need to explicitly wire which elements are selected/disabled/hidden. Two callbacks are exposed.
    One is called when an element is hovered, one is called when an element is clicked
  </div>

  <div>  Look below, if you want to colorize some elements of the table </div>

  <Table
    onElementHovered={action('element-hovered')}
    disabledElement={disabledElement}
    hiddenElement={{}}
    enabledElement={selectedElement}
    onElementClicked={ action('element-click')}/>;
</>;

export const managedTable = () => <>
  <div> This is a managed table that retains selection from user. The state of the selection is managed outside
    of the components and can be reused by other components, look at the <code> SelectedComponent </code>, which
    is a simple component that display the list of selected components.
    This table exposes just one callback that is called when the selection changes.
    In addition, you can pass the maximum number of elements that are selectable.


  </div>
  <div style={{margin: 10}}/>
  <div> For working with dash, you'll need to use the `setProps` function from the dash API in the
    <code> onStateChange </code> callback. This will notifity dash that something has changed
  </div>

  <PeriodicContext>
    <>
      <SelectedComponent/>
      <SelectableTable onStateChange={(a:any) => console.log(a)}
                       enabledElements={[]}
                       disabledElements={[]}
                       maxElementSelectable={1}
                       hiddenElements={[]}/>
    </>

  </PeriodicContext>
</>;


export const wiredTables = () => <>
  <div> The context can be used to wire two tables together </div>

  <PeriodicContext>
    <>
      <SelectableTable onStateChange={(a:any) => console.log(a)}
                       enabledElements={[]}
                       forceTableLayout={TableLayout.MINI}
                       disabledElements={[]}
                       maxElementSelectable={4}
                       hiddenElements={[]}/>

      <SelectableTable forceTableLayout={TableLayout.MAP} enabledElements={[]} disabledElements={[]} hiddenElements={[]} maxElementSelectable={4}/>
    </>
  </PeriodicContext>
</>;

export const filteredTable = () => <>
  <div> A filtered table</div>
  <PeriodicContext>
    <>
      <SelectedComponent/>
      <SelectableTable onStateChange={(a:any) => console.log(a)}
                       enabledElements={[]}
                       maxElementSelectable={1}
                       disabledElements={[]}
                       hiddenElements={[]}/>
      <div style={{margin: 10}}/>
      <TableFilter/>
    </>

  </PeriodicContext>
</>;


export const component = () => <>
  <div> There are some cases when you might want to display just one standalone component.
  </div>

    <StandalonePeriodicComponent size={50} disabled={false}
                                 enabled={false}
                                 hidden={false}
                                 element={'H'}
                                 onElementClicked={() => {}}
                                 onElementHovered={() => {}}/>
  </>;

function FormulaSelector(props) {

  const array = [
    {C: 16 , H:9, N:4, Na:3, O:9,S:2},
    {C: 17, H:20, N:4, Na:1, O:9, P:1},
    {H:1, C:22, Fe:14, K:52, O:12, Cl:4, Be:12, Pb:7, F:35, S:18, N:5, Zr: 22, Nb: 12, Mo:45, Tc:15, Cs:4, Fr:12, Mg:50, Hs:12, Bh: 3, Xe:10, Rn: 20, Kr:31 ,Ar:41},
    {H:2, O:1 }];

  const css = `
    li {
        padding: 10px;
        margin: 5px;
        border: 1px solid black;
        width: 150px;
        cursor: pointer;
    }
    ul {
        list-style: none;
    }
  `;

  return (
    <>
      <style>
        {css}
      </style>
      <ul>
        <li onClick={() => props.onFormulaClicked(array[0])}>C16H9N4Na3O9S2</li>
        <li onClick={() => props.onFormulaClicked(array[1])}>C17H20N4NaO9P</li>
        <li onClick={() => props.onFormulaClicked(array[2])}> Random heatmap </li>
        <li onClick={() => props.onFormulaClicked(array[3])}> H2O</li>
        <li onClick={() => props.onFormulaClicked({})}> No heatmap</li>
      </ul>
    </>)
}


export const heatmapTable = (props) => {

  const MIN = '#FF4422';
  const MAX = '#FFFF99';
  const MIN2 = '#4600FF';
  const MAX2 = '#FF00FF';
  const [heatmap, setHeatmap] = useState({});
  const [min, setMinColor] = useState(MIN);
  const [max, setMaxColor] = useState(MAX);

  function switchColors() {
    if (min === MIN) {
      setMinColor(MIN2);
      setMaxColor((MAX2))
    } else {
      setMinColor(MIN);
      setMaxColor(MAX);
    }
  }

  return (
    <>
      <div> The periodic table can be rendered as an heatmap. You have to pass the color associated
        with the minimum and maximum value, and an dictionnary whose keys are symbol, and values a number
        that will be used to determine the color of the element. The component computes on the fly the color
        of the elements
      </div>
      <div>
        Click on one of the formula below to update the heatmap.
      </div>
      <div>
        <FormulaSelector onFormulaClicked={(hm) => setHeatmap(hm)} />
        <div style={{border: '1px solid black', width: '150px', padding: '5px'}} onClick={() => switchColors()}>
          Click to change colors
        </div>
        <Table enabledElement={{}}
               disabledElement={{}}
               heatmapMax={max}
               heatmapMin={min}
               heatmap={heatmap}
               onElementClicked={() => {}}
               onElementHovered={() => {}}
               hiddenElement={{}}/>
      </div>)
    </>);
};

