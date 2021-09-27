import classNames from 'classnames';
import React from 'react';
import ReactTooltip, { Effect, Place, Type } from 'react-tooltip';
import './Tooltip.css';

/**
 * Wrapper component for react-tooltip
 */

interface Props {
  /**
   * The ID used to identify this component in Dash callbacks
   */
  id?: string;

  /**
   * Dash-assigned callback that should be called whenever any of the
   * properties change
   */
  setProps?: (value: any) => any;
}

export const Modal: React.FC<Props> = (props) => {
  const { children, className, ...otherProps } = props;
  return (
    <div>
      <div className="modal">
        <div className="modal-background"></div>
        <div className="modal-content"></div>
        <button className="modal-close is-large" aria-label="close"></button>
      </div>
    </div>
  );
};
