import React, { useState } from 'react';
import { default as ReactSelect } from 'react-select';
import './Select.css';
import classNames from 'classnames';

export const Select: React.FC<any> = (props) => {
  const [open, setOpen] = useState(false);
  return (
    <div data-testid="select" className={classNames('select-outer-container', { 'is-open': open })}>
      <ReactSelect
        {...props}
        className="react-select-container"
        classNamePrefix="react-select"
        onMenuOpen={() => setOpen(true)}
        onMenuClose={() => setOpen(false)}
      />
    </div>
  );
};
