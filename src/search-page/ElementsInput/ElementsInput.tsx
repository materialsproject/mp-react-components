import React, { useState, useEffect } from 'react';
import { useElements } from '../../periodic-table/periodic-table-state/table-store';
import { TABLE_DICO_V2 } from '../../periodic-table/periodic-table-data/table-v2';
import { getDelimiter, elementsArrayToElementState, formulaStringToArrays, getTruthyKeys } from '../utils';
import { Dropdown } from 'react-bulma-components';
import { Form } from 'react-bulma-components';
const { Input, Field, Control } = Form;

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
  const { enabledElements, lastAction, actions } = useElements();
  const [inputValue, setInputValue] = useState('');
  const [delimiter, setDelimiter] = useState(',');
  const [isFocused, setIsFocused] = useState(false);
  const [searchType, setSearchType] = useState(SearchType.ELEMENTS);
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
    let newSearchType = searchType;
    let newDelimiter = delimiter;

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
      inputSplit.forEach((el) => {
        if(!enabledElements[el] && TABLE_DICO_V2[el]) actions.addEnabledElement(el);
      });
      enabledElementsList.forEach((el) => {
        if(inputSplit.indexOf(el) === -1) actions.removeEnabledElement(el);
      });
    } else if(newSearchType == SearchType.FORMULA) {
      var { formulaSplitWithNumbers, formulaSplitElementsOnly } = formulaStringToArrays(newInputValue);
      console.log(formulaSplitWithNumbers);
      actions.setEnabledElements(elementsArrayToElementState(formulaSplitElementsOnly));
    }

    setInputValue(newInputValue);
    setSearchType(newSearchType);
    setDelimiter(newDelimiter);
  }

  /**
   * Handle direct interactions with the periodic table
   * This hook is triggered any time enabledElements changes
   * If the input is focused, the function is skipped to prevent an infinite update loop
   */
  useEffect(() => {
    if(!isFocused) {      
      const enabledElementsList = getTruthyKeys(enabledElements);
      switch(searchType) {
        case SearchType.ELEMENTS:
          setInputValue(enabledElementsList.toString().replace(/,/gi, delimiter));
          break;
        case SearchType.FORMULA:
          if(lastAction?.type === 'select') {
            setInputValue(inputValue + enabledElementsList[enabledElementsList.length - 1]);
          } else {
            var { formulaSplitWithNumbers, formulaSplitElementsOnly } = formulaStringToArrays(inputValue);
            const removedIndex = formulaSplitElementsOnly?.findIndex((d, i) => {
              return enabledElementsList.indexOf(d) === -1;
            });
            if(removedIndex !== undefined) formulaSplitWithNumbers?.splice(removedIndex, 1);
            if(formulaSplitWithNumbers) setInputValue(formulaSplitWithNumbers.toString().replace(/,/gi, ''));
          }
          break;
        default:
          setInputValue('');
      }
    }
  }, [enabledElements]);

  return (
    <Field className="has-addons">
      <Control>
        <Dropdown
          value={searchType}
          onChange={(item: SearchType) => setSearchType(item)}
          color="info"
          label={text('label', '')}>
            {dropdownItems.map((item, k) => {
              return (
                <Dropdown.Item key={k} value={item.value} >
                  {item.label}
                </Dropdown.Item>
              )
            })}
        </Dropdown>
      </Control>
      <Control>
        <Input 
          type="text" 
          value={inputValue}
          onChange={changeInputValue}
          onFocus={() => setIsFocused(true)} 
          onBlur={() => setIsFocused(false)}
        />
      </Control>
    </Field>
  );
}