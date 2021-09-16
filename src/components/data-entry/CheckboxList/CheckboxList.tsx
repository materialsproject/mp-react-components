import React, { useEffect, useState } from 'react';

interface Option {
  value: any;
  label: string | number;
  checked?: boolean;
}

interface Props {
  options: Option[];
  values?: any[];
  onChange?: (value: any) => void;
}

const initOptions = (options: Option[], values?: any[]) => {
  return options.map((d) => {
    if (values) {
      d.checked = values.indexOf(d.value) > -1 ? true : false;
    } else if (!d.hasOwnProperty('checked')) {
      d.checked = false;
    }
    return d;
  });
};

const getCheckedValues = (ops: Option[]) => {
  const checkedValues: any[] = [];
  ops.forEach((d) => {
    if (d.checked) {
      checkedValues.push(d.value);
    }
  });

  return checkedValues;
};

export const CheckboxList: React.FC<Props> = (props) => {
  const [options, setOptions] = useState(initOptions(props.options, props.values));

  const handleChange = (index: number) => {
    let newOptions = [...options];
    newOptions[index].checked = !newOptions[index].checked;
    const newValues = getCheckedValues(newOptions);
    if (props.onChange) props.onChange(newValues);
    setOptions(newOptions);
  };

  useEffect(() => {
    setOptions(initOptions(props.options, props.values));
  }, [props.values]);

  return (
    <div className="checkbox-list">
      {options.map((d, i) => (
        <div key={i}>
          <label className="checkbox">
            <input
              type="checkbox"
              value={d.value}
              checked={d.checked}
              onChange={(e) => handleChange(i)}
            />
            {d.label}
          </label>
        </div>
      ))}
    </div>
  );
};
