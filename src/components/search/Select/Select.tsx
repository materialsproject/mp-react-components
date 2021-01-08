import React, { useState } from 'react';
import { default as ReactSelect } from 'react-select';
import './Select.css';
import classNames from 'classnames';

/**
 * Wrapper component for react-select
 * Automatically adds the wrapper class "react-select-container"
 * and the class prefix "react-select-" to all the elements created by react-select
 */

export const Select: React.FC<any> = (props) => {
  const [open, setOpen] = useState(false);
  /**
   * Set selected option based on value or defaultValue prop.
   * Value or defaultValue can be passed in as a full option object (as required by react-select)
   * or as a simple value.
   */
  let selected = props.options.find((option) => {
    if (props.value) {
      return option.value === props.value || option === props.value;
    } else if (props.defaultValue) {
      return option.defaultValue === props.defaultValue || option === props.defaultValue;
    } else {
      return;
    }
  });
  /** react-select values can't be undefined so use null instead */
  selected = selected ? selected : null;

  return (
    <div
      data-testid="select"
      className={classNames('react-select-outer-container', { 'is-open': open })}
    >
      <ReactSelect
        {...props}
        className="react-select-container"
        classNamePrefix="react-select"
        value={selected}
        onMenuOpen={() => setOpen(true)}
        onMenuClose={() => setOpen(false)}
      />
    </div>
  );
};
