import React, { useState } from 'react';
import { default as ReactSelect } from 'react-select';
import './Select.css';
import classNames from 'classnames';

interface SelectOption {
  label: string;
  value: any;
}

export interface SelectProps {
  [id: string]: any;
  onChange?: (value: any) => any;
  /**
   * Allow an object of arbitrary props to also
   * be added to the react-select component.
   *
   * This is workaround to let the Dash component
   * version of this component accept extra props
   * supported by react-select without the need to explicitly
   * define those props in the component's propTypes.
   */
  arbitraryProps?: object;
  /**
   * Dash-assigned callback that should be called whenever any of the
   * properties change
   */
  setProps?: (value: any) => any;
  /**
   * The current or initial selected value.
   * This can be the raw value or a full option object.
   */
  value?: any;
  /**
   * List of options to display in the dropdown.
   * Each option should be an object with a `label` and a `value`.
   */
  options: SelectOption[];
}

/**
 * Wrapper component for react-select.
 * Automatically adds the wrapper class "react-select-container"
 * and the class prefix "react-select-" to all the elements created by react-select.
 */
export const Select: React.FC<SelectProps> = (props) => {
  const { arbitraryProps, ...otherProps } = props;

  /** Attach object of arbitraryProps to the main props object */
  props = { ...otherProps, ...arbitraryProps };

  const [open, setOpen] = useState(false);
  /**
   * Set selected option based on value or defaultValue prop.
   * Value or defaultValue can be passed in as a full option object (as required by react-select)
   * or as a simple value.
   */
  let selected: SelectOption | null | undefined = props.options.find((option) => {
    if (props.value) {
      return option.value === props.value || option === props.value;
    } else if (props.defaultValue) {
      return option.value === props.defaultValue || option === props.defaultValue;
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
        onChange={(selectedOption) => {
          if (props.onChange) {
            props.onChange(selectedOption);
          }
          if (props.setProps) {
            const value = selectedOption && selectedOption.value ? selectedOption.value : null;
            props.setProps({ value });
          }
        }}
        onMenuOpen={() => setOpen(true)}
        onMenuClose={() => setOpen(false)}
      />
    </div>
  );
};
