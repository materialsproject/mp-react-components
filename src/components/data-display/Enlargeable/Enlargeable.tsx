import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { toByteArray } from 'base64-js';
import classNames from 'classnames';
import { FaCompress, FaCompressAlt, FaExpand, FaExpandAlt } from 'react-icons/fa';
import './Enlargeable.css';

export interface EnlargeableProps {
  /**
   * The ID used to identify this component in Dash callbacks.
   */
  id?: string;
  /**
   * Dash-assigned callback that should be called to report property changes
   * to Dash, to make them available for callbacks.
   */
  setProps?: (value: any) => any;
  /**
   * Additional class to apply to the modal-content element
   */
  className?: string;
  expanded?: boolean;
  setExpanded?: Dispatch<SetStateAction<boolean>>;
  hideButton?: boolean;
}

/**
 * Wrap around a content or a component to enable that content to be enlarged in a full screen modal.
 */
export const Enlargeable: React.FC<EnlargeableProps> = ({ className = '', ...otherProps }) => {
  const props = { className, ...otherProps };
  let expanded: boolean = false;
  let setExpanded: Dispatch<SetStateAction<boolean>>;

  /**
   * Expanded variabled can be controlled from inside the component
   * or outside the component if props are supplied.
   */
  if (!props.expanded || !props.setExpanded) {
    var [expandedState, setExpandedState] = useState(false);
    expanded = expandedState;
    setExpanded = setExpandedState;
  } else {
    expanded = props.expanded;
    setExpanded = props.setExpanded;
  }

  return (
    <div
      id={props.id}
      className={classNames('mpc-expandable', {
        'modal is-active': expanded,
        [props.className]: !expanded
      })}
    >
      <div
        className={classNames({
          'modal-background': expanded
        })}
        onClick={() => setExpanded(false)}
      ></div>
      <div
        className={classNames({
          'modal-content is-large': expanded,
          [props.className]: expanded
        })}
      >
        {!props.hideButton && (
          <button className="button mpc-enlarge-button" onClick={() => setExpanded(!expanded)}>
            {expanded ? <FaCompress /> : <FaExpand />}
          </button>
        )}
        {props.children}
      </div>
    </div>
  );
};
