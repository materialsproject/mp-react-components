import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useElements } from '../../../periodic-table/periodic-table-state/table-store';
import { TABLE_DICO_V2 } from '../../../periodic-table/periodic-table-data/table-v2';
import {
  getDelimiter,
  elementsArrayToElementState,
  formulaStringToArrays,
  getTruthyKeys,
  arrayToDelimitedString,
  parseElements,
  parseSmiles,
  parseFormula
} from '../../utils';
import { Dropdown, Form, Button } from 'react-bulma-components';
import { MaterialsInputField, MaterialsInputSharedProps } from '../MaterialsInput';
import { useDebounce } from '../../../../utils/hooks';
const { Input, Field, Control } = Form;

/**
 * The text input component of a MaterialsInput component
 * Handles the two-way binding between input and periodic table
 */

interface Props extends MaterialsInputSharedProps {
  value: string;
  setValue: (value: string) => void;
  liftInputRef?: (value: React.RefObject<HTMLInputElement>) => any;
  onFocus?: (value?: any) => any;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => any;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => any;
}

interface DispatchAction {
  action: (payload: any) => void;
  payload?: any;
}

export const MaterialsInputBox: React.FC<Props> = props => {
  const { enabledElements, lastAction, actions: ptActions } = useElements();
  const [delimiter, setDelimiter] = useState(() => props.isChemSys ? new RegExp('-') : new RegExp(','));
  const [ptActionsToDispatch, setPtActionsToDispatch] = useState<DispatchAction[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
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
    props.setValue(e.target.value);
  };

  const handleFocus = () => {
    if (props.onFocus) props.onFocus();
  };

  const handleBlur = event => {
    if (props.onBlur) props.onBlur(event);
  };

  /**
   * This effect triggers immediately after the props.value changes
   * If onFieldChange prop is included, dynamically determine if the input
   * is an mp-id, list of elements, or formula.
   * Detects elements to add/remove from the periodic table and collects them in ptActionsToDispatch.
   * Only adds/removes elements when input value and pt are not in sync (prevents infinite hooks)
   * Sends clean input value to onChange function passed in as a prop
   */
  useEffect(() => {
    const enabledElementsList = getTruthyKeys(enabledElements);
    const newValue = props.value;
    const shouldCheckField = props.onFieldChange && newValue;
    let newMaterialsInputField = props.field;
    let newDelimiter = delimiter;
    let newPtActionsToDispatch: DispatchAction[] = [];

    /**
     * Field name switches to MP_ID if the input starts with 'mp' or 'mvc'.
     * Field name switches to ELEMENTS if the input contains one of the accepted delimiters (comma, hyphen, or space).
     * Field name switches to FORMULA if the input doesn't contain a delimiter
     * and does contain multiple capital letters or a number.
     */
    if (shouldCheckField && (newValue.indexOf('mp') === 0 || newValue.indexOf('mvc') === 0 || newValue.indexOf('mol') === 0)) {
      newMaterialsInputField = MaterialsInputField.MP_ID;
    } else if (shouldCheckField && newValue.match(/,|-|\s/gi)) {
      newMaterialsInputField = MaterialsInputField.ELEMENTS;
    } else if (shouldCheckField && props.allowSmiles && parseSmiles(newValue)) {
      newMaterialsInputField = MaterialsInputField.SMILES;
    } else if (shouldCheckField && parseFormula(newValue)) {
      newMaterialsInputField = MaterialsInputField.FORMULA;
    } else if (shouldCheckField) {
      newMaterialsInputField = MaterialsInputField.ELEMENTS;
    }

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
  }, [props.value]);

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
          return;
      }
      props.setValue(newValue);
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
        data-testid="search-input"
        className="input"
        type="search"
        value={props.value}
        onChange={handleRawValueChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={props.placeholder}
        ref={inputRef}
        onKeyDown={props.onKeyDown}
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
