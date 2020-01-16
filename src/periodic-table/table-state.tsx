import * as React from "react";
import { tableStateStore, useElements } from "./table-store";
import { Table } from "./periodic-table-component/periodic-table.component";

//FIXME handle all the cases where we know state has not changed
export function SelectableTable({enabledElements, disabledElements, onStateChange}: { enabledElements: {}, disabledElements:{}, onStateChange?: any}) {
    const {enabledElements: enabledEls, disabledElements: disabledEls} = useElements(disabledElements, enabledElements, onStateChange);

    return (<Table
      onElementClicked={(element) => tableStateStore.toggleEnabledElement(element.symbol)}
      disabledElement={disabledEls}
      enabledElement={enabledEls} />);
}
