import classNames from 'classnames';
import React, { ReactNode, useRef, useState } from 'react';
import Collapsible from 'react-collapsible';
import { FaBicycle, FaCaretDown, FaCaretRight, FaCaretUp } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import { Column } from '../SearchUI/types';
import { initColumns } from '../SearchUI/utils';
import { Tooltip } from '../../data-display/Tooltip';
import './DataBlock.css';

export interface DataBlockProps {
  /**
   * The ID used to identify this component in Dash callbacks
   */
  id?: string;
  /**
   * Dash-assigned callback that should be called whenever any of the
   * properties change
   */
  setProps?: (value: any) => any;
  /**
   * Class name(s) to append to the component's default class (`mpc-data-block`)
   */
  className?: string;
  /**
   * Object to render inside the data block.
   * A key value must be a string, number, or array of strings/numbers.
   * Key values cannot be objects.
   */
  data: object;
  /**
   * An array of column definition objects to control how keys/values are rendered in the data block.
   * See `Column` documentation for specifics on how to construct `Column` objects.
   * If no column definitions are supplied, the key names are used as labels and the values are rendered
   * without any formatting.
   */
  columns?: Column[];
  /**
   * Set to true to have bottom columns section expanded on load.
   */
  expanded?: boolean;
  /**
   * Content to display at the bottom-most section of the block.
   */
  footer?: ReactNode;
  /**
   * Class name of an icon to display in the top right of the block.
   */
  iconClassName?: string;
  /**
   * Tooltip text to display when hovering over the icon.
   */
  iconTooltip?: string;
  /**
   * This is a temporary solution to allow SearchUI's to render in Storybook.
   * There is an issue with the dynamic column header components that causes
   * Storybook to crash. Rendering column headers as plain strings fixes the problem.
   * Note that this will disable column tooltips and unit labels.
   */
  disableRichColumnHeaders?: boolean;
}

const getColumnsFromKeys = (data: object): Column[] => {
  const keys = Object.keys(data);
  return keys.map((key) => {
    return {
      title: key,
      selector: key
    };
  });
};

/**
 * Component for displaying a single row (object) of data in a card-like block.
 * Blocks have a top section that displays data horizontally and an optional collapsible bottom
 * section that displays data vertically.
 */
export const DataBlock: React.FC<DataBlockProps> = (props) => {
  const [columns, setColumns] = useState(() => {
    return props.columns
      ? initColumns(props.columns, props.disableRichColumnHeaders)
      : getColumnsFromKeys(props.data);
  });
  const [topColumns, setTopColumns] = useState(() =>
    columns.filter((c) => !c.hidden && (c.isTop || (!c.isTop && !c.isBottom)))
  );
  const [bottomColumns, setBottomColumns] = useState(() =>
    columns.filter((c) => !c.hidden && c.isBottom)
  );
  const [expanded, setExpanded] = useState(props.expanded);
  const tooltipId = 'data-block-tooltip-' + uuidv4();

  const columnItem = (c: Column) => (
    <div
      key={c.selector}
      className="mpc-data-block-item"
      style={{
        width: c.width || 'auto',
        minWidth: c.minWidth || 'auto',
        maxWidth: c.maxWidth || 'auto'
      }}
    >
      <div className="heading">{c.name}</div>
      <div className="value">
        {typeof c.cell === 'function'
          ? c.cell(props.data)
          : typeof c.format === 'function'
          ? c.format(props.data)
          : props.data[c.selector]}
      </div>
    </div>
  );

  return (
    <div id={props.id} className={classNames('mpc-data-block', props.className)}>
      <div className="mpc-data-block-header">
        {topColumns.map((c, i) => columnItem(c))}
        {props.iconClassName && (
          <span className="mpc-data-block-icon-container">
            <span
              data-testid="data-block-icon"
              className="mpc-data-block-icon"
              data-tip={props.iconTooltip}
              data-for={props.iconTooltip && tooltipId}
            >
              <i className={props.iconClassName}></i>
            </span>
          </span>
        )}
        {props.iconTooltip && <Tooltip id={tooltipId}>{props.iconTooltip}</Tooltip>}
      </div>
      {bottomColumns && bottomColumns.length > 0 && (
        <div className="mpc-data-block-expandable">
          <Collapsible trigger={<span></span>} open={expanded} transitionTime={250}>
            {!expanded && <div className="mpc-data-block-fade"></div>}
            {bottomColumns.map((c, i) => columnItem(c))}
          </Collapsible>
          <p className="mpc-data-block-trigger">
            <a onClick={() => setExpanded(!expanded)}>{expanded ? 'See less' : 'See more'}</a>
            <span className="mpc-data-block-caret" onClick={() => setExpanded(!expanded)}>
              {expanded ? <FaCaretUp /> : <FaCaretDown />}
            </span>
          </p>
        </div>
      )}
      {(props.footer || props.children) && (
        <div className="mpc-data-block-footer">{props.footer || props.children}</div>
      )}
    </div>
  );
};
