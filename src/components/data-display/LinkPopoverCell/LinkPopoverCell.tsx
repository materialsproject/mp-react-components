import React, { useEffect, useRef } from 'react';
import {
  useSearchUIContext,
  useSearchUIContextActions
} from '../SearchUI/SearchUIContextProvider';
import './LinkPopoverCell.css';

const emptyCellPlaceholder = '-';

export interface LinkPopoverCellProps {
  /**
   * The column selector this cell belongs to. Used (together with `value`) by
   * the SearchUI context to identify which cell is currently active.
   */
  selector: string;
  /**
   * The cell value (also used as the link label). If falsy, an empty
   * placeholder is rendered instead.
   */
  value: any;
  /**
   * The full row object. Forwarded to Dash via `lastClickedCell` so callbacks
   * have access to sibling fields (e.g. `material_id`) without an extra lookup.
   */
  row: any;
}

/**
 * Renderer for `ColumnFormat.LINK_POPOVER` cells. Renders the cell value as a
 * link; clicking the link records the cell in the SearchUI context (which
 * surfaces it to Dash via `lastClickedCell`) and opens an inline popover
 * anchored to the right of the link. The popover body is sourced from
 * `state.popoverContent`, which Dash callbacks populate via the container's
 * `popoverContent` prop. While `popoverContent` is null, a loading message is
 * shown.
 *
 * Cells deliberately do NOT navigate on click — the popover supplies the
 * navigation choices instead.
 */
export const LinkPopoverCell: React.FC<LinkPopoverCellProps> = ({ selector, value, row }) => {
  const { state } = useSearchUIContext();
  const actions = useSearchUIContextActions();
  const wrapperRef = useRef<HTMLSpanElement>(null);

  const isEmpty = value === undefined || value === null || value === '';
  const isOpen =
    !isEmpty &&
    state.lastClickedCell &&
    state.lastClickedCell.selector === selector &&
    state.lastClickedCell.value === value;

  /**
   * Close the popover when the user clicks anywhere outside the wrapper.
   * Registered only while the popover is open to avoid leaking listeners.
   */
  useEffect(() => {
    if (!isOpen) return;
    const handleDocClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        actions.setLastClickedCell(null, null, null);
      }
    };
    document.addEventListener('mousedown', handleDocClick);
    return () => document.removeEventListener('mousedown', handleDocClick);
  }, [isOpen, actions]);

  if (isEmpty) {
    return <>{emptyCellPlaceholder}</>;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    actions.setLastClickedCell(selector, value, row);
  };

  return (
    <span ref={wrapperRef} className="mpc-link-popover-cell">
      <a href="#" className="mpc-link-popover-cell-link" onClick={handleClick}>
        {value}
      </a>
      {isOpen && (
        <span className="mpc-link-popover-cell-popover" role="dialog">
          {state.popoverContent != null ? (
            state.popoverContent
          ) : (
            <span className="mpc-link-popover-cell-loading">Loading…</span>
          )}
        </span>
      )}
    </span>
  );
};
