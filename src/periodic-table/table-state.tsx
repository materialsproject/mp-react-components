import * as React from "react";
import { Subject } from "rxjs";
import { shareReplay } from "rxjs/operators";
import { Table } from "./periodic-table-component/periodic-table.component";

//FIXME
//This is equivalent to a singleton, i.e, this store is going to be shared amongst ALL the table that use it

interface ElementState {
    [symbol: string]: boolean
}

interface State {
    disabledElements: ElementState;
    enabledElements: ElementState;
}

const defaultState: State = { disabledElements: {}, enabledElements: {}};
Object.seal(defaultState);
let state: State = defaultState;
const state$: Subject<State> = new Subject();
const observable = state$.pipe((shareReplay(1)));

state$.next(state);

const tableStateStore = {
    init: (initialState: State = defaultState) => {
        state = initialState;
    },
    setEnabledElements: (enabledElements: any) => state$.next({...state, enabledElements}),
    setDisabledElements: (disabledElements: any) => state$.next({...state, disabledElements}),
    clear: () => state$.next(defaultState),
    //TODO(chab) add check to prever unnecessary state mutation
    addEnabledElement: (enabledElement: string) => (state.enabledElements = {...state.enabledElements, [enabledElement]:true}) && state$.next(state),
    addDisabledElement: (disabledElement: string) => (state.disabledElements = {...state.disabledElements, [disabledElement]:true}) && state$.next(state),
    removeEnabledElement: (enabledElement: string) => (state.enabledElements = {...state.enabledElements, [enabledElement]:false}) && state$.next(state),
    removeDisabledElement: (disabledElement: string) => (state.disabledElements = {...state.disabledElements, [disabledElement]:false}) && state$.next(state),
    toggleEnabledElement: (enabledElement: string) => (state.enabledElements = {...state.enabledElements, [enabledElement]:!state.enabledElements[enabledElement]}) && state$.next(state)}



function WithSelection({enabled, disabled}: any) {
    const [disabledElements, setDisabled] = React.useState({});
    const [enabledElements, setEnabled] = React.useState({});

    React.useEffect(() => {
        tableStateStore.init();
        const subscribtion = observable.subscribe(({enabledElements, disabledElements}) => {
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
