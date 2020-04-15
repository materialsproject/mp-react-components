import CheckBox from 'rc-checkbox';
import * as React from 'react';

export const FilterComponent = ({ filterValue, onFilter }) => (
  <>
    Show only material with bandgap
    <CheckBox onChange={onFilter} value={filterValue} />
  </>
);
