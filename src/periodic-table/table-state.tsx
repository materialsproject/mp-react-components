import * as React from "react";
import { useElements } from "./periodic-table-state/table-store";
import { Table, TableLayout } from "./periodic-table-component/periodic-table.component";


interface SelectableTableProps {
    enabledElements: {},
    disabledElements: {},
    hiddenElements: {},
    onStateChange?: any
    forceTableLayout?: TableLayout
}

//FIXME handle all the cases where we know state has not changed
export function SelectableTable({enabledElements, disabledElements, hiddenElements, onStateChange, ...props}: SelectableTableProps) {
    const {enabledElements: enabledEls, disabledElements: disabledEls, hiddenElements: hiddenEls, actions: tableStateStore}
        = useElements(disabledElements, enabledElements, hiddenElements, onStateChange);

    return (<Table
      onElementClicked={(element) => tableStateStore.toggleEnabledElement(element.symbol)}
      onElementHovered={(element) => tableStateStore.setDetailedElement(element.symbol)}
      disabledElement={disabledEls}
      hiddenElement={hiddenEls}
      enabledElement={enabledEls}
      {...props} />);
}

