import React, { useEffect, useState } from 'react';
import { PeriodicTableFormulaButtons } from '../PeriodicTableFormulaButtons';
import './PeriodicTableModeSwitcher.css';
import { Form } from 'react-bulma-components';
import classNames from 'classnames';
import { MaterialsInputField } from '../../search/MaterialsInput';
const { Input, Field, Control } = Form;

interface Props {
  mode: string;
  onSwitch: (field: MaterialsInputField) => any;
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
            onClick={() => props.onSwitch(MaterialsInputField.ELEMENTS)}
          >
            Elements
          </button>
          <button
            className={classNames('button', { 'is-active': props.mode === 'formula' })}
            onClick={() => props.onSwitch(MaterialsInputField.FORMULA)}
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
