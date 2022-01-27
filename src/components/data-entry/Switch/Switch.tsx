import classNames from 'classnames';
import React from 'react';
import { FaToggleOff, FaToggleOn } from 'react-icons/fa';
import './Switch.css';

interface SwitchProps {
  id?: string;
  /**
   * Dash-assigned callback that should be called whenever any of the
   * properties change
   */
  setProps?: (value: any) => any;
  className?: string;
  value?: boolean;
  onChange?: (value: boolean) => any;
}

/**
 * Simple boolean switch
 */
export const Switch: React.FC<SwitchProps> = (props) => {
  const handleClick = () => {
    const newValue = !props.value;
    if (props.onChange) {
      props.onChange(newValue);
    }
    if (props.setProps) {
      props.setProps({ value: newValue });
    }
  };

  return (
    <div id={props.id} className={classNames('mpc-switch', props.className)}>
      {props.value ? <FaToggleOn onClick={handleClick} /> : <FaToggleOff onClick={handleClick} />}
    </div>
  );
};
