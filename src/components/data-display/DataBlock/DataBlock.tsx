import classNames from 'classnames';
import React, { ReactNode, useRef, useState } from 'react';
import Collapsible from 'react-collapsible';
import { FaBicycle, FaCaretDown, FaCaretRight, FaCaretUp } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import { Column } from '../SearchUI/types';
import { initColumns } from '../SearchUI/utils';
import { Tooltip } from '../../data-display/Tooltip';
import './DataBlock.css';

interface Props {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  data: object;
  columns?: Column[];
  expanded?: boolean;
  footer?: ReactNode;
  iconClassName?: string;
  iconTooltip?: string;
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

export const DataBlock: React.FC<Props> = (props) => {
  const [columns, setColumns] = useState(() => {
    return props.columns ? initColumns(props.columns) : getColumnsFromKeys(props.data);
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
      {bottomColumns && (
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
