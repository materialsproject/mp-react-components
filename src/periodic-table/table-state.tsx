import * as React from "react";
import { useElements } from "./periodic-table-state/table-store";
import { Table, TableLayout } from "./periodic-table-component/periodic-table.component";
import { useEffect } from "react";


interface SelectableTableProps {
    enabledElements: {},
    disabledElements: {},
    hiddenElements: {},
    maxElementSelectable: number,
    onStateChange?: any
    forceTableLayout?: TableLayout
}


//FIXME handle all the cases where we know state has not changed
export function SelectableTable(props: SelectableTableProps) {
    // TOOD(chab) explore the other way, have three different subscriptions with distinctUntilChanged
    // The current approach will not work if we do not keep a stable reference
    useEffect(() => { console.log("[Scomponent updated, e");
        tableStateStore.setEnabledElements(props.enabledElements);
    }, [props.enabledElements]);
    useEffect(() => { console.log("[Scomponent updated, d");
        tableStateStore.setDisabledElements(props.disabledElements);
    }, [props.disabledElements]);
    useEffect(() => { console.log("[Scomponent updated, h");
        tableStateStore.setHiddenElements(props.hiddenElements);
    }, [props.hiddenElements]);
    useEffect(() => { console.log("MAX UPDATE");
        //TODO(chab) let's suppose this change on the fly, we might need to deselect all the extraneous element
        tableStateStore.setMaxSelectionLimit(props.maxElementSelectable);
    }, [props.maxElementSelectable]);

    const {enabledElements: enabledEls, disabledElements: disabledEls, hiddenElements: hiddenEls, actions: tableStateStore}
     = useElements(props.disabledElements,
      props.enabledElements,
      props.hiddenElements,
      props.maxElementSelectable,
      props.onStateChange);

    return (<Table
      onElementClicked={(element) => tableStateStore.toggleEnabledElement(element.symbol)}
      onElementHovered={(element) => tableStateStore.setDetailedElement(element.symbol)}
      disabledElement={disabledEls}
      hiddenElement={hiddenEls}
      enabledElement={enabledEls}
      {...props} />);
}

