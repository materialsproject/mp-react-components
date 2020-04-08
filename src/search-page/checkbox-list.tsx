import React from 'react';
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
  checkboxes: Checkbox;
  selectionStyle: SelectionStyle;
}

export function CheckboxList(props: CheckboxList) {
  console.log(props);
  return (
    <div className="checkbox-list">
      {props.checkboxes.map(c => (
        <label key={c.name ? c.name : c.label}>
          <CheckBox {...c} />
          {c.label}
        </label>
      ))}
    </div>
  );
}
