import React, { useState, useEffect, useRef } from 'react';
import { useElements } from '../../../periodic-table/periodic-table-state/table-store';
import {
  getDelimiter,
  formulaStringToArrays,
  getTruthyKeys,
  arrayToDelimitedString,
  mapArrayToBooleanObject
} from '../../utils';
import {
  validateInputType,
  detectAndValidateInputType,
  validateInputLength,
  materialsInputTypes
} from '../utils';
import { Dropdown, Form } from 'react-bulma-components';
import { MaterialsInputType, MaterialsInputSharedProps } from '../MaterialsInput';
import classNames from 'classnames';
import { FormulaAutocomplete } from '../FormulaAutocomplete';
import { InputHelp } from '../InputHelp';
import { FaQuestionCircle } from 'react-icons/fa';
import { Tooltip } from '../../../data-display/Tooltip';
import { v4 as uuidv4 } from 'uuid';
const { Input, Field, Control } = Form;

/**
 * The text input component of a MaterialsInput component
 * Handles the two-way binding between input and periodic table
 */

interface Props extends MaterialsInputSharedProps {
  value: string;
  setValue: (value: string) => void;
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

export const MaterialsInputBox: React.FC<Props> = ({ allowedInputTypes = [], ...otherProps }) => {
  const props = { allowedInputTypes, ...otherProps };
  const { enabledElements, lastAction, actions: ptActions } = useElements();
  const [delimiter, setDelimiter] = useState(() =>
    props.type === MaterialsInputType.CHEMICAL_SYSTEM ? new RegExp('-') : new RegExp(',')
  );
  const [ptActionsToDispatch, setPtActionsToDispatch] = useState<DispatchAction[]>([]);
  const [inputValue, setInputValue] = useState(props.value);
  const [inputType, setInputType] = useState<MaterialsInputType | null>(props.type || null);
  const [prevInputValue, setPrevInputValue] = useState(props.value);
  const [maxElementsReached, setMaxElementsReached] = useState(false);
  const [showInputHelp, setShowInputHelp] = useState(false);
  const staticInputField = props.allowedInputTypes.length === 1 ? props.type : undefined;
  const includeAutocomplete =
    props.autocompleteFormulaUrl &&
    (props.type == MaterialsInputType.FORMULA ||
      props.allowedInputTypes.indexOf(MaterialsInputType.FORMULA) > -1);
  const inputRef = useRef<HTMLInputElement>(null);
  const valueChangedByPT = useRef(false);
  const dropdownItems = [
    { label: 'By elements', value: MaterialsInputType.ELEMENTS },
    { label: 'By formula', value: MaterialsInputType.FORMULA },
    { label: 'By mp-id', value: MaterialsInputType.MPID }
  ];
  const helpTooltipId = props.helpItems ? `materials-input-help-${uuidv4()}` : undefined;

  /**
   * Determine whether the help or autocomplete menus should display under the input.
   * This is executed on focus and on input value change.
   * Only show autocomplete if the input type is formula and the input value is not empty.
   * Hide the help box if autocomplete should be showing.
   * Show help box if input is focused and value is empty.
   */
  const shouldShowHelpOrAutocomplete = (currentInputType: MaterialsInputType | null) => {
    if (
      currentInputType === MaterialsInputType.FORMULA &&
      inputValue !== undefined &&
      inputValue !== '' &&
      document.activeElement === inputRef.current
    ) {
      if (props.setShowAutocomplete) props.setShowAutocomplete(true);
      setShowInputHelp(false);
    } else if (document.activeElement === inputRef.current && (!inputValue || inputValue === '')) {
      setShowInputHelp(true);
    } else {
      setShowInputHelp(false);
    }
  };

  /**
   * Handle updating the context with the new raw input value
   * All side effects to this change are handled in an effect hook
   */
  const handleRawValueChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleFocus = () => {
    shouldShowHelpOrAutocomplete(inputType);
    if (props.onFocus) props.onFocus();
  };

  const handleBlur = (e) => {
    if (props.setShowAutocomplete) props.setShowAutocomplete(false);
    setShowInputHelp(false);
    if (props.onBlur) props.onBlur(e);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 9 && props.setShowAutocomplete) props.setShowAutocomplete(false);
    if (props.onKeyDown) props.onKeyDown(e);
  };

  /**
   * This effect triggers immediately after the props.value changes.
   *
   * The effect is skipped if the value change came from a direct interaction
   * with the periodic table. This prevents unexpected field changes.
   *
   * If onInputTypeChange prop is included, dynamically determine if the input
   * is an mp-id, list of elements, or formula.
   *
   * Detects elements to add/remove from the periodic table and collects them in ptActionsToDispatch.
   * Only adds/removes elements when input value and pt are not in sync (prevents infinite hooks)
   */
  useEffect(() => {
    if (!valueChangedByPT.current) {
      const [newMaterialsInputType, parsedValue] = staticInputField
        ? validateInputType(inputValue, staticInputField)
        : detectAndValidateInputType(inputValue, props.allowedInputTypes!);
      const isValidInputLength = validateInputLength(
        parsedValue,
        newMaterialsInputType,
        props.maxElementSelectable
      );
      const isMaxElements =
        Array.isArray(parsedValue) && parsedValue.length === props.maxElementSelectable;
      const isValid = (parsedValue && isValidInputLength) || !inputValue ? true : false;
      shouldShowHelpOrAutocomplete(newMaterialsInputType);

      /**
       * Short circuit the input update and return to previous value
       * if the new value is beyond the max number of elements,
       * or if the max number of elements has already been reached and
       * the new value is invalid.
       *
       * This two-step check ensures that it's possible to reach the max
       * number of elements and be able to type another letter if the result
       * is still a valid list of the max number of elements.
       * e.g. If max = 4, it's possible to go from Fe-Ni-H-C to Fe-Ni-H-Co.
       */
      if (!isValidInputLength || (maxElementsReached && !isValid)) {
        console.log('stop input update');
        console.log(prevInputValue);
        setInputValue(prevInputValue);
        props.setValue(prevInputValue);
        return;
      }

      setMaxElementsReached(isMaxElements);
      const newPtActionsToDispatch: DispatchAction[] = [];
      let newDelimiter = delimiter;

      if (isValid) {
        props.setError(null);
        if (
          newMaterialsInputType === MaterialsInputType.ELEMENTS ||
          newMaterialsInputType === MaterialsInputType.CHEMICAL_SYSTEM ||
          newMaterialsInputType === MaterialsInputType.FORMULA
        ) {
          /** Parse the input for a delimiter */
          const parsedDelimiter = getDelimiter(inputValue);
          /** If no delimiter present, don't change the delimiter value */
          newDelimiter = parsedDelimiter ? parsedDelimiter : newDelimiter;
          const parsedElements = parsedValue || [];
          newPtActionsToDispatch.push({
            action: ptActions.setEnabledElements,
            payload: mapArrayToBooleanObject(parsedElements)
          });
        } else {
          newPtActionsToDispatch.push({
            action: ptActions.clear
          });
        }

        setInputType(newMaterialsInputType);
        setPtActionsToDispatch(newPtActionsToDispatch);
        setDelimiter(newDelimiter);
        setPrevInputValue(inputValue);
        props.setValue(inputValue);
        if (props.onInputTypeChange && newMaterialsInputType) {
          props.onInputTypeChange(newMaterialsInputType);
        }
        // if (props.onInputTypeChange && newMaterialsInputType) {
        //   props.onInputTypeChange(newMaterialsInputType);
        // } else {
        //   props.setValue(inputValue);
        // }
      } else {
        props.setError(props.errorMessage!);
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
      switch (props.type) {
        case MaterialsInputType.ELEMENTS:
        case MaterialsInputType.CHEMICAL_SYSTEM:
          let elementsSplit = props.value ? props.value.split(delimiter) : [];
          elementsSplit = elementsSplit.filter((d) => d !== '');
          if (lastAction.type === 'select') {
            elementsSplit.push(enabledElementsList[enabledElementsList.length - 1]);
          } else {
            /** Find which element is no longer enabled (ignore wildcards) */
            const removedIndex = elementsSplit?.findIndex((d, i) => {
              let cleanEl = d.replace(/\s/g, '');
              return cleanEl !== '*' && enabledElementsList.indexOf(cleanEl) === -1;
            });
            if (removedIndex !== undefined) elementsSplit?.splice(removedIndex, 1);
          }
          newValue = arrayToDelimitedString(elementsSplit, delimiter);
          break;
        case MaterialsInputType.FORMULA:
          if (lastAction.type === 'select') {
            newValue = props.value + enabledElementsList[enabledElementsList.length - 1];
          } else {
            var { formulaSplitWithNumbers, formulaSplitElementsOnly } = formulaStringToArrays(
              props.value
            );
            /** Find which element is no longer enabled (ignore wildcards) */
            const removedIndex = formulaSplitElementsOnly?.findIndex((d, i) => {
              return d !== '*' && enabledElementsList.indexOf(d) === -1;
            });
            if (removedIndex !== undefined) formulaSplitWithNumbers?.splice(removedIndex, 1);
            if (formulaSplitWithNumbers) newValue = formulaSplitWithNumbers.join('');
          }
          break;
        default:
          newValue = arrayToDelimitedString(enabledElementsList, delimiter);
          if (props.onInputTypeChange) props.onInputTypeChange(MaterialsInputType.ELEMENTS);
      }
      valueChangedByPT.current = true;
      props.setError(null);
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

  /**
   * When the input type prop is changed (e.g. via dropdown),
   * set the delimiter accordingly
   */
  useEffect(() => {
    setDelimiter(
      props.type === MaterialsInputType.CHEMICAL_SYSTEM ? new RegExp('-') : new RegExp(',')
    );
  }, [props.type]);

  return (
    <>
      <Control className="is-expanded">
        <input
          data-testid="materials-input-search-input"
          className={classNames('input', props.inputClassName)}
          type="search"
          autoComplete="off"
          value={inputValue}
          onChange={handleRawValueChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={props.placeholder}
          ref={inputRef}
          onKeyDown={handleKeyDown}
        />
        {includeAutocomplete && (
          <FormulaAutocomplete
            value={inputValue}
            inputType={inputType}
            apiEndpoint={props.autocompleteFormulaUrl!}
            apiKey={props.autocompleteApiKey}
            show={props.showAutocomplete}
            /**
             * onChange must come from the top-level onChange event for MaterialsInput (i.e. not modify inputValue directly)
             * otherwise there will be circular hooks.
             */
            onChange={(value) => {
              inputRef.current?.blur();
              if (props.onChange) props.onChange(value);
            }}
            onSubmit={props.onSubmit}
            setError={props.setError}
          />
        )}
        {props.helpItems && (
          <InputHelp items={props.helpItems} show={showInputHelp} onChange={props.setValue} />
        )}
      </Control>
      {props.helpItems && (
        <Control>
          <button
            data-testid="materials-input-help-button"
            type="button"
            className={classNames('button input-help-button', {
              'has-text-grey-light': !showInputHelp,
              'has-text-link': showInputHelp
            })}
            onClick={() => setShowInputHelp(!showInputHelp)}
            data-tip
            data-for={helpTooltipId}
          >
            <FaQuestionCircle />
            <Tooltip id={helpTooltipId} place="bottom">
              {showInputHelp ? 'Hide examples' : 'Show examples'}
            </Tooltip>
          </button>
        </Control>
      )}
    </>
  );
};
