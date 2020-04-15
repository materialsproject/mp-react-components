import * as React from 'react';
import { getPeriodicSelectionStore, PeriodicSelectionContext } from './table-store';
import { useMemo, useEffect } from 'react';

export function PeriodicContext(props: any) {
  // We consider that the store will never change once the element is mounted
  // the store will deliver changes, but will not change itself
  const store = useMemo(() => getPeriodicSelectionStore(), []);

  useEffect(() => {
    store.actions.init({
      enabledElements: props.enabledElements || {},
      disabledElements: props.disabledElements || {},
      hiddenElements: props.hiddenElements || {},
      forwardOuterChange: props.forwardOuterChange,
      detailedElement: props.detailedElement
    });
  }, [
    props.enabledElements,
    props.disabledElements,
    props.hiddenElements,
    props.detailedElement,
    props.forwardOuterChange
  ]);

  return (
    <PeriodicSelectionContext.Provider value={store}>
      {{ ...props.children }}
    </PeriodicSelectionContext.Provider>
  );
}
