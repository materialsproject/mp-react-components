import React, { useState } from 'react';
import './select.less';
import Select, { components } from 'react-select';
import { CheckboxList, MCheckbox, SelectionStyle } from '../checkbox-list';
import {
  groupCheckboxes,
  groups,
  propertiesCheckbox,
  searchKeyToDisplayKey,
  spaceGroups
} from './space-groups';

console.log(spaceGroups);

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

export interface SelectSPProps {
  property: string;
  grouping: string;
}

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
      <span className="select-label">
        {' '}
        {searchKeyToDisplayKey[property]
          ? props.data[searchKeyToDisplayKey[property]]
          : props.data[property]}{' '}
      </span>
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
        return searchKeyToDisplayKey[property]
          ? option[searchKeyToDisplayKey[property]]
          : option[property];
      }}
      className="basic-multi-select"
      classNamePrefix="select"
    />
  );
};

//TODO(chab) decouple the two components

// we can do a simple mapper function

export default function(props) {
  const [property, setProperty] = useState(propertiesCheckbox[0].name); // ultimately from the props
  const [grouping, setGrouping] = useState(groupCheckboxes[0].name); // ultimately from the props

  return (
    <>
      <SelectSP property={property} grouping={grouping} />

      <div className="crystal-search">
        <div className="property">
          Search By :
          <CheckboxList
            checkboxes={propertiesCheckbox}
            selectionStyle={SelectionStyle.SINGLE}
            onChange={c => {
              setProperty(c[0]);
            }}
          />
        </div>
        <div className="grouping">
          Group By:
          <CheckboxList
            checkboxes={groupCheckboxes}
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
