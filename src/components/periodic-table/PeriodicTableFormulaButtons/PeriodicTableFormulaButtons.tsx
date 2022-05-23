import React from 'react';
import { FaAsterisk } from 'react-icons/fa';
import { Tooltip } from '../../data-display/Tooltip';

interface Props {
  onClick: (value: string) => any;
}

export const PeriodicTableFormulaButtons: React.FC<Props> = (props) => {
  const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '(', ')'];
  return (
    <>
      <div className="pt-spacer"></div>
      <button
        type="button"
        className="pt-wildcard-button mat-element has-tooltip-bottom"
        onClick={() => props.onClick('*')}
        data-tip
        data-for="formula-wildcard-button"
      >
        <span className="mat-symbol">
          <FaAsterisk />
        </span>
      </button>
      <Tooltip id="formula-wildcard-button" place="bottom">
        Wildcard element
      </Tooltip>
      {values.map((v, i) => (
        <button key={i} type="button" className="mat-element" onClick={() => props.onClick(v)}>
          <span className="mat-symbol">{v}</span>
        </button>
      ))}
    </>
  );
};
