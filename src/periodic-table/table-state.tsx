import * as React from "react";
import { tableStateStore, useElements } from "./periodic-table-state/table-store";
import { Table } from "./periodic-table-component/periodic-table.component";

interface SelectableTableProps {
    enabledElements: {},
    disabledElements: {},
    hiddenElements: {},
    onStateChange?: any
}

//FIXME handle all the cases where we know state has not changed
export function SelectableTable({enabledElements, disabledElements, hiddenElements, onStateChange}: SelectableTableProps) {
    const {enabledElements: enabledEls, disabledElements: disabledEls, hiddenElements: hiddenEls}
        = useElements(disabledElements, enabledElements, hiddenElements, onStateChange);

    return (<Table
      onElementClicked={(element) => tableStateStore.toggleEnabledElement(element.symbol)}
      onElementHovered={(element) => tableStateStore.setDetailedElement(element.symbol)}
      disabledElement={disabledEls}
      hiddenElement={hiddenEls}
      enabledElement={enabledEls} />);
}
