import { Observable, Subject } from "rxjs";
import { distinctUntilChanged, map, shareReplay, tap } from "rxjs/operators";
import * as React from "react";
import { useContext } from "react";


// makes an abstraction on top of process
declare const process: any; // via dotenv

//FIXME
//This is equivalent to a singleton, i.e, this store is going to be shared amongst ALL the table that use it


interface ElementState {
  [symbol: string]: boolean
}

interface State {
  disabledElements: ElementState;
  enabledElements: ElementState;
  hiddenElements: ElementState;
  detailedElement: string | null;
}

const defaultState: State = { disabledElements: {}, enabledElements: {}, detailedElement: null, hiddenElements: {}};
Object.seal(defaultState);


export function getPeriodicSelectionStore() {
  let state: State = defaultState;
  const state$: Subject<State> = new Subject();
  state$.next(state);
  let maxItemAllowed = 5; // Number.MAX_SAFE_INTEGER;
  const observable: Observable<State> = !process.env.DEBUG && !(process.env.NODE_ENV === 'test')
    ? state$.pipe((shareReplay(1)))
    : state$.pipe(tap(s => {}), shareReplay(1));
  let lastElementsToggled: string = '';
  const actions = {
    init: (initialState: State = defaultState) => {
      if (initialState.disabledElements) state.disabledElements = initialState.disabledElements;
      if (initialState.enabledElements) state.enabledElements = initialState.enabledElements;
      if (initialState.hiddenElements) state.hiddenElements = initialState.hiddenElements;
      if (initialState.detailedElement) state.detailedElement = initialState.detailedElement;
      console.log('START', state);
      state$.next(state)
    },
    setEnabledElements: (enabledElements: any) => (state = {...state, enabledElements}) && state$.next(state),
    setDisabledElements: (disabledElements: any) => (state = {...state, disabledElements}) && state$.next(state),
    clear: () => state$.next(defaultState),
    setDetailedElement: (el: string) => (state = {...state, detailedElement:el}) && state$.next(state),
    setHiddenElements: (hiddenElements: any) => (state = {...state, hiddenElements}) && state$.next(state),
    //TODO(chab) add check to prever unnecessary state mutation
    addEnabledElement: (enabledElement: string) => (state.enabledElements = {...state.enabledElements, [enabledElement]:true}) && state$.next(state),
    addDisabledElement: (disabledElement: string) => (state.disabledElements = {...state.disabledElements, [disabledElement]:true}) && state$.next(state),
    removeEnabledElement: (enabledElement: string) => (state.enabledElements = {...state.enabledElements, [enabledElement]:false}) && state$.next(state),
    removeDisabledElement: (disabledElement: string) => (state.disabledElements = {...state.disabledElements, [disabledElement]:false}) && state$.next(state),
    toggleEnabledElement: (enabledElement: string) =>
      {
        if (!state.disabledElements[enabledElement]) {
          if(!state.enabledElements[enabledElement]) {
            if ( Object.keys(state.enabledElements).length  === maxItemAllowed) {
              delete state.enabledElements[lastElementsToggled];
              state.enabledElements[enabledElement] = true;
              lastElementsToggled = enabledElement;
              state.enabledElements = {...state.enabledElements};
              state$.next(state)
            } else {
              lastElementsToggled = enabledElement;
              (state.enabledElements = {...state.enabledElements, [enabledElement]:true}) && state$.next(state);
            }
          } else {
            delete state.enabledElements[enabledElement];
            (state.enabledElements = {...state.enabledElements, [enabledElement]:false}) && state$.next(state);
          }
        }
      },
    setMaxSelectionLimit: (maxItem: number) =>  {
      maxItemAllowed = maxItem;
    }
  };

  return {
    observable,
    actions
  }
}

type Actions = ReturnType<typeof getPeriodicSelectionStore>;

export const PeriodicSelectionContext = React.createContext({ observable: {} as Observable<State>, actions: {}} as Actions);


/**
 *
 * Call this function inside a component. It will make the components aware of which elements are selected/disabled
 * Be careful, as this will trigger a rendering every time a component is selected/unselected
 *
**/
export function useElements(initialDisabledElements?: any,
                            initialEnabledElements?: any,
                            initialHiddenElements?: any,
                            maxElementSelection: number = 10,
                            onStateChange?: any) {
  const [disabledElements, setDisabled] = React.useState({});
  const [enabledElements, setEnabled] = React.useState({});
  const [hiddenElements, setHiddenElements] = React.useState({});
  const {observable, actions} = useContext(PeriodicSelectionContext);


  React.useEffect(() => {
    actions.setMaxSelectionLimit(maxElementSelection);
    // Update the view of the components that use it
    const subscription = observable.subscribe(({enabledElements, disabledElements, hiddenElements}: any) => {
      setDisabled(disabledElements);
      setEnabled(enabledElements);
      setHiddenElements(hiddenElements);
    });

    // Triggers external callback that dash user will provide
    const enabledElementsSubscription = observable.pipe(map(({enabledElements}: any) => enabledElements), distinctUntilChanged()).subscribe(
      (enabledElements) => onStateChange && onStateChange(enabledElements)
    );


    if (initialDisabledElements && initialEnabledElements && initialHiddenElements) {
      actions.init({
        enabledElements:initialEnabledElements,
        hiddenElements: initialHiddenElements,
        disabledElements:initialDisabledElements,
        detailedElement: null});
    } else {
      // actually make that the only way, and force the init somewhere else
    }

    // clean up subscription;
    return () =>  {
      subscription.unsubscribe();
      enabledElementsSubscription.unsubscribe();
    }
  }, []); // by passing an empty array, we tell React to only run this effect ONCE

  return {disabledElements, enabledElements, hiddenElements, actions};
}

export function useDetailedElement() {
  const [detailedElement, setDetailedElement] = React.useState('');
  const {observable} = useContext(PeriodicSelectionContext);

  //FIXME(chab) this is a hack for the tests, this situation would not happen in real life
  if (!observable.subscribe) {
    console.warn('No context defined, you need to manage detailed element by yourself');
    return detailedElement;
  }

  React.useEffect(() => {
    const subscription = observable.subscribe(({detailedElement}) => {
      if (detailedElement)
      {
        setDetailedElement(detailedElement!);
      }
    });

    // clean up subscription;
    return () => subscription.unsubscribe();
  }, []); // by passing an empty array, we tell React to only run this effect ONCE

  return detailedElement;
}
