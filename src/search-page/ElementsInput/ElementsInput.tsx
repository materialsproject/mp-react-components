import React, { useState, useEffect } from 'react';
import { useElements } from '../../periodic-table/periodic-table-state/table-store';
import { TABLE_DICO_V2 } from '../../periodic-table/periodic-table-data/table-v2';
import { getDelimiter, elementsArrayToElementState, formulaStringToArrays, getTruthyKeys, arrayToDelimitedString } from '../utils';
import { Dropdown, Form } from 'react-bulma-components';
const { Input, Field, Control } = Form;
import { useMaterialsSearch } from '../MaterialsSearchProvider';

/**
 * Search types supported by this field
 * Displayed to users in the dropdown
 */
export enum ElementsInputType {
  ELEMENTS = 'elements',
  FORMULA = 'formula'
}

export interface ElementsInputProps {
  value: string | string[];
  rawValue: string;
  type: string;
  delimiter: string;
  onChange: (value: string | string[]) => void;
  onPropsChange: (p: Object) => void;
}

/**
 * An input field for searching by elements or formula
 * Supports two-way binding with a SelectableTable if in the same context
 * i.e. when elements are typed into the field, they are selected in the table,
 * and when elements are selected in the table, they are appended to the field's input
 */
export const ElementsInput: React.FC<ElementsInputProps> = (props) => {
  const {state, actions} = useMaterialsSearch();
  const { enabledElements, lastAction, actions: ptActions } = useElements();
  const [isFocused, setIsFocused] = useState(false);
  const dropdownItems = [
    {label: 'Materials with elements', value: ElementsInputType.ELEMENTS},
    {label: 'Materials with formula', value: ElementsInputType.FORMULA}
  ];

  /**
   * Handle updating the context with the new raw input value
   * All side effects to this change are handled in an effect hook
   */
  function onRawValueChange(event) {
    props.onPropsChange({
      rawValue: event.target.value
    });
  }

  /**
   * Handle direct interactions with the periodic table
   * This hook is triggered any time enabledElements changes
   * If the input is focused, the function is skipped to prevent an infinite update loop
   */
  useEffect(() => {
    if(!isFocused) {
      const enabledElementsList = getTruthyKeys(enabledElements);
      let newRawValue = '';
      switch(props.type) {
        case ElementsInputType.ELEMENTS:
          newRawValue = arrayToDelimitedString(enabledElementsList, props.delimiter);
          // actions.addFilter({field: 'elements', value: newInputValue});
          break;
        case ElementsInputType.FORMULA:
          if(lastAction?.type === 'select') {
            newRawValue = props.value + enabledElementsList[enabledElementsList.length - 1];
          } else {
            var { formulaSplitWithNumbers, formulaSplitElementsOnly } = formulaStringToArrays(props.rawValue);
            const removedIndex = formulaSplitElementsOnly?.findIndex((d, i) => {
              return enabledElementsList.indexOf(d) === -1;
            });
            if(removedIndex !== undefined) formulaSplitWithNumbers?.splice(removedIndex, 1);
            if(formulaSplitWithNumbers) newRawValue = formulaSplitWithNumbers.toString().replace(/,/gi, '');
          }
          // actions.addFilter({field: 'formula', value: newInputValue});
          break;
        default:
          return;
      }
      // actions.setElementsFilter({
      //   value: newInputValue,
      // });

      // set raw value and clean value
      props.onPropsChange({
        rawValue: newRawValue
      });
      props.onChange(newRawValue);
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
    const newRawValue = props.rawValue;
    let newElementsInputType = props.type;
    let newDelimiter = props.delimiter;
    let newCleanValue: string | string[] | null = null;

    if(newRawValue && newRawValue.match(/[0-9]/g)) {
      newElementsInputType = ElementsInputType.FORMULA;
    } else if(newRawValue && newRawValue.match(/,|-/gi)) {
      newElementsInputType = ElementsInputType.ELEMENTS;
    }

    if(newElementsInputType === ElementsInputType.ELEMENTS) {
      newDelimiter = getDelimiter(newRawValue);
      const cleanedInput = newRawValue.replace(/and|\s|[0-9]/gi, '');
      const inputSplit = cleanedInput.split(newDelimiter);
      const newElements: string[] = [];
      inputSplit.forEach((el) => {
        if(TABLE_DICO_V2[el]) {
          newElements.push(el);
          if(!enabledElements[el]) ptActions.addEnabledElement(el);
        }
      });
      enabledElementsList.forEach((el) => {
        if(inputSplit.indexOf(el) === -1) ptActions.removeEnabledElement(el);
      });
      newCleanValue = newElements;
    } else if(newElementsInputType == ElementsInputType.FORMULA) {
      var { formulaSplitWithNumbers, formulaSplitElementsOnly } = formulaStringToArrays(newRawValue);
      formulaSplitElementsOnly.forEach((el) => {
        if(TABLE_DICO_V2[el]) {
          if(!enabledElements[el]) ptActions.addEnabledElement(el);
        }
      });
      enabledElementsList.forEach((el) => {
        if(formulaSplitElementsOnly.indexOf(el) === -1) ptActions.removeEnabledElement(el);
      });
    }

    props.onPropsChange({
      type: newElementsInputType,
      delimiter: newDelimiter
    });
    newCleanValue = newCleanValue ? newCleanValue : newRawValue;
    props.onChange(newCleanValue);
  }, [props.rawValue]);

  return (
    <Field className="has-addons">
      <Control>
        <Dropdown
          value={props.type}
          onChange={(item: ElementsInputType) => {
            props.onPropsChange({
              type: item
            });
          }}
          color="primary"
        >
          {dropdownItems.map((item, k) => {
            return (
              <Dropdown.Item key={k} value={item.value} >
                {item.label}
              </Dropdown.Item>
            )
          })}
        </Dropdown>
      </Control>
      <Control className="is-expanded">
        <Input
          type="text" 
          value={props.rawValue}
          onChange={onRawValueChange}
          onFocus={() => setIsFocused(true)} 
          onBlur={() => setIsFocused(false)}
        />
      </Control>
    </Field>
  );
}