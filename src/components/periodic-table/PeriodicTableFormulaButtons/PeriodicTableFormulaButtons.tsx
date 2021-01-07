import React from 'react';
import { FaAsterisk } from 'react-icons/fa';
import './PeriodicTableFormulaButtons.css';

interface Props {
  onClick: (value: string) => any;
}

export const PeriodicTableFormulaButtons: React.FC<Props> = (props) => {
  const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '(', ')'];
  return (
    <div className="pt-formula-buttons">
      <div className="pt-formula-buttons-spacer"></div>
      <button
        type="button"
        className="pt-formula-buttons-wildcard mat-element has-tooltip-bottom"
        onClick={() => props.onClick('*')}
        data-tooltip="Wildcard element"
      >
        <span className="mat-symbol">
          <FaAsterisk />
        </span>
      </button>
      {values.map((v, i) => (
        <button key={i} type="button" className="mat-element" onClick={() => props.onClick(v)}>
          <span className="mat-symbol">{v}</span>
        </button>
      ))}
    </div>
  );
};
