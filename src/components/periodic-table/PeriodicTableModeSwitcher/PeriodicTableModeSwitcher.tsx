import React, { useEffect, useState } from 'react';
import { PeriodicTableFormulaButtons } from '../PeriodicTableFormulaButtons';
import './PeriodicTableModeSwitcher.css';
import { Form } from 'react-bulma-components';
import classNames from 'classnames';
import { MaterialsInputType } from '../../search/MaterialsInput';
const { Input, Field, Control } = Form;

interface Props {
  mode: string;
  onSwitch: (field: MaterialsInputType) => any;
  onFormulaButtonClick: (value: string) => any;
}

export const PeriodicTableModeSwitcher: React.FC<Props> = (props) => {
  // const [mode, setMode] = useState(props.mode);

  // useEffect(() => {
  //   setMode(props.mode);
  // }, [props.mode]);

  return (
    <>
      <div className="first-span">
        <div className="toggle-buttons">
          <button
            className={classNames('button', { 'is-active': props.mode !== 'formula' })}
            onClick={() => props.onSwitch(MaterialsInputType.ELEMENTS)}
          >
            Elements
          </button>
          <button
            className={classNames('button', { 'is-active': props.mode === 'formula' })}
            onClick={() => props.onSwitch(MaterialsInputType.FORMULA)}
          >
            Formula
          </button>
        </div>
      </div>
      <div className="second-span">
        {props.mode === 'formula' && (
          <PeriodicTableFormulaButtons onClick={props.onFormulaButtonClick} />
        )}
      </div>
    </>
  );
};
