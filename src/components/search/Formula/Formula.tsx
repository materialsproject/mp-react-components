import classNames from 'classnames';
import React from 'react';

interface Props {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  children: string;
}

export const Formula: React.FC<Props> = (props) => {
  const splitFormula: string[] = props.children.split(/(\d*\.?\d+|\-|x)/g);
  const formulaParts = splitFormula.filter((d) => d !== '' && d !== '1');
  const formulaItem = (str: string) => {
    if (parseFloat(str) || str === '-' || str === 'x') {
      return <sub>{str}</sub>;
    } else {
      return <span>{str}</span>;
    }
  };
  return (
    <span id={props.id} className={classNames('mpc-formula', props.className)}>
      {formulaParts.map((s, i) => (
        <span key={i}>{formulaItem(s)}</span>
      ))}
    </span>
  );
};
