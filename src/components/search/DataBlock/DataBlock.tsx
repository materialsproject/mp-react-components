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
  columns: Column[];
}

const getColumnsFromKeys = (data: object): Column[] => {
  const keys = Object.keys(data);
  return keys.map((key) => {
    return {
      name: key,
      selector: key,
    };
  });
};

export const DataBlock: React.FC<Props> = (props) => {
  const [columns, setColumns] = useState(() =>
    props.columns ? initColumns(props.columns) : getColumnsFromKeys(props.data)
  );
  const [bottomColumns, setBottomColumns] = useState(() => columns);
  const [expanded, setExpanded] = useState(false);

  const columnItem = (c: Column) => (
    <div key={c.selector} className="mpc-data-block-item">
      <div className="heading">{c.name}</div>
      <div>
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
      <div className="mpc-data-block-top" onClick={() => setExpanded(!expanded)}>
        <div className="mpc-data-block-item-container">{columns.map((c, i) => columnItem(c))}</div>
        <div className="mpc-data-block-caret-container">
          {!expanded && <FaCaretRight className="mpc-data-block-caret" />}
          {expanded && <FaCaretDown className="mpc-data-block-caret" />}
        </div>
      </div>
      {expanded && (
        <div className="mpc-data-block-bottom">{bottomColumns.map((c, i) => columnItem(c))}</div>
      )}
    </div>
  );
};
