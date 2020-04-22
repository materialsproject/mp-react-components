import * as React from 'react';
import { getPeriodicSelectionStore, PeriodicSelectionContext } from './table-store';
import { useMemo, useEffect, useRef } from 'react';
import { arrayToDictionnary } from '../../utils/utils';

export function PeriodicContext(props: any) {
  const store = useMemo(() => getPeriodicSelectionStore(), []);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current &&
      store.actions.setEnabledElements(turnToDictionnaryIfNeeded(props.enabledElements));
  }, [props.enabledElements]);
  useEffect(() => {
    isMounted.current &&
      store.actions.setDisabledElements(turnToDictionnaryIfNeeded(props.disabledElements));
  }, [props.disabledElements]);
  useEffect(() => {
    isMounted.current &&
      store.actions.setHiddenElements(turnToDictionnaryIfNeeded(props.hiddenElements));
  }, [props.hiddenElements]);

  useEffect(() => {
    store.actions.init({
      enabledElements: props.enabledElements || {},
      disabledElements: props.disabledElements || {},
      hiddenElements: props.hiddenElements || {},
      forwardOuterChange: props.forwardOuterChange,
      detailedElement: props.detailedElement,
      lastAction: {} as any
    });
    isMounted.current = true;
  }, []);

  return (
    <PeriodicSelectionContext.Provider value={store}>
      {{ ...props.children }}
    </PeriodicSelectionContext.Provider>
  );
}

function turnToDictionnaryIfNeeded(arrayOrObject) {
  return Array.isArray(arrayOrObject) ? arrayToDictionnary(arrayOrObject) : arrayOrObject;
}
