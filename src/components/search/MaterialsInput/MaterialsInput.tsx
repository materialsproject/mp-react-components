import React, { useState, useRef, useEffect } from 'react';
import { formatFormula } from '../utils';
import { Form, Button } from 'react-bulma-components';
const { Input, Field, Control } = Form;
import { FaExclamationTriangle, FaQuestionCircle } from 'react-icons/fa';
import { PeriodicContext } from '../../periodic-table/periodic-table-state/periodic-selection-context';
import { MaterialsInputBox } from './MaterialsInputBox';
import { TableLayout } from '../../periodic-table/periodic-table-component/periodic-table.component';
import { SelectableTable } from '../../periodic-table/table-state';
import classNames from 'classnames';
import { useDebounce, usePrevious } from '../../../utils/hooks';
import axios from 'axios';
import { PeriodicTableFormulaButtons } from '../../periodic-table/PeriodicTableFormulaButtons';
import './MaterialsInput.css';
import { PeriodicTableModeSwitcher } from '../../periodic-table/PeriodicTableModeSwitcher';
import { PeriodicTablePluginWrapper } from '../../periodic-table/PeriodicTablePluginWrapper';
import { MaterialsInputTypesMap } from './utils';

/**
 * An input field component for searching by mp-id, elements, or formula.
 * Renders a text input and a periodic table within a PeriodicContext to support
 * two-way binding between the input and periodic table.
 * i.e. when elements are typed into the field, they are selected in the table,
 * and when elements are selected in the table, they are appended to the field's input.
 */

/**
 * Search types supported by this field
 */
export enum MaterialsInputType {
  ELEMENTS = 'elements',
  FORMULA = 'formula',
  MPID = 'mpid',
  SMILES = 'smiles',
  TEXT = 'text',
}

/**
 * Modes for showing the periodic table
 * TOGGLE: render a button for toggling visibility of periodic table
 * FOCUS: show periodic table when input is focuses, hide on blur
 * NONE: never show the periodic table for this input
 */
export enum PeriodicTableMode {
  TOGGLE = 'toggle',
  FOCUS = 'focus',
  NONE = 'none',
}

export interface MaterialsInputSharedProps {
  value: string;
  inputType: MaterialsInputType;
  allowedInputTypes?: MaterialsInputType[];
  showInputTypeDropdown?: boolean;
  isChemSys?: boolean;
  allowSmiles?: boolean;
  placeholder?: string;
  errorMessage?: string;
  onInputTypeChange?: (inputType: MaterialsInputType) => void;
}

export interface MaterialsInputProps extends MaterialsInputSharedProps {
  id?: string;
  setProps?: (value: any) => any;
  debounce?: number;
  periodicTableMode?: PeriodicTableMode;
  hidePeriodicTable?: boolean;
  autocompleteFormulaUrl?: string;
  autocompleteApiKey?: string;
  tooltip?: string;
  onChange: (value: string) => void;
  onSubmit?: (event: React.FormEvent | React.MouseEvent, value?: string) => any;
  onPropsChange?: (propsObject: any) => void;
}

interface FormulaSuggestion {
  formula_pretty: string;
}

let requestCount = 0;

export const MaterialsInput: React.FC<MaterialsInputProps> = ({
  errorMessage = 'Invalid input value',
  allowedInputTypes = [
    'elements' as MaterialsInputType,
    'formula' as MaterialsInputType,
    'mpid' as MaterialsInputType,
  ],
  ...otherProps
}) => {
  const props = { errorMessage, allowedInputTypes, ...otherProps };
  const [inputValue, setInputValue] = useState(props.value);
  const [inputType, setInputType] = useState(props.inputType);
  const debouncedInputValue = props.debounce ? useDebounce(inputValue, props.debounce) : inputValue;
  const [inputRef, setInputRef] = useState<React.RefObject<HTMLInputElement>>();
  const [error, setError] = useState<string | null>(null);
  const [errorTipStayActive, setErrorTipStayActive] = useState(false);
  const [isChemSys, setIsChemSys] = useState<boolean>(() =>
    props.isChemSys ? props.isChemSys : false
  );
  const periodicTableClicked = useRef(false);
  const [showPeriodicTable, setShowPeriodicTable] = useState(() =>
    props.periodicTableMode === PeriodicTableMode.TOGGLE && !props.hidePeriodicTable ? true : false
  );
  const [showAutocomplete, setShowAutocomplete] = useState(true);
  const [formulaSuggestions, setFormulaSuggestions] = useState<FormulaSuggestion[]>([]);

  const shouldShowAutocomplete = () => {
    if (formulaSuggestions.length > 0) {
      return setShowAutocomplete(true);
    } else {
      return setShowAutocomplete(false);
    }
  };
  const getOnFocusProp = () => {
    setErrorTipStayActive(false);
    shouldShowAutocomplete();
    if (props.periodicTableMode === PeriodicTableMode.FOCUS) {
      return setShowPeriodicTable(true);
    } else {
      return;
    }
  };

  const hideAutoCompleteAndPeriodicTable = () => {
    setShowAutocomplete(false);
    if (props.periodicTableMode === PeriodicTableMode.FOCUS) {
      return setShowPeriodicTable(false);
    }
  };

  /**
   * When blurring out of the input,
   * make sure the user is not clicking on a periodic table element button.
   * If so, keep the input in focus.
   * Otherwise, close the autocomplete menu and hide the periodic table (if using show onFocus mode)
   */
  const getOnBlurProp = (e: React.FocusEvent<HTMLInputElement>) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    const target = e.target;
    if (!periodicTableClicked.current) {
      hideAutoCompleteAndPeriodicTable();
    } else {
      /** Chrome can make use of relatedTarget to avoid using a timeout */
      if (relatedTarget && relatedTarget.className.indexOf('mat-element') > -1) {
        target.focus();
      } else {
        setTimeout(() => {
          target.focus();
        });
      }
    }
    periodicTableClicked.current = false;
  };

  /**
   * If the user is tabbing out of the input,
   * force autocomplete and periodic table to close.
   * This allows users to tab past MaterialInputs that
   * only show periodic tables on focus.
   * Tha above blur function doesn't work because the relatedTarget on tab would be a mat-element.
   */
  const getOnKeyDownProp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 9) {
      hideAutoCompleteAndPeriodicTable();
    }
  };

  /**
   * Trigger MaterialsInput submit event
   * Optional value param allows clicking on autocomplete items
   * to submit the input using a new value that doesn't necessarily
   * match the current input value
   */
  const handleSubmit = (e: React.FormEvent | React.MouseEvent, value?: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (props.onSubmit && !error) {
      setShowPeriodicTable(false);
      setShowAutocomplete(false);
      props.onSubmit(e, value);
    } else {
      setErrorTipStayActive(true);
    }
  };

  const handleChemSysCheck = () => {
    let newIsChemSys = isChemSys;
    if (inputValue.match(/-/gi)) {
      newIsChemSys = true;
    } else if (inputValue.match(/,|\s/gi)) {
      newIsChemSys = false;
    }
    if (props.onPropsChange) props.onPropsChange({ isChemSys: newIsChemSys });
    setIsChemSys(newIsChemSys);
  };

  let MaterialsInputType: JSX.Element | null = null;
  let toggleControl: JSX.Element | null = null;
  let tooltipControl: JSX.Element | null = null;
  let periodicTablePlugin: JSX.Element | undefined = undefined;
  let chemSysCheckbox: JSX.Element | null = null;
  const hasChemSysCheckbox = props.inputType === 'elements' && !props.onSubmit;

  const materialsInputControl = (
    <MaterialsInputBox
      value={inputValue}
      inputType={inputType}
      allowedInputTypes={props.allowedInputTypes}
      isChemSys={props.isChemSys}
      allowSmiles={props.allowSmiles}
      setValue={setInputValue}
      onInputTypeChange={props.onInputTypeChange ? setInputType : undefined}
      onFocus={getOnFocusProp}
      onBlur={getOnBlurProp}
      onKeyDown={getOnKeyDownProp}
      liftInputRef={(ref) => setInputRef(ref)}
      showInputTypeDropdown={props.showInputTypeDropdown}
      placeholder={props.placeholder}
      errorMessage={props.errorMessage}
      setError={setError}
    />
  );

  const autocompleteMenu = (
    <div
      data-testid="materials-input-autocomplete-menu"
      className={classNames('dropdown-menu', 'autocomplete-right', {
        'is-hidden': !showAutocomplete,
      })}
      /** Currently not accessible by keyboard so hiding it to screen readers */
      aria-hidden={true}
    >
      <div data-testid="materials-input-autocomplete-menu-items" className="dropdown-content">
        <p className="autocomplete-label">Suggested formulas</p>
        {formulaSuggestions.map((d, i) => (
          <a
            key={i}
            className="dropdown-item"
            onMouseDown={(e) => {
              setError(null);
              props.onChange(d.formula_pretty);
              if (props.onSubmit) {
                handleSubmit(e, d.formula_pretty);
              }
            }}
          >
            {formatFormula(d.formula_pretty)}
          </a>
        ))}
      </div>
    </div>
  );

  if (props.periodicTableMode === PeriodicTableMode.TOGGLE) {
    toggleControl = (
      <Control>
        <button
          data-testid="materials-input-toggle-button"
          type="button"
          className="button has-oversized-icon is-size-2"
          onClick={() => setShowPeriodicTable(!showPeriodicTable)}
        >
          <i
            className={classNames('icon-fontastic-periodic-table-squares', {
              'is-active': showPeriodicTable,
            })}
          />
        </button>
      </Control>
    );
  }

  if (props.tooltip) {
    tooltipControl = (
      <Control>
        <button
          data-testid="materials-input-tooltip-button"
          type="button"
          className="button has-tooltip-multiline has-tooltip-bottom has-text-grey-light"
          data-tooltip={props.tooltip}
        >
          <FaQuestionCircle />
        </button>
      </Control>
    );
  }

  const errorControl = (
    <Control>
      <button
        data-testid="materials-input-error"
        type="button"
        className={classNames(
          'mpc-materials-input-error button has-tooltip-multiline has-tooltip-bottom',
          {
            'has-tooltip-active': errorTipStayActive,
          }
        )}
        onMouseOver={(e) => setErrorTipStayActive(false)}
        data-tooltip={error}
      >
        <FaExclamationTriangle />
      </button>
    </Control>
  );

  if (props.onSubmit) {
    MaterialsInputType = (
      <form data-testid="materials-input-form" onSubmit={(e) => handleSubmit(e)}>
        <Field className="has-addons">
          {toggleControl}
          {materialsInputControl}
          {error && errorControl}
          {tooltipControl}
          <Control>
            <Button color="primary" type="submit">
              Search
            </Button>
          </Control>
        </Field>
      </form>
    );
  } else {
    MaterialsInputType = (
      <Field className="has-addons">
        {toggleControl}
        {materialsInputControl}
        {error && errorControl}
        {tooltipControl}
      </Field>
    );
  }

  if (hasChemSysCheckbox) {
    chemSysCheckbox = (
      <label className="checkbox">
        <input
          type="checkbox"
          role="checkbox"
          checked={isChemSys}
          aria-checked={isChemSys}
          onChange={(e) => {
            let newValue = '';
            if (e.target.checked) {
              newValue = props.value.replace(/,\sand|,\s|,|\s/gi, '-');
            } else {
              newValue = props.value.replace(/-/gi, ',');
            }
            setIsChemSys(e.target.checked);
            if (props.onPropsChange) props.onPropsChange({ isChemSys: e.target.checked });
            props.onChange(newValue);
          }}
        />
        <span>Contains no other elements</span>
      </label>
    );
  }

  /**
   * Include periodic table mode switcher if component
   * allows dynamic field switching.
   *
   * Include only formula buttons if component handles the formula field.
   *
   * Include no plugin if component only handles elements field.
   */
  if (props.onInputTypeChange) {
    periodicTablePlugin = (
      <PeriodicTableModeSwitcher
        mode={inputType}
        onSwitch={setInputType}
        onFormulaButtonClick={(v) => setInputValue(inputValue + v)}
      />
    );
  } else if (props.inputType === 'formula') {
    periodicTablePlugin = (
      <PeriodicTablePluginWrapper>
        <PeriodicTableFormulaButtons onClick={(v) => setInputValue(inputValue + v)} />
      </PeriodicTablePluginWrapper>
    );
  }

  /**
   * This effect triggers when the input value changes
   * It handles modifying the chemsys flag (checked when input is dash-delimited or one element)
   * It also handles fetching formula suggestions if the necessary props are supplied
   */
  useEffect(() => {
    handleChemSysCheck();
    if (props.autocompleteFormulaUrl && inputType === 'formula' && inputValue.length) {
      requestCount++;
      const requestIndex = requestCount;
      axios
        .get(props.autocompleteFormulaUrl, {
          params: { text: inputValue },
          headers: props.autocompleteApiKey ? { 'X-Api-Key': props.autocompleteApiKey } : null,
        })
        .then((result) => {
          console.log(result);
          if (requestIndex === requestCount) {
            setFormulaSuggestions(result.data.data);
          }
        })
        .catch((error) => {
          console.log(error);
          if (requestIndex === requestCount) {
            setFormulaSuggestions([]);
          }
        });
    } else {
      setFormulaSuggestions([]);
    }
  }, [inputValue, inputType]);

  /**
   * This effect ensures that the visibility
   * of the autocomplete menu responds to changes
   * in the number of suggestions (if no suggestions, hide the menu)
   */
  useEffect(() => {
    if (formulaSuggestions.length > 0 && document.activeElement === inputRef?.current) {
      setShowAutocomplete(true);
    } else {
      setShowAutocomplete(false);
    }
  }, [formulaSuggestions]);

  /**
   * This effect is triggered when the value prop is changed from outside this component
   * Here inputValue is set, triggering debouncedInputValue to get set after the debounce timer
   */
  useEffect(() => {
    setInputValue(props.value);
  }, [props.value]);

  useEffect(() => {
    setInputType(props.inputType);
  }, [props.inputType]);

  useEffect(() => {
    if (props.onInputTypeChange) props.onInputTypeChange(inputType);
  }, [inputType]);

  /**
   * This effect is triggered after the debouncedInputValue is set
   * The debouncedInputValue is set with inputValue after the specified debounce time
   * If no debounce prop is supplied, there is no debounce and debouncedInputValue is exactly the same as inputValue
   * Triggers the onChange event prop for the value prop
   */
  useEffect(() => {
    if (!error) {
      props.onChange(debouncedInputValue);
    }
  }, [debouncedInputValue]);

  return (
    <div className="mpc-materials-input">
      <PeriodicContext>
        {MaterialsInputType}
        {chemSysCheckbox}
        {autocompleteMenu}
        <div
          data-testid="materials-input-periodic-table"
          className={classNames('table-transition-wrapper-small', 'can-hide-by-height', {
            'is-hidden-by-height': !showPeriodicTable,
            'mt-3': showPeriodicTable,
          })}
          aria-hidden={!showPeriodicTable}
          onMouseDown={(event) => {
            periodicTableClicked.current = true;
            // if (inputRef && inputRef.current) {
            //   const target = inputRef.current;
            //   setTimeout(() => {
            //     target.focus();
            //   }, 500);
            // }
          }}
        >
          <SelectableTable
            disabled={!showPeriodicTable}
            maxElementSelectable={20}
            forceTableLayout={TableLayout.MINI}
            hiddenElements={[]}
            plugin={periodicTablePlugin}
            onStateChange={(enabledElements) => {
              Object.keys(enabledElements).filter((el) => enabledElements[el]);
            }}
          />
        </div>
      </PeriodicContext>
    </div>
  );
};

MaterialsInput.defaultProps = {
  value: '',
  inputType: MaterialsInputType.ELEMENTS,
  onChange: (value) => undefined,
};
