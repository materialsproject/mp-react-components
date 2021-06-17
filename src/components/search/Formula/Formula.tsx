import classNames from 'classnames';
import React from 'react';

interface Props {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  children: string;
}

export const Formula: React.FC<Props> = (props) => {
  const splitFormula: string[] = props.children.split(/([0-9]+)/g);
  const formulaItem = (str: string) => {
    if (parseInt(str)) {
      return <sub>{str}</sub>;
    } else {
      return <span>{str}</span>;
    }
  };
  return (
    <span id={props.id} className={classNames('mpc-formula', props.className)}>
      {splitFormula.map((s, i) => (
        <span key={i}>{formulaItem(s)}</span>
      ))}
    </span>
  );
};
