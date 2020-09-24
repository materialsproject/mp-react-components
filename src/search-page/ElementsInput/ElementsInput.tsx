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
export enum SearchType {
  ELEMENTS = 'elements',
  FORMULA = 'formula'
}

interface Props {
  value: string;
  type: string;
  delimiter: string;
  onChange: (value: string) => void;
  onPropsChange: (p: Object) => void;
}

/**
 * An input field for searching by elements or formula
 * Supports two-way binding with a SelectableTable if in the same context
 * i.e. when elements are typed into the field, they are selected in the table,
 * and when elements are selected in the table, they are appended to the field's input
 */
export const ElementsInput: React.FC<Props> = (props) => {
  const {state, actions} = useMaterialsSearch();
  const { enabledElements, lastAction, actions: ptActions } = useElements();
  const [isFocused, setIsFocused] = useState(false);
  const dropdownItems = [
    {label: 'Materials with elements', value: SearchType.ELEMENTS},
    {label: 'Materials with formula', value: SearchType.FORMULA}
  ];

  /**
   * Handle updating the context with the new input value
   * All side effects to this change are handled in an effect hook
   */
  function onChange(event) {
    props.onChange(event.target.value);
    //set raw value
  }

  /**
   * Handle direct interactions with the periodic table
   * This hook is triggered any time enabledElements changes
   * If the input is focused, the function is skipped to prevent an infinite update loop
   */
  useEffect(() => {
    if(!isFocused) {
      const enabledElementsList = getTruthyKeys(enabledElements);
      let newInputValue = '';
      switch(props.type) {
        case SearchType.ELEMENTS:
          newInputValue = arrayToDelimitedString(enabledElementsList, props.delimiter);
          // actions.addFilter({field: 'elements', value: newInputValue});
          break;
        case SearchType.FORMULA:
          if(lastAction?.type === 'select') {
            newInputValue = props.value + enabledElementsList[enabledElementsList.length - 1];
          } else {
            var { formulaSplitWithNumbers, formulaSplitElementsOnly } = formulaStringToArrays(props.value);
            const removedIndex = formulaSplitElementsOnly?.findIndex((d, i) => {
              return enabledElementsList.indexOf(d) === -1;
            });
            if(removedIndex !== undefined) formulaSplitWithNumbers?.splice(removedIndex, 1);
            if(formulaSplitWithNumbers) newInputValue = formulaSplitWithNumbers.toString().replace(/,/gi, '');
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
    }
  }, [enabledElements]);

  /**
   * Trigger side effects when input value changes
   * Detects when search type has changed based on presence of numbers (indicative of formula)
   * or delimiters (indicative of elements).
   * Adds/removes enabled elements from the periodic table.
   * Only adds/removes elements when input value and pt are not in sync (prevents infinite hooks)
   */
  useEffect(() => {
    const enabledElementsList = getTruthyKeys(enabledElements);
    const newInputValue = props.value;
    let newSearchType = props.type;
    let newDelimiter = props.delimiter;

    if(newInputValue && newInputValue.match(/[0-9]/g)) {
      newSearchType = SearchType.FORMULA;
    } else if(newInputValue && newInputValue.match(/,|-/gi)) {
      newSearchType = SearchType.ELEMENTS;
    }

    if(newSearchType === SearchType.ELEMENTS) {
      newDelimiter = getDelimiter(newInputValue);
      const cleanedInput = newInputValue.replace(/and|\s|[0-9]/gi, '');
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
      // actions.addFilter({field: 'elements', value: newElements});
    } else if(newSearchType == SearchType.FORMULA) {
      var { formulaSplitWithNumbers, formulaSplitElementsOnly } = formulaStringToArrays(newInputValue);
      formulaSplitElementsOnly.forEach((el) => {
        if(TABLE_DICO_V2[el]) {
          if(!enabledElements[el]) ptActions.addEnabledElement(el);
        }
      });
      enabledElementsList.forEach((el) => {
        if(formulaSplitElementsOnly.indexOf(el) === -1) ptActions.removeEnabledElement(el);
      });
      // actions.addFilter({field: 'formula', value: newInputValue});
    }
  
      // actions.setElementsFilter({
      //   type: newSearchType,
      //   delimiter: newDelimiter
      // });
      props.onPropsChange({
        type: newSearchType,
        delimiter: newDelimiter
      });

      // set clean value
  }, [props.value]);

  return (
    <Field className="has-addons">
      <Control>
        <Dropdown
          value={props.type}
          onChange={(item: SearchType) => {
            actions.setElementsFilter({
              type: item,
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
          value={props.value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)} 
          onBlur={() => setIsFocused(false)}
        />
      </Control>
    </Field>
  );
}