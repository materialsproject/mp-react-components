import classNames from 'classnames';
import React, { ReactNode, useRef, useState } from 'react';
import { FaCaretDown, FaCaretRight } from 'react-icons/fa';
import { Column } from '../SearchUI/types';
import { initColumns } from '../SearchUI/utils';
import './DataBlock.css';

interface Props {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  data: object;
  columns?: Column[];
  expanded?: boolean;
}

const getColumnsFromKeys = (data: object): Column[] => {
  const keys = Object.keys(data);
  return keys.map((key) => {
    return {
      name: key,
      selector: key
    };
  });
};

export const DataBlock: React.FC<Props> = (props) => {
  const [columns, setColumns] = useState(() => {
    return props.columns ? initColumns(props.columns) : getColumnsFromKeys(props.data);
  });
  const [topColumns, setTopColumns] = useState(() =>
    columns.filter((c) => !c.hidden && !c.hiddenTop)
  );
  const [bottomColumns, setBottomColumns] = useState(() =>
    columns.filter((c) => !c.hidden && !c.hiddenBottom)
  );
  const [expanded, setExpanded] = useState(props.expanded);

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
    <div className={classNames('mpc-data-block', props.className)}>
      <div
        className={classNames('mpc-data-block-top', {
          expanded: expanded
        })}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="mpc-data-block-caret-container">
          {!expanded && <FaCaretRight className="mpc-data-block-caret" />}
          {expanded && <FaCaretDown className="mpc-data-block-caret" />}
        </div>
        <div className="mpc-data-block-item-container">
          {topColumns.map((c, i) => columnItem(c))}
        </div>
      </div>
      {expanded && (
        <div className="mpc-data-block-bottom">{bottomColumns.map((c, i) => columnItem(c))}</div>
      )}
    </div>
  );
};
