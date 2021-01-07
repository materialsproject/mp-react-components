import * as React from 'react';
import { TableSelectionStyle, useElements } from './periodic-table-state/table-store';
import { Table, TableLayout } from './periodic-table-component/periodic-table.component';
import { useEffect } from 'react';

interface SelectableTableProps {
  /** array of enabled elements, e.g : ['H', 'O'] */
  enabledElements?: string[];
  /** array of disabled elements, e.g : ['H', 'O'] */
  disabledElements?: string[];
  /** array of hidden elements, e.g : ['H', 'O'] */
  hiddenElements?: string[];
  /** prevent user to select more than N elements */
  maxElementSelectable: number;
  /** callback called with an array of selected elements */
  onStateChange?: (selected: string[]) => void;
  /** whether to force a particular layout */
  forceTableLayout?: TableLayout;
  /** whether to forward non-managed changes */
  forwardOuterChange?: boolean;
  /** component to be plugged into the top spacer */
  plugin?: JSX.Element;
  children?;
  /** toggle disabling all table components */
  disabled?: boolean;
}

export function SelectableTable(props: SelectableTableProps) {
  const { tableStateStore, disabledEls, hiddenEls, enabledEls } = useElementsWithState(props);
  return (
    <Table
      onElementClicked={(element) =>
        tableStateStore.selectionStyle === TableSelectionStyle.SELECT ||
        tableStateStore.selectionStyle === TableSelectionStyle.MULTI_INPUTS_SELECT
          ? tableStateStore.toggleEnabledElement(element.symbol)
          : tableStateStore.toggleDisabledElement(element.symbol)
      }
      onElementMouseOver={(element) => tableStateStore.setDetailedElement(element.symbol)}
      onElementMouseLeave={(element) => tableStateStore.setDetailedElement(null)}
      forceTableLayout={props.forceTableLayout}
      disabledElement={disabledEls}
      hiddenElement={hiddenEls}
      enabledElement={enabledEls}
      showSwitcher
      {...props}
    />
  );
}

export const useElementsWithState = (props: SelectableTableProps) => {
  // could be memoized
  const {
    enabledElements: enabledEls,
    disabledElements: disabledEls,
    hiddenElements: hiddenEls,
    actions: tableStateStore,
  } = useElements(props.maxElementSelectable, props.onStateChange);

  useEffect(() => {
    tableStateStore.setForwardChange(props.forwardOuterChange);
  }, [props.forwardOuterChange]);

  useEffect(() => {
    //TODO(chab) let's suppose this change on the fly, we might need to deselect all the extraneous element
    tableStateStore.setMaxSelectionLimit(props.maxElementSelectable);
  }, [props.maxElementSelectable]);

  return {
    tableStateStore,
    enabledEls,
    disabledEls,
    hiddenEls,
  };
};
