import React, { useState, useRef } from 'react';
import { useElements } from '../../periodic-table/periodic-table-state/table-store';
import { TABLE_DICO_V2 } from '../../periodic-table/periodic-table-data/table-v2';
import {
  getDelimiter,
  elementsArrayToElementState,
  formulaStringToArrays,
  getTruthyKeys,
  arrayToDelimitedString
} from '../../search/utils';
import { Dropdown, Form, Button } from 'react-bulma-components';
import { FaTimes } from 'react-icons/fa';
import { PeriodicContext } from '../../periodic-table/periodic-table-state/periodic-selection-context';
import { MaterialsInputBox } from './MaterialsInputBox';
import { TableLayout } from '../../periodic-table/periodic-table-component/periodic-table.component';
import { SelectableTable } from '../../periodic-table/table-state';
import classNames from 'classnames';

/**
 * An input field component for searching by mp-id, elements, or formula.
 * Renders a text input and a periodic table within a PeriodicContext to support
 * two-way binding between the input and periodic table.
 * i.e. when elements are typed into the field, they are selected in the table,
 * and when elements are selected in the table, they are appended to the field's input.
 */

/**
 * Search types supported by this field
 * Displayed to users in the dropdown
 */
export enum MaterialsInputField {
  ELEMENTS = 'elements',
  FORMULA = 'formula',
  MP_ID = 'task_ids'
}

export interface MaterialsInputBoxProps {
  value: string;
  parsedValue: string | string[];
  field: string;
  liftInputRef?: (value: React.RefObject<HTMLInputElement>) => any;
  onChange: (value: string) => void;
  onFieldChange?: (value: string) => void;
  onSubmit?: (value?: any) => any;
  onFocus?: (value?: any) => any;
  onBlur?: (value?: any) => any;
}

interface MaterialsInputProps extends MaterialsInputBoxProps {
  periodicTableMode?: string;
  enabledElements?: string[];
}

export const MaterialsInput: React.FC<MaterialsInputProps> = props => {
  const [inputRef, setInputRef] = useState<React.RefObject<HTMLInputElement>>();
  const [periodicTableClicked, setPeriodicTableClicked] = useState(false);
  const [showPeriodicTable, setShowPeriodicTable] = useState(() =>
    props.periodicTableMode === 'toggle' ? true : false
  );

  const getOnFocusProp = () => {
    if (props.periodicTableMode === 'onFocus') {
      return setShowPeriodicTable(true);
    } else {
      return;
    }
  };

  const getOnBlurProp = () => {
    if (props.periodicTableMode === 'onFocus' && !periodicTableClicked) {
      return setShowPeriodicTable(false);
    } else {
      return;
    }
  };

  const handleSubmit = () => {
    if (props.onSubmit) {
      setShowPeriodicTable(false);
      props.onSubmit();
    }
  };

  return (
    <div className="has-text-centered">
      <PeriodicContext 
        // enabledElements={props.enabledElements ? props.enabledElements : undefined}
      >
        <div>
          <MaterialsInputBox
            value={props.value}
            parsedValue={props.parsedValue}
            field={props.field}
            onChange={props.onChange}
            onFieldChange={props.onFieldChange}
            onSubmit={props.onSubmit ? handleSubmit : undefined}
            onFocus={getOnFocusProp}
            onBlur={getOnBlurProp}
            liftInputRef={ref => setInputRef(ref)}
          />
        </div>
        {props.periodicTableMode === 'toggle' && (
          <button
            className="button is-small bt-0"
            onClick={() => setShowPeriodicTable(!showPeriodicTable)}
          >
            {showPeriodicTable ? 'Hide' : 'Show'} Periodic Table
          </button>
        )}
        <div
          className={classNames('table-transition-wrapper-small','can-hide-with-transition', {
            'is-hidden-with-transition': !showPeriodicTable,
            'mt-3': props.periodicTableMode === 'onFocus' && showPeriodicTable
          })}
          onMouseDown={event => {
            setPeriodicTableClicked(true);
            setTimeout(() => {
              if (inputRef && inputRef.current) inputRef.current.focus();
              setPeriodicTableClicked(false);
            }, 250);
          }}
        >
          <SelectableTable
            maxElementSelectable={20}
            forceTableLayout={TableLayout.MINI}
            hiddenElements={[]}
            onStateChange={enabledElements => {
              Object.keys(enabledElements).filter(el => enabledElements[el]);
            }}
          />
        </div>
      </PeriodicContext>
    </div>
  );
};
