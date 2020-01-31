import * as React from "react";
import { Table } from "../periodic-table/periodic-table-component/periodic-table.component";
import { action } from "@storybook/addon-actions";
import { SelectableTable} from "../periodic-table/table-state";
import { useElements } from "../periodic-table/periodic-table-state/table-store";
import { TableFilter } from "../periodic-table/periodic-filter/table-filter";
import { StandalonePeriodicComponent } from "../periodic-table/periodic-element/standalone-periodic-component";

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
export const filteredTable = () => <>
  <div> A filtered table</div>
  <SelectedComponent/>
  <SelectableTable onStateChange={(a:any) => console.log(a)}  enabledElements={{}} disabledElements={{}} hiddenElements={{}}/>
  <div style={{margin: 10}}/>
  <TableFilter/>
</>;

export const managedTable = () => <>
  <div> This is a managed table that retains selection from user. The state of the selection is managed outside
    of the components and can be reused by other components, look at the <code> SelectedComponent </code>
    It's a simple component that display the list of selected components
  </div>
  <div style={{margin: 10}}/>
  <div> For working with dash, a master component should expose changes in the state as a callback prop. This
    table is doing it as.
  </div>

  <SelectedComponent/>
  <SelectableTable onStateChange={(a:any) => console.log(a)}  enabledElements={{}} disabledElements={{}} hiddenElements={{}}/>
</>;
export const table = () => <>
  <div>This a periodic table with no state management. It exposes a click handler
    You need to explicitly wire which elements are selected/disabled

  </div>
  <Table
    onElementHovered={action('element-hovered')}
    disabledElement={disabledElement}
    hiddenElement={{}}
    enabledElement={selectedElement}
    onElementClicked={ action('element-click')}/>;
</>;


export const component = () => <>
  <div> There are some cases when you might want to display just one component. </div>

    <StandalonePeriodicComponent size={50} disabled={false}
                                 enabled={false}
                                 hidden={false}
                                 element={'H'}
                                 onElementClicked={() => {}}
                                 onElementHovered={() => {}}/>
  </>;

