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

/**
 * An input field for searching by elements or formula
 * Supports two-way binding with a SelectableTable if in the same context
 * i.e. when elements are typed into the field, they are selected in the table,
 * and when elements are selected in the table, they are appended to the field's input
 */
export const ElementsInput = () => {
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
  function changeInputValue(event) {
    actions.setElementsFilter({
      value: event.target.value
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
      let newInputValue = '';
      switch(state.elementsFilter.type) {
        case SearchType.ELEMENTS:
          newInputValue = arrayToDelimitedString(enabledElementsList, state.elementsFilter.delimiter);
          actions.addFilter({field: 'elements', value: newInputValue});
          break;
        case SearchType.FORMULA:
          if(lastAction?.type === 'select') {
            newInputValue = state.elementsFilter.value + enabledElementsList[enabledElementsList.length - 1];
          } else {
            var { formulaSplitWithNumbers, formulaSplitElementsOnly } = formulaStringToArrays(state.elementsFilter.value);
            const removedIndex = formulaSplitElementsOnly?.findIndex((d, i) => {
              return enabledElementsList.indexOf(d) === -1;
            });
            if(removedIndex !== undefined) formulaSplitWithNumbers?.splice(removedIndex, 1);
            if(formulaSplitWithNumbers) newInputValue = formulaSplitWithNumbers.toString().replace(/,/gi, '');
          }
          actions.addFilter({field: 'formula', value: newInputValue});
          break;
        default:
          return;
      }
      actions.setElementsFilter({
        value: newInputValue,
      });
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
    const newInputValue = state.elementsFilter.value;
    let newSearchType = state.elementsFilter.type;
    let newDelimiter = state.elementsFilter.delimiter;

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
      actions.addFilter({field: 'elements', value: newElements});
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
      actions.addFilter({field: 'formula', value: newInputValue});
    }
  
      actions.setElementsFilter({
        type: newSearchType,
        delimiter: newDelimiter
      });
  }, [state.elementsFilter.value]);

  return (
    <Field className="has-addons">
      <Control>
        <Dropdown
          value={state.elementsFilter.type}
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
          value={state.elementsFilter.value}
          onChange={changeInputValue}
          onFocus={() => setIsFocused(true)} 
          onBlur={() => setIsFocused(false)}
        />
      </Control>
    </Field>
  );
}