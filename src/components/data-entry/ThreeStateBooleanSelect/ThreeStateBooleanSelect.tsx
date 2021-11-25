import React, { useEffect, useRef, useState } from 'react';
import { Select } from '../Select';
import { SelectOption } from '../Select/Select';

export interface ThreeStateBooleanSelectProps {
  /**
   * List of two options: one for `true` and one for `false`.
   * The third `undefined` option is included automatically with the label "Any."
   * Each option should be an object with a `label` and a `value` where the value is either true or false.
   */
  options: SelectOption[];
  /**
   * The current or initial selected value.
   * Must be `true`, `false`, or `undefined`.
   */
  value?: boolean;
  /**
   * Function to handle what happens when an option is selected.
   */
  onChange?: (value: any) => void;
}

/**
 * A select component that handles values that can be true, false, or undefined.
 * The undefined option will automatically render with the label "Any."
 */
export const ThreeStateBooleanSelect: React.FC<ThreeStateBooleanSelectProps> = ({
  options,
  value,
  onChange
}) => {
  const threeOptions = [options[0], options[1], { label: 'Any', value: undefined }];
  const selected = threeOptions.find((option) => option.value === value);
  return <Select options={threeOptions} value={selected} onChange={onChange} />;
};
