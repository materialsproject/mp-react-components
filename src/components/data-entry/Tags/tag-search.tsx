import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { tags } from './tags';
import Select, { components, createFilter } from 'react-select';
import { FixedSizeList as List } from 'react-window';
import { CheckboxList, SelectionStyle } from '../checkboxes-list/checkbox-list';

const search = [
  { name: 'start', label: 'Start' },
  { name: 'whole', label: 'All' }
];
// we can do a simple mapper function
export const checkboxes = search.map((p) => ({
  checked: false,
  disabled: false,
  name: p.name,
  label: p.label
}));
const height = 35;
checkboxes[0].checked = true;

export default function TagSearch(props) {
  const [selection, setSelection] = useState(props.value);
  const [filter, setFilter] = useState('start');

  function customFilter({ label }, searchText: string) {
    if (filter === 'start') {
      return label.toLowerCase().startsWith(searchText.toLowerCase());
    } else {
      return label.toLowerCase().indexOf(searchText.toLowerCase()) > 0;
    }
  }

  useEffect(() => {
    if (selection !== props.value) {
      setSelection(props.value);
    }
  }, [props.value]);

  return (
    <>
      <Select
        defaultValue={null}
        value={selection}
        components={{ MenuList }}
        filterOption={customFilter}
        isMulti
        name="tag"
        onChange={(selected, event) => {
          setSelection(selected);
          props.onChange(selected);
        }}
        menuPortalTarget={document.body}
        options={tags}
        getOptionValue={(option) => option}
        getOptionLabel={(option) => option}
        className="basic-multi-select"
        classNamePrefix="select"
      />

      <div className="property">
        Input matches:
        <CheckboxList
          checkboxes={checkboxes}
          selectionStyle={SelectionStyle.SINGLE}
          onChange={(c) => {
            setFilter(c[0]);
          }}
        />
      </div>
    </>
  );
}

function MenuList(props) {
  const { options, children, maxHeight, getValue } = props;
  const [value] = getValue();
  const initialOffset = options.indexOf(value) * height;
  const mh = !children[0] || children[0].type.name === 'NoOptionMessage' ? 0 : maxHeight;
  const cb = useCallback(
    ({ index, style }) => <div style={style}>{children[index]}</div>,
    [children]
  );

  const b = useMemo(
    () => (
      <List
        height={!!mh ? mh : 0}
        itemCount={children.length || 0}
        itemSize={50}
        initialScrollOffset={initialOffset || 0}
      >
        {cb}
      </List>
    ),
    [children, initialOffset]
  );

  return b;
}
