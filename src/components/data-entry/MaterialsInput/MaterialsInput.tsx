import React, { useState, useRef, useEffect } from 'react';
import { arrayToDelimitedString, capitalize, formatFormula, pluralize } from '../utils';
import { Form, Button } from 'react-bulma-components';
const { Input, Field, Control } = Form;
import { FaAngleDown, FaExclamationTriangle, FaQuestionCircle } from 'react-icons/fa';
import classNames from 'classnames';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import {
  Wrapper as MenuWrapper,
  Button as MenuButton,
  Menu,
  MenuItem
} from 'react-aria-menubutton';
import { useDebounce, usePrevious } from '../../../utils/hooks';
import { PeriodicContext } from '../../periodic-table/periodic-table-state/periodic-selection-context';
import { MaterialsInputBox } from './MaterialsInputBox';
import { TableLayout } from '../../periodic-table/periodic-table-component/periodic-table.component';
import { SelectableTable } from '../../periodic-table/table-state';
import { PeriodicTableFormulaButtons } from '../../periodic-table/PeriodicTableFormulaButtons';
import './MaterialsInput.css';
import { PeriodicTableModeSwitcher } from '../../periodic-table/PeriodicTableModeSwitcher';
import { PeriodicTablePluginWrapper } from '../../periodic-table/PeriodicTablePluginWrapper';
import { MaterialsInputTypesMap, validateElements, validateFormula } from './utils';
import { PeriodicTableSelectionMode } from '../../periodic-table/PeriodicTableModeSwitcher/PeriodicTableModeSwitcher';
import { Tooltip } from '../../data-display/Tooltip';

/**
 * Search types supported by this field
 */
export enum MaterialsInputType {
  ELEMENTS = 'elements',
  FORMULA = 'formula',
  MPID = 'mpid',
  SMILES = 'smiles',
  TEXT = 'text'
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
  NONE = 'none'
}

export interface MaterialsInputSharedProps {
  value: string;
  inputType: MaterialsInputType;
  allowedInputTypes?: MaterialsInputType[];
  showInputTypeDropdown?: boolean;
  /** Temporary prop until this can be handled in inputTypes */
  hideChemSys?: boolean;
  isChemSys?: boolean;
  allowSmiles?: boolean;
  placeholder?: string;
  errorMessage?: string;
  inputClassName?: string;
  autocompleteFormulaUrl?: string;
  autocompleteApiKey?: string;
  onChange?: (value: string) => void;
  onInputTypeChange?: (inputType: MaterialsInputType) => void;
  onSubmit?: (event: React.FormEvent | React.MouseEvent, value?: string, filterProps?: any) => any;
}

export interface MaterialsInputProps extends MaterialsInputSharedProps {
  id?: string;
  setProps?: (value: any) => any;
  debounce?: number;
  periodicTableMode?: PeriodicTableMode;
  hidePeriodicTable?: boolean;
  tooltip?: string;
  label?: string;
  onPropsChange?: (propsObject: any) => void;
}

interface FormulaSuggestion {
  formula_pretty: string;
}

let requestCount = 0;

enum ChemSysDropdownValue {
  ONLY = 'Only',
  AT_LEAST = 'At least'
}

/**
 * Map the list of allowed input types to a list of allowed periodic table selection modes.
 * This prevents periodic table modes dropdown from having items that are
 * inconsistent with the allowed input types.
 * The order that these items are appended determines the order they are rendered in the periodic table.
 */
const getAllowedSelectionModes = (
  allowedInputTypes: MaterialsInputType[],
  hideChemSys?: boolean
) => {
  const allowedModes: PeriodicTableSelectionMode[] = [];

  if (allowedInputTypes.indexOf(MaterialsInputType.ELEMENTS) > -1) {
    if (!hideChemSys) allowedModes.push(PeriodicTableSelectionMode.CHEMICAL_SYSTEM);
    allowedModes.push(PeriodicTableSelectionMode.ELEMENTS);
  }

  if (allowedInputTypes.indexOf(MaterialsInputType.FORMULA) > -1) {
    allowedModes.push(PeriodicTableSelectionMode.FORMULA);
  }

  return allowedModes;
};

/**
 * An input field component for searching by mp-id, elements, or formula.
 * Renders a text input and a periodic table within a PeriodicContext to support
 * two-way binding between the input and periodic table.
 * i.e. when elements are typed into the field, they are selected in the table,
 * and when elements are selected in the table, they are appended to the field's input.
 */
export const MaterialsInput: React.FC<MaterialsInputProps> = ({
  errorMessage = 'Invalid input value',
  allowedInputTypes = [
    'elements' as MaterialsInputType,
    'formula' as MaterialsInputType,
    'mpid' as MaterialsInputType
  ],
  onChange = (value) => value,
  ...otherProps
}) => {
  const props = { errorMessage, allowedInputTypes, onChange, ...otherProps };
  const [inputValue, setInputValue] = useState(props.value);
  const [inputType, setInputType] = useState(props.inputType);
  const debouncedInputValue = props.debounce ? useDebounce(inputValue, props.debounce) : inputValue;
  const [inputRef, setInputRef] = useState<React.RefObject<HTMLInputElement>>();
  const [error, setError] = useState<string | null>(null);
  const [errorTipStayActive, setErrorTipStayActive] = useState(false);
  const [selectionMode, setSelectionMode] = useState(() => {
    return inputType === MaterialsInputType.FORMULA
      ? PeriodicTableSelectionMode.FORMULA
      : PeriodicTableSelectionMode.CHEMICAL_SYSTEM;
  });
  const [isChemSys, setIsChemSys] = useState<boolean | undefined>(() => {
    if (props.isChemSys) {
      return props.isChemSys;
    } else if (
      props.onInputTypeChange &&
      selectionMode === PeriodicTableSelectionMode.CHEMICAL_SYSTEM
    ) {
      return true;
    } else {
      return false;
    }
  });
  const [chemSysDropdownValue, setChemSysDropdownValue] = useState<
    ChemSysDropdownValue | undefined
  >(() => {
    if (props.hideChemSys || props.inputType !== 'elements' || props.onInputTypeChange) {
      return;
    } else {
      return isChemSys ? ChemSysDropdownValue.ONLY : ChemSysDropdownValue.AT_LEAST;
    }
  });
  const periodicTableClicked = useRef(false);
  const [showPeriodicTable, setShowPeriodicTable] = useState(() => {
    return false;
    // return props.periodicTableMode === PeriodicTableMode.TOGGLE && !props.hidePeriodicTable
    //   ? true
    //   : false;
  });
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const shouldShowHelpMenu = () => {
    if (!inputValue || inputValue == '') {
      return setShowHelpMenu(true);
    } else {
      return setShowHelpMenu(false);
    }
  };

  const getOnFocusProp = () => {
    setErrorTipStayActive(false);
    shouldShowHelpMenu();
    setIsFocused(true);
    if (props.periodicTableMode === PeriodicTableMode.FOCUS) {
      return setShowPeriodicTable(true);
    } else {
      return;
    }
  };

  /**
   * When blurring out of the input,
   * make sure the user is not clicking on a periodic table element button.
   * If so, keep the input in focus.
   * Otherwise, hide the periodic table (if using show onFocus mode)
   */
  const getOnBlurProp = (e: React.FocusEvent<HTMLInputElement>) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    const target = e.target;
    setShowHelpMenu(false);
    setIsFocused(false);
    if (props.periodicTableMode === PeriodicTableMode.FOCUS || !periodicTableClicked.current) {
      setShowPeriodicTable(false);
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
   * force periodic table to close.
   * This allows users to tab past MaterialInputs that
   * only show periodic tables on focus.
   * Tha above blur function doesn't work because the relatedTarget on tab would be a mat-element.
   */
  const getOnKeyDownProp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 9 && props.periodicTableMode === PeriodicTableMode.FOCUS) {
      return setShowPeriodicTable(false);
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
      /**
       * Pass filterProps to submit so that the chem sys flag
       * can persist into the activated filter.
       * This is primarily only important for searches for single elements
       * because the chem sys flag cannot be inferred by the input value.
       */
      const filterProps = inputType === MaterialsInputType.ELEMENTS ? { isChemSys } : null;
      props.onSubmit(e, value, filterProps);
    } else {
      setErrorTipStayActive(true);
    }
  };

  /**
   * Dynamically determine if input is a chemical system
   * based on its inputType and the presence of a '-'
   */
  const handleChemSysCheck = () => {
    let newIsChemSys: boolean | undefined;
    if (inputType === MaterialsInputType.ELEMENTS && inputValue.match(/-/gi)) {
      newIsChemSys = true;
    } else if (inputValue.match(/,|\s/gi)) {
      newIsChemSys = false;
    }
    if (newIsChemSys !== undefined) setIsChemSys(newIsChemSys);
    return newIsChemSys;
  };

  let materialsInputField: JSX.Element | null = null;
  let labelControl: JSX.Element | null = null;
  let periodicToggleControl: JSX.Element | null = null;
  let tooltipControl: JSX.Element | null = null;
  let periodicTablePlugin: JSX.Element | undefined = undefined;
  let chemSysDropdown: JSX.Element | null = null;

  const materialsInputControl = (
    <MaterialsInputBox
      value={inputValue}
      inputType={inputType}
      allowedInputTypes={props.allowedInputTypes}
      isChemSys={isChemSys}
      allowSmiles={props.allowSmiles}
      setValue={setInputValue}
      onInputTypeChange={props.onInputTypeChange ? setInputType : undefined}
      onFocus={getOnFocusProp}
      onBlur={getOnBlurProp}
      onKeyDown={getOnKeyDownProp}
      onSubmit={handleSubmit}
      liftInputRef={(ref) => setInputRef(ref)}
      showInputTypeDropdown={props.showInputTypeDropdown}
      placeholder={props.placeholder}
      errorMessage={props.errorMessage}
      setError={setError}
      inputClassName={props.inputClassName}
      autocompleteFormulaUrl={props.autocompleteFormulaUrl}
      autocompleteApiKey={props.autocompleteApiKey}
      onChange={props.onChange}
    />
  );

  const helpMenu = (
    <div
      data-testid="materials-input-help-menu"
      className={classNames('input-help-menu', {
        'is-hidden': !showHelpMenu
      })}
    >
      <div className="mb-2 is-size-7">How to Search</div>
      <div className="mb-2">
        <strong>Include at least elements:</strong>
        <div className="ml-3 tags">
          <a className="tag is-medium">Li,Fe</a>
          <a className="tag is-medium">Si,O,K</a>
        </div>
      </div>
      <div className="mb-2">
        <strong>Include only elements:</strong>
        <div className="ml-3 tags">
          <a className="tag is-medium">Li-Fe</a>
          <a className="tag is-medium">Si-O-K</a>
        </div>
      </div>
      <div className="mb-2">
        <strong>Include only elements plus wildcard elements:</strong>
        <div className="ml-3 tags">
          <a className="tag is-medium">Li-Fe-*-*</a>
          <a className="tag is-medium">Si-*-*-*</a>
        </div>
      </div>
      <div className="mb-2">
        <strong>Has exact formula:</strong>
        <div className="ml-3 tags">
          <a className="tag is-medium">Li3Fe</a>
          <a className="tag is-medium">Eu2SiCl2O3</a>
        </div>
      </div>
      <div className="mb-2">
        <strong>Has formula plus wildcard atoms:</strong>
        <div className="ml-3 tags">
          <a className="tag is-medium">LiFe*2*</a>
          <a className="tag is-medium">Si*</a>
        </div>
      </div>
      <div className="mb-4">
        <strong>Has Material ID:</strong>
        <div className="ml-3 tags">
          <a className="tag is-medium">mp-149</a>
          <a className="tag is-medium">mp-19326</a>
        </div>
      </div>
      <div className="is-size-7">Additional search options available in the filters panel</div>
    </div>
  );

  if (props.label) {
    labelControl = (
      <Control>
        <button className="button is-static">{capitalize(pluralize(props.label))}</button>
      </Control>
    );
  }

  if (props.periodicTableMode === PeriodicTableMode.TOGGLE) {
    var tooltipId = `materials-input-periodic-button-${uuidv4()}`;
    periodicToggleControl = (
      <Control>
        <button
          data-testid="materials-input-toggle-button"
          type="button"
          className="button has-oversized-icon is-size-2"
          onClick={() => setShowPeriodicTable(!showPeriodicTable)}
          data-tip
          data-for={tooltipId}
        >
          <i
            className={classNames('icon-fontastic-periodic-table-squares', {
              'is-active': showPeriodicTable
            })}
          />
          <Tooltip id={tooltipId} place="bottom">
            {showPeriodicTable ? 'Hide Periodic Table' : 'Show Periodic Table'}
          </Tooltip>
        </button>
      </Control>
    );
  }

  if (props.tooltip) {
    var tooltipId = `materials-input-help-${uuidv4()}`;
    tooltipControl = (
      <Control>
        <button
          data-testid="materials-input-tooltip-button"
          type="button"
          className="button has-text-grey-light"
          data-tip
          data-for={tooltipId}
        >
          <FaQuestionCircle />
          <Tooltip id={tooltipId} place="bottom">
            {props.tooltip}
          </Tooltip>
        </button>
      </Control>
    );
  }

  const errorTooltipId = `materials-error-${uuidv4()}`;
  const errorControl = (
    <Control>
      <button
        data-testid="materials-input-error"
        type="button"
        className={classNames('mpc-materials-input-error button', {
          'has-tooltip-active': errorTipStayActive
        })}
        onMouseOver={(e) => setErrorTipStayActive(false)}
        data-tip
        data-for={errorTooltipId}
      >
        <FaExclamationTriangle />
        <Tooltip id={errorTooltipId} place="bottom">
          {error}
        </Tooltip>
      </button>
    </Control>
  );

  if (chemSysDropdownValue) {
    chemSysDropdown = (
      <MenuWrapper
        data-testid="mpc-chemsys-dropdown"
        className="control dropdown is-active"
        onSelection={(v: ChemSysDropdownValue) => {
          setChemSysDropdownValue(v);
        }}
      >
        <div className="dropdown-trigger">
          <MenuButton className="button">
            <span>{chemSysDropdownValue}</span>
            <span className="icon">
              <FaAngleDown />
            </span>
          </MenuButton>
        </div>
        <Menu className="dropdown-menu">
          <ul className="dropdown-content">
            {Object.values(ChemSysDropdownValue).map((d) => (
              <MenuItem key={d} value={d}>
                <li
                  className={classNames('dropdown-item', {
                    'is-active': d === chemSysDropdownValue
                  })}
                >
                  {d}
                </li>
              </MenuItem>
            ))}
          </ul>
        </Menu>
      </MenuWrapper>
    );
  }

  if (props.onSubmit) {
    materialsInputField = (
      <form data-testid="materials-input-form" onSubmit={(e) => handleSubmit(e)}>
        <Field className="has-addons">
          {labelControl}
          <Control>{helpMenu}</Control>
          {materialsInputControl}
          {error && errorControl}
          {periodicToggleControl}
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
    materialsInputField = (
      <Field className="has-addons">
        {labelControl}
        {chemSysDropdown}
        {materialsInputControl}
        {error && errorControl}
        {periodicToggleControl}
        {tooltipControl}
      </Field>
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
        mode={selectionMode}
        allowedModes={getAllowedSelectionModes(props.allowedInputTypes, props.hideChemSys)}
        onSwitch={setSelectionMode}
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
   * When the input value or type changes...
   * dynamically modify the chem sys flag,
   * change the periodic table selection mode dropdown value based on the input type
   */
  useEffect(() => {
    if (isFocused) shouldShowHelpMenu();
    const _isChemSys = handleChemSysCheck();
    if (
      props.onInputTypeChange &&
      inputType === MaterialsInputType.ELEMENTS &&
      _isChemSys !== undefined
    ) {
      setSelectionMode(
        _isChemSys
          ? PeriodicTableSelectionMode.CHEMICAL_SYSTEM
          : PeriodicTableSelectionMode.ELEMENTS
      );
    } else if (props.onInputTypeChange && inputType === MaterialsInputType.FORMULA) {
      setSelectionMode(PeriodicTableSelectionMode.FORMULA);
    }
  }, [inputValue, inputType]);

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
   *
   * Also handle lifting up the chemsys prop change. Doing these together ensures that the
   * deep compare effect in SearchUIContextProvider isn't triggered twice.
   */
  useEffect(() => {
    if (!error) {
      props.onChange(debouncedInputValue);
      if (props.onPropsChange) props.onPropsChange({ isChemSys: isChemSys });
    }
  }, [debouncedInputValue]);

  /**
   * Ensure the local isChemSys variable is modified if the
   * isChemsys prop changes (triggered by the onPropsChange function)
   */
  useEffect(() => {
    if (props.isChemSys !== undefined) {
      setIsChemSys(props.isChemSys);
    }
  }, [props.isChemSys]);

  /**
   * When the periodic table selection mode changes...
   * modify the chem sys flag based on the dropdown value,
   * modify the text input type,
   * parse input value into proper syntax (i.e. change or remove element delimiter).
   * Ignore this effect if the input type is not elements or formula (e.g. MPID).
   */
  useEffect(() => {
    if (
      props.onInputTypeChange &&
      (inputType === MaterialsInputType.ELEMENTS || inputType === MaterialsInputType.FORMULA)
    ) {
      let elements: string[] | null = null;

      if (inputType === MaterialsInputType.ELEMENTS) {
        elements = validateElements(inputValue);
      } else if (inputType === MaterialsInputType.FORMULA) {
        elements = validateFormula(inputValue);
      }

      if (selectionMode === PeriodicTableSelectionMode.CHEMICAL_SYSTEM) {
        setIsChemSys(true);
        setInputType(MaterialsInputType.ELEMENTS);
        if (elements && elements.length > 1) setInputValue(arrayToDelimitedString(elements, /-/));
      } else if (selectionMode === PeriodicTableSelectionMode.ELEMENTS) {
        setIsChemSys(false);
        setInputType(MaterialsInputType.ELEMENTS);
        if (elements && elements.length > 1) setInputValue(arrayToDelimitedString(elements, /,/));
      } else if (
        selectionMode === PeriodicTableSelectionMode.FORMULA &&
        inputType !== MaterialsInputType.FORMULA
      ) {
        setInputType(MaterialsInputType.FORMULA);
        if (elements && elements.length > 1) setInputValue(arrayToDelimitedString(elements, ''));
      }
    }
  }, [selectionMode]);

  /**
   * Ensure delimiter in the input value changes if the
   * chem sys dropdown is changed.
   */
  useEffect(() => {
    if (chemSysDropdownValue) {
      let newValue = '';
      let dropdownIsChemSys = chemSysDropdownValue === 'Only' ? true : false;
      if (dropdownIsChemSys) {
        newValue = inputValue.replace(/,\sand|,\s|,|\s/gi, '-');
      } else {
        newValue = inputValue.replace(/-/gi, ',');
      }
      setInputValue(newValue);
      setIsChemSys(dropdownIsChemSys);
    }
  }, [chemSysDropdownValue]);

  /**
   * Ensure chem sys dropdown value will change dynamically while typing
   * (i.e. if a new delimiter is typed in, change the dropdown value to match new delimiter)
   */
  useEffect(() => {
    if (chemSysDropdownValue) {
      setChemSysDropdownValue(
        isChemSys ? ChemSysDropdownValue.ONLY : ChemSysDropdownValue.AT_LEAST
      );
    }
  }, [isChemSys]);

  return (
    <div id={props.id} className="mpc-materials-input">
      <PeriodicContext>
        {materialsInputField}
        {/* {chemSysCheckbox} */}
        <div
          data-testid="materials-input-periodic-table"
          className={classNames('table-transition-wrapper-small can-hide-by-height', {
            'is-hidden-by-height': !showPeriodicTable,
            'mt-3': showPeriodicTable
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
            className="box"
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
  onChange: (value) => undefined
};
