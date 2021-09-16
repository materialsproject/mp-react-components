import classNames from 'classnames';
import React, { useState } from 'react';
import * as d3 from 'd3';
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
    const displayMin = d3.format(',')(filter.value[0]);
    const displayMax = d3.format(',')(filter.value[1]);
    if (filter.defaultValue[0] !== 0 && filter.value[0] === filter.defaultValue[0]) {
      return `${displayMax} or less`;
    } else if (filter.value[1] === filter.defaultValue[1]) {
      return `${displayMin} or more`;
    } else {
      return `${displayMin} to ${displayMax}`;
    }
  } else if (Array.isArray(filter.value)) {
    return filter.value.join(', ');
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
