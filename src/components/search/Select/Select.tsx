import React from 'react';
import { default as ReactSelect } from 'react-select';
import './Select.css';

export const Select: React.FC<any> = props => {
  return (
    <div className="select-outer-container">
      <ReactSelect
        {...props}
      />
    </div>
  );
}
