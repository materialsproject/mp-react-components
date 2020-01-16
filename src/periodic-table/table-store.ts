import { Subject } from "rxjs";
import { shareReplay, tap } from "rxjs/operators";
import * as React from "react";

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

export const observable = !process.env.DEBUG
  ? state$.pipe((shareReplay(1)))
  : state$.pipe(tap(s => console.log(s)),shareReplay(1));

state$.next(state);
//FIXME(chab) use scan / map construct instead
export const tableStateStore = {
  init: (initialState: State = defaultState) => (state = initialState) && state$.next(state),
  setEnabledElements: (enabledElements: any) => (state = {...state, enabledElements}) && state$.next(state),
  setDisabledElements: (disabledElements: any) => (state = {...state, disabledElements}) && state$.next(state),
  clear: () => state$.next(defaultState),
  //TODO(chab) add check to prever unnecessary state mutation
  addEnabledElement: (enabledElement: string) => (state.enabledElements = {...state.enabledElements, [enabledElement]:true}) && state$.next(state),
  addDisabledElement: (disabledElement: string) => (state.disabledElements = {...state.disabledElements, [disabledElement]:true}) && state$.next(state),
  removeEnabledElement: (enabledElement: string) => (state.enabledElements = {...state.enabledElements, [enabledElement]:false}) && state$.next(state),
  removeDisabledElement: (disabledElement: string) => (state.disabledElements = {...state.disabledElements, [disabledElement]:false}) && state$.next(state),
  toggleEnabledElement: (enabledElement: string) => (state.enabledElements = {...state.enabledElements, [enabledElement]:!state.enabledElements[enabledElement]}) && state$.next(state)}

export function useElements(initialDisabledElements: any, initialEnabledElements: any) {
  const [disabledElements, setDisabled] = React.useState({});
  const [enabledElements, setEnabled] = React.useState({});

  React.useEffect(() => {
    const subscription = observable.subscribe(({enabledElements, disabledElements}) => {
      setDisabled(disabledElements);
      setEnabled(enabledElements);
    });
    tableStateStore.init({enabledElements:initialEnabledElements, disabledElements:initialDisabledElements});
    // clean up subscription;
    return () => subscription.unsubscribe();
  }, []); // by passing an empty array, we tell React to only run this effect ONCE

  return {disabledElements, enabledElements};
}
