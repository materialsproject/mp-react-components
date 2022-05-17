import React, { useEffect } from 'react';
import classNames from 'classnames';
import './ButtonBar.css';

interface ButtonBarProps {
  /**
   * The ID used to identify this component in Dash callbacks.
   */
  id?: string;
  /**
   * Class name to apply to the top level of the component
   */
  className?: string;
  /**
   * Dash-assigned callback that should be called to report property changes
   * to Dash, to make them available for callbacks.
   */
  setProps?: (value: any) => any;
}

/**
 * Wrap around buttons to make a right-floating vertical bar of buttons
 */
export const ButtonBar: React.FC<ButtonBarProps> = (props) => {
  return (
    <div id={props.id} className={classNames('mpc-button-bar', props.className)}>
      {props.children}
    </div>
  );
};
