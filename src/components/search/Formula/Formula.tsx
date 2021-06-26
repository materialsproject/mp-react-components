import classNames from 'classnames';
import React from 'react';

interface Props {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  children: string;
}

const formulaItem = (str: string) => {
  if (parseFloat(str) || str === '-' || str === 'x') {
    return <sub>{str}</sub>;
  } else {
    return <span>{str}</span>;
  }
};

export const Formula: React.FC<Props> = (props) => {
  const hasSubscripts = props.children.match(/\d|x/) !== null;
  let formula: React.ReactNode;
  if (hasSubscripts) {
    const splitFormula: string[] = props.children.split(/(\d*\.?\d+|\-|x)/g);
    const formulaParts = splitFormula.filter((d) => d !== '' && d !== '1');
    formula = (
      <span>
        {formulaParts.map((s, i) => (
          <span key={i}>{formulaItem(s)}</span>
        ))}
      </span>
    );
  } else {
    formula = props.children;
  }

  return (
    <span id={props.id} className={classNames('mpc-formula', props.className)}>
      {formula}
    </span>
  );
};
