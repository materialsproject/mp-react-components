import React, { useState } from 'react';
import './select.less';

import Select, { components } from 'react-select';
import { options, options2 } from './group-search';
import { CheckboxList, MCheckbox, SelectionStyle } from '../checkbox-list';

const properties = ['number', 'shortName', 'fedorov']; // introspect data source
const groupStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
};
const groupBadgeStyles: any = {
  backgroundColor: '#EBECF0',
  borderRadius: '2em',
  color: '#172B4D',
  display: 'inline-block',
  fontSize: 12,
  fontWeight: 'normal',
  lineHeight: '1',
  minWidth: 1,
  padding: '0.16666666666667em 0.5em',
  textAlign: 'center'
};

export const SelectSP: React.FC<any> = props => {
  const property = props.property ? props.property : 'number';
  const [selection, setSelection] = useState([] as any[]); // todo sync with upper state

  console.log(groups, groups[props.grouping]);
  const formatGroupLabel = (data, p) => (
    <div
      onClick={() => {
        setSelection(data.options);
      }}
      style={groupStyles}
    >
      <span>{data.label}</span>
      <span style={groupBadgeStyles}>{data.options.length}</span>
    </div>
  );

  const MultiValueLabel = props => (
    <>
      <span> {props.data[property]} </span>
    </>
  );

  return (
    <Select
      defaultValue={null}
      value={selection}
      components={{ MultiValueLabel }}
      isMulti
      formatGroupLabel={formatGroupLabel}
      name="colors"
      onChange={(selected, event) => {
        console.log(selected, event);
        setSelection(selected);
      }}
      menuPortalTarget={document.body}
      options={groups[props.grouping]}
      getOptionValue={option => {
        return option[property];
      }}
      getOptionLabel={option => {
        return option[property];
      }}
      className="basic-multi-select"
      classNamePrefix="select"
    />
  );
};

const checkboxes: MCheckbox[] = properties.map(p => ({
  checked: false,
  disabled: false,
  name: p,
  label: p
}));

// we can do a simple mapper function
const c2 = ['Crystal group', 'Point group'].map(p => ({
  checked: false,
  disabled: false,
  name: p,
  label: p
}));

const groups = {
  'Crystal group': options,
  'Point group': options2
};

checkboxes[0].checked = true;
c2[0].checked = true;
export default function(props) {
  const [property, setProperty] = useState(properties[0]); // ultimately from the props
  const [grouping, setGrouping] = useState(c2[0].name); // ultimately from the props

  return (
    <>
      <SelectSP property={property} grouping={grouping} />

      <div className="crystal-search">
        <div className="property">
          Search By :
          <CheckboxList
            checkboxes={checkboxes}
            selectionStyle={SelectionStyle.SINGLE}
            onChange={c => {
              setProperty(c[0]);
            }}
          />
        </div>
        <div className="grouping">
          Group By:
          <CheckboxList
            checkboxes={c2}
            selectionStyle={SelectionStyle.SINGLE}
            onChange={c => {
              setGrouping(c[0]);
            }}
          />
        </div>
      </div>
    </>
  );
}
