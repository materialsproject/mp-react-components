import React, { useState } from 'react';

import Select, { components } from 'react-select';
import { options } from './group-search';
import { CheckboxList, MCheckbox, SelectionStyle } from '../checkbox-list';

const properties = ['number', 'shortName', 'fedorov']; // introspect data source

export const SelectSP: React.FC<any> = props => {
  const property = props.property ? props.property : 'number';

  const MultiValueLabel = props => (
    <>
      <span> {props.data[property]} </span>
    </>
  );

  return (
    <Select
      defaultValue={[]}
      components={{ MultiValueLabel }}
      isMulti
      name="colors"
      menuPortalTarget={document.body}
      options={options}
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

checkboxes[0].checked = true;
export default function(props) {
  const [property, setProperty] = useState(properties[0]); // ultimately from the props

  return (
    <>
      <SelectSP property={property} />
      <CheckboxList
        checkboxes={checkboxes}
        selectionStyle={SelectionStyle.SINGLE}
        onChange={c => {
          setProperty(c[0]);
        }}
      />
    </>
  );
}
