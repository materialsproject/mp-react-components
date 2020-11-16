import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useElements } from '../../../periodic-table/periodic-table-state/table-store';
import { TABLE_DICO_V2 } from '../../../periodic-table/periodic-table-data/table-v2';
import {
  getDelimiter,
  elementsArrayToElementState,
  formulaStringToArrays,
  getTruthyKeys,
  arrayToDelimitedString,
  parseElements
} from '../../../search/utils';
import { Dropdown, Form, Button } from 'react-bulma-components';
import { MaterialsInputField, MaterialsInputBoxProps } from '../MaterialsInput';
import { useDebounce } from '../../../../utils/hooks';
const { Input, Field, Control } = Form;

/**
 * The text input component of a MaterialsInput component
 * Handles the two-way binding between input and periodic table
 */

interface DispatchAction {
  action: (payload: any) => void;
  payload?: any;
}

export const MaterialsInputBox: React.FC<MaterialsInputBoxProps> = props => {
  const { enabledElements, lastAction, actions: ptActions } = useElements();
  const [delimiter, setDelimiter] = useState(new RegExp(','));
  const [ptActionsToDispatch, setPtActionsToDispatch] = useState<DispatchAction[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(props.value);
  const debouncedInputValue = props.debounce ? useDebounce(inputValue, props.debounce) : inputValue;
  const dropdownItems = [
    { label: 'By elements', value: MaterialsInputField.ELEMENTS },
    { label: 'By formula', value: MaterialsInputField.FORMULA },
    { label: 'By mp-id', value: MaterialsInputField.MP_ID }
  ];

  /**
   * Handle updating the context with the new raw input value
   * All side effects to this change are handled in an effect hook
   */
  const handleRawValueChange = e => {
    setInputValue(e.target.value);
  };

  // const handleSubmit = e => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   if (props.onSubmit) {
  //     props.onSubmit();
  //   }
  // };

  const handleFocus = () => {
    if (props.onFocus) props.onFocus();
  };

  const handleBlur = event => {
    if (props.onBlur) props.onBlur();
  };

  /**
   * This effect is triggered when the value prop is changed directly from outside this component
   * Here inputValue is set, triggering debouncedInputValue to get set after the debounce timer
   */
  useEffect(() => {
    setInputValue(props.value);
  }, [props.value]);

  /**
   * This effect triggers immediately after the inputValue changes
   * If onFieldChange prop is included, dynamically determine if the input
   * is an mp-id, list of elements, or formula.
   * Detects elements to add/remove from the periodic table and collects them in ptActionsToDispatch.
   * Only adds/removes elements when input value and pt are not in sync (prevents infinite hooks)
   * Sends clean input value to onChange function passed in as a prop
   */
  useEffect(() => {
    const enabledElementsList = getTruthyKeys(enabledElements);
    const newValue = inputValue;
    const capitalLettersMatch = newValue.match(/[A-Z]/g);
    const capitalLetters = capitalLettersMatch ? capitalLettersMatch.length : 0;
    let newMaterialsInputField = props.field;
    let newDelimiter = delimiter;
    let newPtActionsToDispatch: DispatchAction[] = [];

    /**
     * Field name switches to MP_ID if the input starts with 'mp' or 'mvc'.
     * Field name switches to ELEMENTS if the input contains one of the accepted delimiters (comma, hyphen, or space).
     * Field name switches to FORMULA if the input doesn't contain a delimiter
     * and does contain multiple capital letters or a number.
     */
    if (props.onFieldChange && newValue && (newValue.indexOf('mp') === 0 || newValue.indexOf('mvc') === 0)) {
      newMaterialsInputField = MaterialsInputField.MP_ID;
    } else if (props.onFieldChange && newValue && newValue.match(/,|-|\s/gi)) {
      newMaterialsInputField = MaterialsInputField.ELEMENTS;
    } else if (props.onFieldChange && newValue &&  (capitalLetters > 1 || newValue.match(/[0-9]/gi))) {
      newMaterialsInputField = MaterialsInputField.FORMULA;
    }

    switch (newMaterialsInputField) {
      case MaterialsInputField.MP_ID:
        newPtActionsToDispatch.push({
          action: ptActions.clear, 
        });
        break;
      case MaterialsInputField.ELEMENTS:
        newDelimiter = getDelimiter(newValue);
        const parsedElements = parseElements(newValue, newDelimiter);
        parsedElements.forEach((el) => {
          if (!enabledElements[el]) {
            newPtActionsToDispatch.push({
              action: ptActions.addEnabledElement, 
              payload: el
            });
          }
        })
        enabledElementsList.forEach(el => {
          if (parsedElements.indexOf(el) === -1) {
            newPtActionsToDispatch.push({
              action: ptActions.removeEnabledElement, 
              payload: el
            });
          }
        });
        break;
      case MaterialsInputField.FORMULA:
        var { formulaSplitWithNumbers, formulaSplitElementsOnly } = formulaStringToArrays(newValue);
        formulaSplitElementsOnly.forEach(el => {
          if (TABLE_DICO_V2[el]) {
            if (!enabledElements[el]) {
              newPtActionsToDispatch.push({
                action: ptActions.addEnabledElement, 
                payload: el
              });
            }
          }
        });
        enabledElementsList.forEach(el => {
          if (formulaSplitElementsOnly.indexOf(el) === -1) {
            newPtActionsToDispatch.push({
              action: ptActions.removeEnabledElement, 
              payload: el
            });
          }
        });
        break;
      default:
        throw 'invalid field in materials input';
    }

    setPtActionsToDispatch(newPtActionsToDispatch);
    setDelimiter(newDelimiter);
    if (props.onFieldChange) props.onFieldChange(newMaterialsInputField);
  }, [inputValue]);

  /**
   * This effect executes the periodic table context actions collected by the value effect (above)
   * These are executed in a separate effect (rather than inside the value effect)
   * to prevent issues with execution order when MaterialsInputs are 
   * initialized with values (e.g. search param value from the URL).
   */
  useEffect(() => {
    ptActionsToDispatch.forEach(d => d.action(d.payload));
  }, [ptActionsToDispatch]);

  /**
   * This effect is triggered after the debouncedInputValue is set
   * The debouncedInputValue is set with inputValue after the specified debounce time
   * If no debounce prop is supplied, there is no debounce and debouncedInputValue is exactly the same as inputValue
   * Triggers the onChange event prop for the value prop
   */
  useEffect(() => {
    props.onChange(debouncedInputValue);
  }, [debouncedInputValue]);

  /**
   * This effect handles direct interactions with the periodic table
   * This hook is triggered any time enabledElements changes
   * To prevent an infinite update loop, the function is skipped
   * if enabledElements was changed from an external action, not a direct element click
   * (as determined by the presence of lastAction.type)
   */
  useEffect(() => {
    if (lastAction && lastAction.hasOwnProperty('type')) {
      const enabledElementsList = getTruthyKeys(enabledElements);
      let newValue = '';
      switch (props.field) {
        case MaterialsInputField.ELEMENTS:
          newValue = arrayToDelimitedString(enabledElementsList, delimiter);
          break;
        case MaterialsInputField.FORMULA:
          if (lastAction.type === 'select') {
            newValue = inputValue + enabledElementsList[enabledElementsList.length - 1];
          } else {
            var { formulaSplitWithNumbers, formulaSplitElementsOnly } = formulaStringToArrays(
              inputValue
            );
            const removedIndex = formulaSplitElementsOnly?.findIndex((d, i) => {
              return enabledElementsList.indexOf(d) === -1;
            });
            if (removedIndex !== undefined) formulaSplitWithNumbers?.splice(removedIndex, 1);
            if (formulaSplitWithNumbers)
              newValue = formulaSplitWithNumbers.toString().replace(/,/gi, '');
          }
          break;
        case MaterialsInputField.MP_ID:
          newValue = arrayToDelimitedString(enabledElementsList, delimiter);
          if (props.onFieldChange) props.onFieldChange(MaterialsInputField.ELEMENTS);
          break;
        default:
          return;
      }
      setInputValue(newValue);
    }
  }, [enabledElements]);

  /**
   * This effect lifts the ref placed in the input element
   * up to the parent MaterialsInput component
   * This allows MaterialsInput to handle focusing the input when the periodic table is clicked
   */
  useEffect(() => {
    if (props.liftInputRef) props.liftInputRef(inputRef);
  }, []);

  const inputControl = 
    <Control className="is-expanded">
      <input
        className="input"
        type="search"
        value={inputValue}
        onChange={handleRawValueChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={props.onSubmit ? 'Search by elements, formula, or ID' : undefined}
        ref={inputRef}
      />
    </Control>;

  return (
    <>
      {props.showFieldDropdown && 
        <Control>
          <Dropdown
            value={props.field}
            onChange={(item: MaterialsInputField) => {
              if (props.onFieldChange) props.onFieldChange(item);
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
      }
      {inputControl}
    </>
  );
};
