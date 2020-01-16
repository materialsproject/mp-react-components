import { Subject } from "rxjs";
import { shareReplay, tap } from "rxjs/operators";

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
state$.pipe()

export const observable = state$.pipe((shareReplay(1)));

state$.next(state);

export const tableStateStore = {
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

