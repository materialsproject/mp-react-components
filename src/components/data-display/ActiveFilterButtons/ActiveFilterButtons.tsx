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
  onClick: (params: string[]) => any;
}

const formatValue = (af: ActiveFilter) => {
  if (
    af.hasOwnProperty('defaultValue') &&
    Array.isArray(af.value) &&
    af.value.length === 2 &&
    !isNaN(af.value[0])
  ) {
    const displayMin = d3.format(',')(af.value[0]);
    const displayMax = d3.format(',')(af.value[1]);
    if (af.defaultValue[0] !== 0 && af.value[0] === af.defaultValue[0]) {
      return `${displayMax} or less`;
    } else if (af.value[1] === af.defaultValue[1]) {
      return `${displayMin} or more`;
    } else {
      return `${displayMin} to ${displayMax}`;
    }
  } else if (Array.isArray(af.value)) {
    return af.value.join(', ');
  } else if (af.name === 'Point Group') {
    return formatPointGroup(af.value);
  } else if (validateFormula(af.value.toString())) {
    return <Formula>{af.value.toString()}</Formula>;
  } else {
    return af.value.toString();
  }
};

export const ActiveFilterButtons: React.FC<Props> = (props) => {
  return (
    <div data-testid="active-filter-buttons" className="mpc-active-filter-buttons">
      {props.filters.map((f, i) => (
        <div className="mpc-active-filter-button" key={i}>
          <button className="button is-small is-rounded" onClick={() => props.onClick(f.params)}>
            <FaTimes />
            <span className="ml-1">
              {f.name}: {formatValue(f)}
            </span>
          </button>
        </div>
      ))}
    </div>
  );
};
