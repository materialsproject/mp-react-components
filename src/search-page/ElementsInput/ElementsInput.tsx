import React, { useState, useEffect } from 'react';
import { useElements } from '../../periodic-table/periodic-table-state/table-store';
import { TABLE_DICO_V2 } from '../../periodic-table/periodic-table-data/table-v2';
import { getDelimiter, elementsArrayToElementState, formulaStringToArrays, getTruthyKeys } from '../utils';
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
   * Handle changes to the input
   * Detects when search type has changed based on presence of numbers (indicative of formula)
   * or delimiters (indicative of elements).
   * Adds/removes enabled elements from the periodic table.
   * (note) periodic table actions can't be called from a reducer.
   */
  function changeInputValue(event) {
    const newInputValue = event.target.value;
    let newSearchType = state.elementsFilter.type;
    let newDelimiter = state.elementsFilter.delimiter;

    if(newInputValue && newInputValue.match(/[0-9]/g)) {
      newSearchType = SearchType.FORMULA;
    } else if(newInputValue && newInputValue.match(/,|-/gi)) {
      newSearchType = SearchType.ELEMENTS;
    }

    if(newSearchType === SearchType.ELEMENTS) {
      const enabledElementsList = getTruthyKeys(enabledElements);
      newDelimiter = getDelimiter(newInputValue);
      console.log(newDelimiter);
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
      console.log(formulaSplitWithNumbers);
      ptActions.setEnabledElements(elementsArrayToElementState(formulaSplitElementsOnly));
      actions.addFilter({field: 'formula', value: newInputValue});
    }

    // setInputValue(newInputValue);
    // setSearchType(newSearchType);
    // setDelimiter(newDelimiter);

    // dispatch({
    //   type: 'update',
    //   payload: {
    //     elementsFilter: {
    //       value: newInputValue,
    //       type: newSearchType,
    //       delimiter: newDelimiter
    //     }
    //   }
    // });

    actions.setElementsFilter({
      value: newInputValue,
      type: newSearchType,
      delimiter: newDelimiter
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
          newInputValue = enabledElementsList.toString().replace(/,/gi, state.elementsFilter.delimiter);
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