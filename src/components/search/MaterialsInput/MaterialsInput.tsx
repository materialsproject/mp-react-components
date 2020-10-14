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
import { Dropdown, Form } from 'react-bulma-components';
const { Input, Field, Control } = Form;

/**
 * Search types supported by this field
 * Displayed to users in the dropdown
 */
export enum MaterialsInputField {
  ELEMENTS = 'elements',
  FORMULA = 'formula',
  MP_ID = 'task_ids'
}

interface MaterialsInputProps {
  value: string;
  parsedValue: string | string[];
  field: string;
  onChange: (value: string) => void;
  onParsedValueChange: (value: string | string[]) => void;
  onFieldChange: (value: string) => void;
  onSubmit?: (value: any) => any;
}

/**
 * An input field for searching by elements or formula
 * Supports two-way binding with a SelectableTable if in the same context
 * i.e. when elements are typed into the field, they are selected in the table,
 * and when elements are selected in the table, they are appended to the field's input
 */
export const MaterialsInput: React.FC<MaterialsInputProps> = props => {
  const { enabledElements, lastAction, actions: ptActions } = useElements();
  const [isFocused, setIsFocused] = useState(false);
  const [delimiter, setDelimiter] = useState(',');
  const dropdownItems = [
    { label: 'By elements', value: MaterialsInputField.ELEMENTS },
    { label: 'By formula', value: MaterialsInputField.FORMULA },
    { label: 'By mp-id', value: MaterialsInputField.MP_ID }
  ];

  /**
   * Handle updating the context with the new raw input value
   * All side effects to this change are handled in an effect hook
   */
  function onRawValueChange(event) {
    props.onChange(event.target.value);
  }

  /**
   * Handle direct interactions with the periodic table
   * This hook is triggered any time enabledElements changes
   * If the input is focused, the function is skipped to prevent an infinite update loop
   */
  useEffect(() => {
    if (!isFocused) {
      const enabledElementsList = getTruthyKeys(enabledElements);
      let newValue = '';
      switch (props.field) {
        case MaterialsInputField.ELEMENTS:
          newValue = arrayToDelimitedString(enabledElementsList, delimiter);
          break;
        case MaterialsInputField.FORMULA:
          if (lastAction?.type === 'select') {
            newValue = props.value + enabledElementsList[enabledElementsList.length - 1];
          } else {
            var { formulaSplitWithNumbers, formulaSplitElementsOnly } = formulaStringToArrays(
              props.value
            );
            const removedIndex = formulaSplitElementsOnly?.findIndex((d, i) => {
              return enabledElementsList.indexOf(d) === -1;
            });
            if (removedIndex !== undefined) formulaSplitWithNumbers?.splice(removedIndex, 1);
            if (formulaSplitWithNumbers)
              newValue = formulaSplitWithNumbers.toString().replace(/,/gi, '');
          }
          break;
        default:
          return;
      }
      props.onParsedValueChange(newValue);
      props.onChange(newValue);
    }
  }, [enabledElements]);

  /**
   * Trigger side effects when raw input value changes
   * Detects when search type has changed based on presence of numbers (indicative of formula)
   * or delimiters (indicative of elements).
   * Adds/removes enabled elements from the periodic table.
   * Only adds/removes elements when input value and pt are not in sync (prevents infinite hooks)
   * Sends clean input value to onChange function passed in as a prop
   */
  useEffect(() => {
    const enabledElementsList = getTruthyKeys(enabledElements);
    const newValue = props.value;
    let newMaterialsInputField = props.field;
    let newDelimiter = delimiter;
    let newParsedValue: string | string[] | null = null;

    if (newValue && newValue.match(/[0-9]/g)) {
      newMaterialsInputField = MaterialsInputField.FORMULA;
    } else if (newValue && newValue.match(/,|-/gi)) {
      newMaterialsInputField = MaterialsInputField.ELEMENTS;
    }

    if (newMaterialsInputField === MaterialsInputField.ELEMENTS) {
      newDelimiter = getDelimiter(newValue);
      const cleanedInput = newValue.replace(/and|\s|[0-9]/gi, '');
      const inputSplit = cleanedInput.split(newDelimiter);
      const newElements: string[] = [];
      inputSplit.forEach(el => {
        if (TABLE_DICO_V2[el]) {
          newElements.push(el);
          if (!enabledElements[el]) ptActions.addEnabledElement(el);
        }
      });
      enabledElementsList.forEach(el => {
        if (inputSplit.indexOf(el) === -1) ptActions.removeEnabledElement(el);
      });
      newParsedValue = newElements;
    } else if (newMaterialsInputField == MaterialsInputField.FORMULA) {
      var { formulaSplitWithNumbers, formulaSplitElementsOnly } = formulaStringToArrays(newValue);
      formulaSplitElementsOnly.forEach(el => {
        if (TABLE_DICO_V2[el]) {
          if (!enabledElements[el]) ptActions.addEnabledElement(el);
        }
      });
      enabledElementsList.forEach(el => {
        if (formulaSplitElementsOnly.indexOf(el) === -1) ptActions.removeEnabledElement(el);
      });
    }

    newParsedValue = newParsedValue ? newParsedValue : newValue;
    setDelimiter(newDelimiter);
    props.onFieldChange(newMaterialsInputField);
    props.onParsedValueChange(newParsedValue);
  }, [props.value]);

  return (
    <Field className="has-addons">
      <Control>
        <Dropdown
          value={props.field}
          onChange={(item: MaterialsInputField) => {
            props.onFieldChange(item);
          }}
          color="primary"
        >
          {dropdownItems.map((item, k) => {
            return (
              <Dropdown.Item key={k} value={item.value}>
                {item.label}
              </Dropdown.Item>
            );
          })}
        </Dropdown>
      </Control>
      <Control className="is-expanded">
        <Input
          type="text"
          value={props.value}
          onChange={onRawValueChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </Control>
    </Field>
  );
};
