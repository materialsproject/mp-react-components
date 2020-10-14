import React, { useState, useEffect } from 'react';
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
  onChange: (value: string) => void;
  onParsedValueChange: (value: string | string[]) => void;
  onFieldChange?: (value: string) => void;
  onSubmit?: (value?: any) => any;
}

interface MaterialsInputProps extends MaterialsInputBoxProps {
  periodicTableMode?: string;
}

/**
 * An input field for searching by elements or formula
 * Supports two-way binding with a SelectableTable if in the same context
 * i.e. when elements are typed into the field, they are selected in the table,
 * and when elements are selected in the table, they are appended to the field's input
 */
export const MaterialsInput: React.FC<MaterialsInputProps> = props => {
  const [showPeriodicTable, setShowPeriodicTable] = useState(() =>
    props.periodicTableMode === 'toggle' ? true : false
  );
  return (
    <div className="has-text-centered">
      <PeriodicContext>
        <div>
          <MaterialsInputBox
            value={props.value}
            parsedValue={props.parsedValue}
            field={props.field}
            onChange={props.onChange}
            onParsedValueChange={props.onParsedValueChange}
            onFieldChange={props.onFieldChange}
            onSubmit={props.onSubmit}
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
        <div className={`${showPeriodicTable ? '' : 'is-hidden'}`}>
          <SelectableTable
            maxElementSelectable={20}
            forceTableLayout={TableLayout.MINI}
            hiddenElements={[]}
            onStateChange={enabledElements => {
              Object.keys(enabledElements).filter(el => enabledElements[el]);
            }}
            enabledElements={[]}
            disabledElements={['H', 'C']}
          />
        </div>
      </PeriodicContext>
    </div>
  );
};
