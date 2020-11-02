import React, { useEffect, useRef, useState } from 'react';
import CheckBox from 'rc-checkbox';
import './checkbox-list.less';

interface Option {
  value: any;
  label: string | number;
  checked?: boolean;
}

interface Props {
  options: Option[];
  onChange?: (value: any) => void;
}

const initOptions = (options: Option[]) => {
  return options.map(d => {
    if (!d.hasOwnProperty('checked')) d.checked = false;
    return d;
  });
}
const getCheckedValues = (ops: Option[]) => {
  const checkedValues: any[] = [];
  ops.forEach((d) => {
    if (d.checked) {
      checkedValues.push(d.value);
    }
  });
  if (checkedValues.length === ops.length) {
    return null;
  } else {
    return checkedValues;
  }
};

export const CheckboxList: React.FC<Props> = props => {
  const [options, setOptions] = useState(initOptions(props.options));
  const [values, setValues] = useState(getCheckedValues(props.options));

  const handleChange = (index: number) => {
    let newOptions = [...options];
    newOptions[index].checked = !newOptions[index].checked;
    const newValues = getCheckedValues(newOptions);
    if (props.onChange) props.onChange(newValues);
    setOptions(newOptions);
    setValues(newValues);
  };

  return (
    <div className="checkbox-list">
      {options.map((d, i) => (
        <label key={i} className="checkbox">
          <input 
            type="checkbox"
            value={d.value}
            checked={d.checked}
            onChange={(e) => handleChange(i)}
          />
          {d.label}
        </label>
      ))}
    </div>
  );
}
