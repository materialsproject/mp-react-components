import React, { useState } from 'react';
import { default as ReactSelect } from 'react-select';
import './Select.css';
import classNames from 'classnames';

export const Select: React.FC<any> = props => {
  const [open, setOpen] = useState(false);
  return (
    <div className={classNames('select-outer-container', {'is-open': open})}>
      <ReactSelect
        {...props}
        onMenuOpen={() => setOpen(true)}
        onMenuClose={() => setOpen(false)}
      />
    </div>
  );
}