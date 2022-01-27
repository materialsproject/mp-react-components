import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { FaRegTimesCircle, FaToggleOn } from 'react-icons/fa';
import { Tooltip } from '../../data-display/Tooltip';
import './FilterField.css';

interface FilterFieldProps {
  id?: string;
  className?: string;
  label?: string;
  tooltip?: string;
  units?: string;
  active?: boolean;
  resetFilter?: (id: any) => any;
}

/**
 * Common wrapper for filters/inputs and their labels
 */
export const FilterField: React.FC<FilterFieldProps> = (props) => {
  const renderUnitsComponent = (units?: string) => {
    if (units) {
      return <span className="mpc-units"> ({units})</span>;
    } else {
      return null;
    }
  };

  const renderFilterLabel = () => {
    const cancelButton = props.active ? (
      <FaRegTimesCircle className="ml-2 filter-cancel-button" />
    ) : null;
    const innerLabel = (
      <span
        className={classNames({
          'tooltip-label': props.tooltip
        })}
        data-tip
        data-for={`filter_${props.id}`}
      >
        {props.label === 'Chemical System' && <FaToggleOn />}
        {props.label}
        {renderUnitsComponent(props.units)}
        {cancelButton}
        {props.tooltip && <Tooltip id={`filter_${props.id}`}>{props.tooltip}</Tooltip>}
      </span>
    );

    if (props.active && props.resetFilter) {
      return <a onClick={() => props.resetFilter!(props.id)}>{innerLabel}</a>;
    } else {
      return innerLabel;
    }
  };

  return (
    <div id={props.id} className={classNames('mpc-filter-field', props.className)}>
      {props.label && <div className="mpc-filter-label">{renderFilterLabel()}</div>}
      {props.children}
    </div>
  );
};
