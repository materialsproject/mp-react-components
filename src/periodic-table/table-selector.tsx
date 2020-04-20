import React, { createRef, useContext, useEffect, useRef, useState } from 'react';
import {
  PeriodicSelectionContext,
  TableSelectionStyle
} from '../periodic-table/periodic-table-state/table-store';
import { Button, ButtonGroup } from '@zendeskgarden/react-buttons';
import { TABLE_DICO_V2 } from './periodic-table-data/table-v2';
import { distinctUntilKeyChanged, filter } from 'rxjs/operators';

/**
 *
 * Use this component to give the opportunity to have dual-state
 * selection on the periodic table
 *
 * */

export default function TableSelectionSelector() {
  const [selectedItem, setSelectedItem] = useState<TableSelectionStyle>(TableSelectionStyle.SELECT);
  const { actions } = useContext(PeriodicSelectionContext);

  useEffect(() => {
    actions.selectionStyle = TableSelectionStyle.SELECT;
    return () => {
      actions.selectionStyle = TableSelectionStyle.SELECT;
    };
  }, []);

  return (
    <ButtonGroup
      selectedItem={selectedItem}
      onSelect={s => {
        window.requestAnimationFrame(() => setSelectedItem(s));
        actions.selectionStyle = s;
      }}
    >
      <Button key="i1" value="select">
        Enable elements
      </Button>
      <Button key="i2" value="enableDisable">
        Exclude elements
      </Button>
    </ButtonGroup>
  );
}

/**
 *
 * This add n inputs to the periodic table. Each input matches a particular
 * elements. The table is able to identify a typed element
 *
 * @param labels
 * @constructor
 */
export function MultipleElementsSelector({ labels }) {
  // there is a bug in PeriodicSelectionContext, which cause double rendering
  //console.log('rendered');
  const { observable, actions } = useContext(PeriodicSelectionContext);
  const selectedElements = useRef<(string | null)[]>([]);
  //const refs: any = useMemo(() => Array.from({ length: labels.length }).map(() => createRef()), [labels]);
  const refs = useRef<React.RefObject<HTMLInputElement>[]>(
    Array.from({ length: labels.length }, () => createRef())
  );

  useEffect(() => {
    actions.selectionStyle = TableSelectionStyle.MULTI_INPUTS_SELECT;
    actions.currentElementIndex = 0;
    actions.selectedElements = selectedElements;
  }, [labels]);

  useEffect(() => {
    observable
      .pipe(
        distinctUntilKeyChanged('enabledElements'),
        filter(k => k.lastAction.type === 'select' || k.lastAction.type === 'deselect')
        //tap(a => console.log(a))
      )
      .subscribe(c => {
        // if we select an element, update the input fields
        const input = refs.current[actions.currentElementIndex];
        if (!input || !input.current) {
          console.warn('did not get ref', input);
        }
        const field = input.current!;
        if (c.lastAction.type === 'select') {
          field.value = c.lastAction.element;
          selectedElements.current[actions.currentElementIndex] = c.lastAction.element;
        } else if (c.lastAction.type === 'deselect') {
          field.value = '';
          selectedElements.current[actions.currentElementIndex] = null;
        }
        field.focus();
      });

    return () => {
      actions.selectionStyle = TableSelectionStyle.SELECT;
    };
  }, []);

  return (
    <div className="element-selector">
      {labels.map((label: string, idx: number) => (
        <div className="container" key={label}>
          <div className="label">{label}</div>
          <input
            ref={refs.current[idx]}
            className="label-input"
            type="text"
            onFocus={_ => (actions.currentElementIndex = idx)}
            onChange={({ target: { value } }) => {
              const potentialElement = value.charAt(0).toUpperCase() + value.slice(1);
              const d = TABLE_DICO_V2[potentialElement];
              if (
                !!selectedElements.current[idx] &&
                selectedElements.current[idx] !== potentialElement
              ) {
                const el: string = selectedElements.current[idx]!;
                selectedElements.current[idx] = null;
                actions.removeEnabledElement(el);
              }
              if (d) {
                // force selection of d
                actions.addEnabledElement(d.symbol);
                selectedElements.current[idx] = d.symbol;
              }
            }}
            maxLength={2}
          />
        </div>
      ))}
    </div>
  );
}
