import { Observable, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  distinctUntilKeyChanged,
  map,
  shareReplay,
  tap,
} from 'rxjs/operators';
import * as React from 'react';
import { useContext } from 'react';
import { mapArrayToBooleanObject } from '../../crystal-toolkit/utils';

// TODO(chab) break that store into multiple pieces
// 1) what is used for rendering, via RXJS
// 2) what is used for internals, it's like some kind of context/private state

// makes an abstraction on top of process
declare const process: any; // via dotenv

//FIXME
//This is equivalent to a singleton, i.e, this store is going to be shared amongst ALL the table that use it

interface ElementState {
  [symbol: string]: boolean;
}

interface State {
  disabledElements: ElementState;
  enabledElements: ElementState;
  hiddenElements: ElementState;
  detailedElement: string | null;
  forwardOuterChange: boolean;
  lastAction: { type: 'select' | 'deselect'; element: string };
}

export enum TableSelectionStyle {
  ENABLE_DISABLE = 'enableDisable',
  SELECT = 'select',
  MULTI_INPUTS_SELECT = 'mis',
}

const getDefaultState: () => Readonly<State> = () => ({
  disabledElements: {},
  enabledElements: {},
  detailedElement: null,
  hiddenElements: {},
  forwardOuterChange: true,
  lastAction: {} as any,
});

export function getPeriodicSelectionStore() {
  let state: State = getDefaultState();
  const state$: Subject<State> = new Subject();
  state$.next(state);
  let maxItemAllowed = 5; // Number.MAX_SAFE_INTEGER;
  const observable: Observable<State> =
    !process.env.DEBUG && !(process.env.NODE_ENV === 'test')
      ? state$.pipe(shareReplay(1))
      : state$.pipe(
          tap((s) => {
            /*console.log(s)*/
          }),
          shareReplay(1)
        );
  let lastElementsToggled: string = '';
  const actions = {
    // only use it in test, instead, change the props of the context react element
    init: (initialState: State = getDefaultState()) => {
      // use object assign instead

      if (initialState.disabledElements)
        state.disabledElements = mapArrayToBooleanObject(initialState.disabledElements);
      if (initialState.enabledElements)
        state.enabledElements = mapArrayToBooleanObject(initialState.enabledElements);
      if (initialState.hiddenElements)
        state.hiddenElements = mapArrayToBooleanObject(initialState.hiddenElements);
      if (initialState.detailedElement) state.detailedElement = initialState.detailedElement;
      if (initialState.forwardOuterChange)
        state.forwardOuterChange = initialState.forwardOuterChange;
      state$.next({ ...state });
    },
    selectionStyle: TableSelectionStyle.SELECT,
    // used when doing multi-inputs-selection
    currentElementIndex: 0,
    selectedElements: {} as any,
    //
    setForwardChange: (fwdChange) => (state.forwardOuterChange = fwdChange),
    setEnabledElements: (enabledElements: any) =>
      (state = { ...state, enabledElements }) && state$.next(state),
    setDisabledElements: (disabledElements: any) =>
      (state = { ...state, disabledElements }) && state$.next(state),
    clear: () => {
      state = getDefaultState();
      state$.next(state);
    },
    setDetailedElement: (el: string | null) =>
      (state = { ...state, detailedElement: el }) && state$.next(state),
    setHiddenElements: (hiddenElements: any) =>
      (state = { ...state, hiddenElements }) && state$.next(state),
    //TODO(chab) add check to prever unnecessary state mutation
    addEnabledElement: (enabledElement: string) => {
      state.lastAction = {} as any;
      (state.enabledElements = { ...state.enabledElements, [enabledElement]: true }) &&
        state$.next(state);
    },
    toggleDisabledElement: (disabledElement: string) => {
      if (!state.disabledElements[disabledElement]) {
        state.disabledElements = { ...state.disabledElements, [disabledElement]: true };
      } else {
        const _s = { ...state.disabledElements };
        delete _s[disabledElement];
        state.disabledElements = _s;
      }
      state$.next({
        ...state,
        forwardOuterChange: actions.selectionStyle === TableSelectionStyle.ENABLE_DISABLE,
      });
    },
    addDisabledElement: (disabledElement: string) =>
      (state.disabledElements = { ...state.disabledElements, [disabledElement]: true }) &&
      state$.next(state),
    removeEnabledElement: (enabledElement: string) => {
      state.lastAction = {} as any;
      if (!state.enabledElements[enabledElement]) {
        // if element is already removed, we do not want to trigger a state change
        state$.next(state);
        return;
      }
      const _s = { ...state.enabledElements };
      delete _s[enabledElement];
      (state.enabledElements = _s) && state$.next(state);
    },
    removeDisabledElement: (disabledElement: string) => {
      const _s = { ...state.disabledElements };
      delete _s[disabledElement];
      (state.disabledElements = _s) && state$.next(state);
    },
    toggleEnabledElement: (enabledElement: string) => {
      // we always forward toggling
      state.lastAction = {} as any;
      state.lastAction.element = enabledElement;
      if (!state.disabledElements[enabledElement]) {
        state.lastAction.type = 'select';
        if (!state.enabledElements[enabledElement]) {
          if (actions.selectionStyle === TableSelectionStyle.MULTI_INPUTS_SELECT) {
            if (actions.selectedElements.current[actions.currentElementIndex]) {
              //TODO(call own method)
              const _s = { ...state.enabledElements };
              delete _s[actions.selectedElements.current[actions.currentElementIndex]];
              state.enabledElements = _s;
            }
          }

          const _s = { ...state.enabledElements };
          if (Object.keys(state.enabledElements).length === maxItemAllowed) {
            delete _s[lastElementsToggled];
            _s[enabledElement] = true;
            lastElementsToggled = enabledElement;
            state.enabledElements = _s;
            state$.next({ ...state, forwardOuterChange: true });
          } else {
            lastElementsToggled = enabledElement;
            _s[enabledElement] = true;
            (state.enabledElements = _s) && state$.next({ ...state, forwardOuterChange: true });
          }
        } else {
          delete state.enabledElements[enabledElement];
          state.lastAction.type = 'deselect';

          (state.enabledElements = { ...state.enabledElements }) &&
            state$.next({ ...state, forwardOuterChange: true });
        }
      }
    },
    setMaxSelectionLimit: (maxItem: number) => {
      maxItemAllowed = maxItem;
    },
  };

  return {
    observable,
    actions,
  };
}

type Actions = ReturnType<typeof getPeriodicSelectionStore>;

export const PeriodicSelectionContext = React.createContext({
  observable: {} as Observable<State>,
  actions: {},
} as Actions);

/**
 *
 * Call this function inside a component. It will make the components aware of which elements are selected/disabled
 * Be careful, as this will trigger a rendering every time a component is selected/unselected
 *
 **/
export function useElements(maxElementSelection: number = 10, onStateChange?: any) {
  const [disabledElements, setDisabled] = React.useState({});
  const [enabledElements, setEnabled] = React.useState({});
  const [hiddenElements, setHiddenElements] = React.useState({});
  const [lastAction, setLastAction] = React.useState<State['lastAction']>();
  const { observable, actions } = useContext(PeriodicSelectionContext);

  React.useEffect(() => {
    actions.setMaxSelectionLimit(maxElementSelection);
    // Update the view of the components that use it
    const subscription = observable.subscribe(
      ({ enabledElements, disabledElements, hiddenElements, lastAction }: any) => {
        setDisabled(disabledElements);
        setEnabled(enabledElements);
        setHiddenElements(hiddenElements);
        setLastAction(lastAction);
      }
    );

    // Triggers external callback that dash user will provide
    const enabledElementsSubscription = observable
      .pipe(
        //tap(a => console.log(a)),
        map(({ enabledElements, disabledElements, forwardOuterChange }: any) => ({
          enabledElements,
          disabledElements,
          forwardOuterChange,
        })),
        distinctUntilChanged((p, q) => {
          return (
            p.enabledElements === q.enabledElements && p.disabledElements === q.disabledElements
          );
        })
      )
      .subscribe(({ enabledElements, disabledElements, forwardOuterChange }) => {
        forwardOuterChange &&
          onStateChange &&
          onStateChange({
            enabledElements: Object.keys(enabledElements),
            disabledElements: Object.keys(disabledElements),
          });
      });

    // clean up subscription;
    return () => {
      subscription.unsubscribe();
      enabledElementsSubscription.unsubscribe();
    };
  }, []); // by passing an empty array, we tell React to only run this effect ONCE

  return { disabledElements, enabledElements, hiddenElements, lastAction, actions };
}

export function useDetailedElement() {
  const [detailedElement, setDetailedElement] = React.useState('');
  const { observable } = useContext(PeriodicSelectionContext);

  //FIXME(chab) this is a hack for the tests, this situation would not happen in real life
  // No context defined, you need to manage detailed element by yourself
  if (!observable.subscribe) {
    return detailedElement;
  }

  React.useEffect(() => {
    const subscription = observable.subscribe(({ detailedElement }) => {
      setDetailedElement(detailedElement!);
    });

    // clean up subscription;
    return () => subscription.unsubscribe();
  }, []); // by passing an empty array, we tell React to only run this effect ONCE

  return detailedElement;
}
