import classNames from 'classnames';
import React, { ReactNode } from 'react';

interface Props {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  data: any;
}

export const SynthesisRecipeCard: React.FC<Props> = (props) => {
  return (
    <div className={classNames('mpc-synthesis-recipe-card', props.className)}>
      <div>{props.data.formula_pretty}</div>
    </div>
  );
};
