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
  hasLabel?: boolean;
  truthyLabel?: string;
  falsyLabel?: string;
  onChange?: (value: boolean) => any;
}

/**
 * Simple boolean switch
 */
export const Switch: React.FC<SwitchProps> = ({
  value = false,
  truthyLabel = 'On',
  falsyLabel = 'Off',
  ...otherProps
}) => {
  const props = { value, truthyLabel, falsyLabel, ...otherProps };
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
      {props.value ? (
        <FaToggleOn className="mpc-switch-icon" onClick={handleClick} />
      ) : (
        <FaToggleOff className="mpc-switch-icon" onClick={handleClick} />
      )}
      {props.hasLabel && (
        <span className="mpc-switch-label">
          {props.value ? props.truthyLabel : props.falsyLabel}
        </span>
      )}
    </div>
  );
};
