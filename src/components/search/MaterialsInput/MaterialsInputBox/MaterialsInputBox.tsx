import React, { useState, useEffect, useRef } from 'react';
import { useElements } from '../../../periodic-table/periodic-table-state/table-store';
import { TABLE_DICO_V2 } from '../../../periodic-table/periodic-table-data/table-v2';
import {
  getDelimiter,
  elementsArrayToElementState,
  formulaStringToArrays,
  getTruthyKeys,
  arrayToDelimitedString,
  parseFormula,
} from '../../utils';
import { validateInputType, validateElements, materialsInputFields } from '../utils';
import { Dropdown, Form, Button } from 'react-bulma-components';
import { MaterialsInputField, MaterialsInputSharedProps } from '../MaterialsInput';
import { MatgenUtilities } from '../../../../utils/matgen';
import { useDebounce } from '../../../../utils/hooks';
import { errors } from 'msw/lib/types/context';
const { Input, Field, Control } = Form;

/**
 * The text input component of a MaterialsInput component
 * Handles the two-way binding between input and periodic table
 */

interface Props extends MaterialsInputSharedProps {
  value: string;
  setValue: (value: string) => void;
  error: string | null;
  setError: (error: string | null) => void;
  liftInputRef?: (value: React.RefObject<HTMLInputElement>) => any;
  onFocus?: (value?: any) => any;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => any;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => any;
}

interface DispatchAction {
  action: (payload: any) => void;
  payload?: any;
}

export const MaterialsInputBox: React.FC<Props> = (props) => {
  const { enabledElements, lastAction, actions: ptActions } = useElements();
  const [delimiter, setDelimiter] = useState(() =>
    props.isChemSys ? new RegExp('-') : new RegExp(',')
  );
  const [ptActionsToDispatch, setPtActionsToDispatch] = useState<DispatchAction[]>([]);
  const [inputValue, setInputValue] = useState(props.value);
  const inputRef = useRef<HTMLInputElement>(null);
  const valueChangedByPT = useRef(false);
  const dropdownItems = [
    { label: 'By elements', value: MaterialsInputField.ELEMENTS },
    { label: 'By formula', value: MaterialsInputField.FORMULA },
    { label: 'By mp-id', value: MaterialsInputField.MP_ID },
  ];

  /**
   * Handle updating the context with the new raw input value
   * All side effects to this change are handled in an effect hook
   */
  const handleRawValueChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleFocus = () => {
    if (props.onFocus) props.onFocus();
  };

  const handleBlur = (event) => {
    if (props.onBlur) props.onBlur(event);
  };

  /**
   * This effect triggers immediately after the props.value changes.
   *
   * The effect is skipped if the value change came from a direct interaction
   * with the periodic table. This prevents unexpected field changes.
   *
   * If onFieldChange prop is included, dynamically determine if the input
   * is an mp-id, list of elements, or formula.
   *
   * Detects elements to add/remove from the periodic table and collects them in ptActionsToDispatch.
   * Only adds/removes elements when input value and pt are not in sync (prevents infinite hooks)
   */
  useEffect(() => {
    if (!valueChangedByPT.current) {
      const enabledElementsList = getTruthyKeys(enabledElements);
      const staticInputField = !props.onFieldChange ? props.field : undefined;
      let [newMaterialsInputField, parsedValue] = validateInputType(inputValue, staticInputField);
      let isValid = parsedValue !== null || !inputValue ? true : false;
      let newDelimiter = delimiter;
      let newPtActionsToDispatch: DispatchAction[] = [];

      if (isValid) {
        props.setError(null);
        switch (newMaterialsInputField) {
          case MaterialsInputField.MP_ID:
            newPtActionsToDispatch.push({
              action: ptActions.clear,
            });
            break;
          case MaterialsInputField.SMILES:
            newPtActionsToDispatch.push({
              action: ptActions.clear,
            });
            break;
          case MaterialsInputField.EXCLUDE_ELEMENTS:
          case MaterialsInputField.ELEMENTS:
          case MaterialsInputField.FORMULA:
            /** Parse the input for a delimiter */
            const parsedDelimiter = getDelimiter(inputValue);
            /** If no delimiter present, don't change the delimiter value */
            newDelimiter = parsedDelimiter ? parsedDelimiter : newDelimiter;
            if (parsedValue) {
              /** Enable new elements if they aren't already enabled */
              parsedValue.forEach((el) => {
                if (!enabledElements[el]) {
                  newPtActionsToDispatch.push({
                    action: ptActions.addEnabledElement,
                    payload: el,
                  });
                }
              });
              /** Remove enabled element if it is not part of the new list of parsed elements */
              enabledElementsList.forEach((el) => {
                if (parsedValue.indexOf(el) === -1) {
                  newPtActionsToDispatch.push({
                    action: ptActions.removeEnabledElement,
                    payload: el,
                  });
                }
              });
            }
            break;
          default:
            newMaterialsInputField = MaterialsInputField.ELEMENTS;
        }

        setPtActionsToDispatch(newPtActionsToDispatch);
        setDelimiter(newDelimiter);
        props.setValue(inputValue);
        if (props.onFieldChange) props.onFieldChange(newMaterialsInputField);
      } else if (staticInputField) {
        props.setError(materialsInputFields[staticInputField].error);
      } else {
        props.setError(
          'Please enter a valid formula (e.g. CeZn5), list of elements (e.g. Ce, Zn or Ce-Zn), or material ID (e.g. mp-394).'
        );
      }
    }
    valueChangedByPT.current = false;
  }, [inputValue]);

  /**
   * This effect executes the periodic table context actions collected by the value effect (above)
   * These are executed in a separate effect (rather than inside the value effect)
   * to prevent issues with execution order when MaterialsInputs are
   * initialized with values (e.g. search param value from the URL).
   */
  useEffect(() => {
    ptActionsToDispatch.forEach((d) => d.action(d.payload));
  }, [ptActionsToDispatch]);

  /**
   * This effect handles direct interactions with the periodic table.
   * This hook is triggered any time enabledElements changes.
   *
   * To prevent an infinite update loop, the function is skipped if
   * enabledElements was changed from an external action, not a direct element click
   * (as determined by the presence of lastAction.type).
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
          newValue = arrayToDelimitedString(enabledElementsList, delimiter);
          if (props.onFieldChange) props.onFieldChange(MaterialsInputField.ELEMENTS);
      }
      valueChangedByPT.current = true;
      props.setValue(newValue);
    }
  }, [enabledElements]);

  useEffect(() => {
    setInputValue(props.value);
  }, [props.value]);

  /**
   * This effect lifts the ref placed in the input element
   * up to the parent MaterialsInput component
   * This allows MaterialsInput to handle focusing the input when the periodic table is clicked
   */
  useEffect(() => {
    if (props.liftInputRef) props.liftInputRef(inputRef);
  }, []);

  const inputControl = (
    <Control className="is-expanded">
      <input
        data-testid="materials-input-search-input"
        className="input"
        type="search"
        autoComplete="off"
        value={inputValue}
        onChange={handleRawValueChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={props.placeholder}
        ref={inputRef}
        onKeyDown={props.onKeyDown}
      />
    </Control>
  );

  return (
    <>
      {props.showFieldDropdown && (
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
      )}
      {inputControl}
    </>
  );
};
