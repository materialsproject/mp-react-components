import classNames from 'classnames';
import React from 'react';
import { ELEMENTS_REGEX, ELEMENTS_SPLIT_REGEX } from '../../data-entry/MaterialsInput/utils';

interface Props {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  children: string;
}

const formulaItem = (str: string) => {
  if (!str.match(/\(|\)|\*/g) && !str.match(ELEMENTS_REGEX)) {
    return <sub>{str}</sub>;
  } else {
    return <span>{str}</span>;
  }
};

export const Formula: React.FC<Props> = (props) => {
  let formula: React.ReactNode;
  const splitFormula = props.children.match(ELEMENTS_SPLIT_REGEX);
  formula = (
    <span>
      {splitFormula?.map((s, i) => (
        <span key={i}>{formulaItem(s)}</span>
      ))}
    </span>
  );

  return (
    <span
      data-testid="formula"
      id={props.id}
      className={classNames('mpc-formula', props.className)}
    >
      {formula}
    </span>
  );
};
