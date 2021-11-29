import classNames from 'classnames';
import React from 'react';
import { ELEMENTS_REGEX, ELEMENTS_SPLIT_REGEX } from '../../data-entry/MaterialsInput/utils';

export interface FormulaProps {
  /**
   * The ID used to identify this component in Dash callbacks
   */
  id?: string;
  /**
   * Dash-assigned callback that should be called whenever any of the
   * properties change
   */
  setProps?: (value: any) => any;
  /**
   * Class name(s) to append to the component's default class (`mpc-formula`)
   */
  className?: string;
  /**
   * Formula string to format
   */
  children: string;
}

const formulaItem = (str: string) => {
  if (!str.match(/\(|\)|\*/g) && !str.match(ELEMENTS_REGEX)) {
    return <sub>{str}</sub>;
  } else {
    return <span>{str}</span>;
  }
};

/**
 * Render a formula string with proper subscripts
 */
export const Formula: React.FC<FormulaProps> = (props) => {
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
