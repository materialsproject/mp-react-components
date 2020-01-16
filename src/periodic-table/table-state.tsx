import * as React from "react";
import { observable, tableStateStore } from "./table-store";
import { tap } from "rxjs/operators";
import { Table } from "./periodic-table-component/periodic-table.component";

export function WithSelection({enabled, disabled}: any) {
    const [disabledElements, setDisabled] = React.useState({});
    const [enabledElements, setEnabled] = React.useState({});

    React.useEffect(() => {
        tableStateStore.init();
        const subscribtion = observable.pipe(tap(a => console.log(a))).subscribe(({enabledElements, disabledElements}) => {
            setDisabled(disabledElements);
            setEnabled(enabledElements);
        });
        // clean up subscription;
        return () => subscribtion.unsubscribe();
    });

    return (<Table
      onElementClicked={(element) => tableStateStore.toggleEnabledElement(element.symbol)}
      disabledElement={disabledElements}
      enabledElement={enabledElements} />);
}
