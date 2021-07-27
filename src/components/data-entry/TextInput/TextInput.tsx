import React, { useEffect, useState } from 'react';
import { useDebounce } from '../../../utils/hooks';

interface Props {
  value: any;
  debounce?: number;
  onChange: (value: any) => any;
}

export const TextInput: React.FC<Props> = (props) => {
  const [inputValue, setInputValue] = useState(props.value);
  const debouncedInputValue = props.debounce ? useDebounce(inputValue, props.debounce) : inputValue;

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  /**
   * This effect is triggered after the debouncedInputValue is set
   * The debouncedInputValue is set with inputValue after the specified debounce time
   * If no debounce prop is supplied, there is no debounce and debouncedInputValue is exactly the same as inputValue
   * Triggers the onChange event prop for the value prop
   */
  useEffect(() => {
    props.onChange(debouncedInputValue);
  }, [debouncedInputValue]);

  /**
   * This effect is triggered when the value prop is changed directly from outside this component
   * Here inputValue is set, triggering debouncedInputValue to get set after the debounce timer
   */
  useEffect(() => {
    setInputValue(props.value);
  }, [props.value]);

  return <input type="text" className="input" value={inputValue || ''} onChange={handleChange} />;
};
