import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { FaRegTimesCircle, FaToggleOn } from 'react-icons/fa';
import { Tooltip } from '../../data-display/Tooltip';
import { PublicationButton } from '../../publications/PublicationButton';
import './FilterField.css';

interface FilterFieldProps {
  id?: string;
  className?: string;
  /**
   * Label to display above the filter component
   */
  label?: string;
  /**
   * Tooltip to show when hovering over the filter label
   */
  tooltip?: string;
  /**
   * Units used in this filter
   */
  units?: string;
  /**
   * List of DOIs to display as compact publication buttons next to the label.
   * Use this for filters that need to cite specific publications.
   */
  dois?: string[];
  /**
   * Control whether the filter appears to be active
   */
  active?: boolean;
  resetFilter?: (id: any) => any;
}

/**
 * Common wrapper for filters/inputs and their labels
 */
export const FilterField: React.FC<FilterFieldProps> = ({ dois = [], ...otherProps }) => {
  const props = { dois, ...otherProps };
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
      {props.label && (
        <div className="mpc-filter-label">
          {renderFilterLabel()}
          {props.dois.map((doi, i) => (
            <PublicationButton key={`${i}-${doi}`} doi={doi} compact className="tag ml-2" />
          ))}
        </div>
      )}
      {props.children}
    </div>
  );
};
