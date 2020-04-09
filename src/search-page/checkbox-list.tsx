import React, { useEffect, useRef, useState } from 'react';
import CheckBox from 'rc-checkbox';
import './checkbox-list.less';

interface Checkbox {
  name: string;
  label: string;
  checked: boolean;
  disabled: boolean;
}

enum SelectionStyle {
  SINGLE = 'single',
  MULTI = 'multi'
}

interface CheckboxList {
  checkboxes: Checkbox[];
  selectionStyle: SelectionStyle;
  onChange: Function;
}

export function CheckboxList(props: CheckboxList) {
  const checkbox = useRef<any>();

  const [checkboxes, setCheckboxes] = useState([] as Checkbox[]);

  useEffect(() => {
    setCheckboxes([...props.checkboxes]);
    checkbox.current = props.checkboxes.reduce((acc, c) => {
      c.checked && (acc[c.name] = c);
      return acc;
    }, {});
    console.log(checkbox);
  }, [props.checkboxes]);

  return (
    <div className="checkbox-list">
      {checkboxes.map(c => (
        <label key={c.name ? c.name : c.label}>
          <CheckBox
            onChange={ch => {
              if (props.selectionStyle === SelectionStyle.SINGLE) {
                for (let [key, value] of Object.entries(checkbox.current)) {
                  (value as any).checked = false;
                }
                checkbox.current = {};
              }
              if ((ch.target! as any).checked) {
                checkbox.current[c.name] = c;
                c.checked = true;
              } else {
                delete checkbox.current[c.name];
                c.checked = false;
              }
              props.onChange(Object.keys(checkbox.current));
              setCheckboxes([...checkboxes]);
            }}
            disabled={c.disabled}
            checked={c.checked}
          />
          {c.label}
        </label>
      ))}
    </div>
  );
}
