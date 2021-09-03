import classNames from 'classnames';
import React, { useState } from 'react';
import { Button } from 'react-bulma-components';
import { FaTimes, FaTimesCircle } from 'react-icons/fa';
import { Formula } from '../Formula';
import { validateFormula } from '../../data-entry/MaterialsInput/utils';
import { ActiveFilter } from '../SearchUI/types';
import { formatPointGroup } from '../../data-entry/utils';
import './ActiveFilterButtons.css';

interface Props {
  className?: string;
  filters: ActiveFilter[];
  onClick: (defaultValue: any, id: string) => any;
}

const formatValue = (filter: ActiveFilter) => {
  if (Array.isArray(filter.value) && filter.value.length === 2 && !isNaN(filter.value[0])) {
    if (filter.defaultValue[0] !== 0 && filter.value[0] === filter.defaultValue[0]) {
      return `${filter.value[1]} or less`;
    } else if (filter.value[1] === filter.defaultValue[1]) {
      return `${filter.value[0]} or more`;
    } else {
      return `${filter.value[0]} to ${filter.value[1]}`;
    }
  } else if (filter.id === 'pointgroup') {
    return formatPointGroup(filter.value);
  } else if (validateFormula(filter.value.toString())) {
    return <Formula>{filter.value.toString()}</Formula>;
  } else {
    return filter.value.toString();
  }
};

export const ActiveFilterButtons: React.FC<Props> = (props) => {
  return (
    <div data-testid="active-filter-buttons" className="mpc-active-filter-buttons">
      {props.filters.map((f, i) => (
        <div className="mpc-active-filter-button" key={i}>
          <button
            className="button is-small is-rounded"
            onClick={() => props.onClick(f.defaultValue, f.id)}
          >
            <FaTimes />
            <span className="ml-1">
              {f.displayName}: {formatValue(f)}
            </span>
          </button>
        </div>
      ))}
    </div>
  );
};
