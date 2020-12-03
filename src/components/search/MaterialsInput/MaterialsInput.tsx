import React, { useState, useRef, useEffect } from 'react';
import { useElements } from '../../periodic-table/periodic-table-state/table-store';
import { TABLE_DICO_V2 } from '../../periodic-table/periodic-table-data/table-v2';
import {
  getDelimiter,
  elementsArrayToElementState,
  formulaStringToArrays,
  getTruthyKeys,
  arrayToDelimitedString
} from '../../search/utils';
import { Form, Button } from 'react-bulma-components';
const { Input, Field, Control } = Form;
import { FaBalanceScale, FaBandAid, FaBlender, FaCaretDown, FaCaretUp, FaTimes } from 'react-icons/fa';
import { PeriodicContext } from '../../periodic-table/periodic-table-state/periodic-selection-context';
import { MaterialsInputBox } from './MaterialsInputBox';
import { TableLayout } from '../../periodic-table/periodic-table-component/periodic-table.component';
import { SelectableTable } from '../../periodic-table/table-state';
import classNames from 'classnames';
import { usePrevious } from '../../../utils/hooks';
import axios from 'axios';

/**
 * An input field component for searching by mp-id, elements, or formula.
 * Renders a text input and a periodic table within a PeriodicContext to support
 * two-way binding between the input and periodic table.
 * i.e. when elements are typed into the field, they are selected in the table,
 * and when elements are selected in the table, they are appended to the field's input.
 */

/**
 * Search types supported by this field
 * Displayed to users in the dropdown
 */
export enum MaterialsInputField {
  ELEMENTS = 'elements',
  FORMULA = 'formula',
  MP_ID = 'task_ids',
  SMILES = 'smiles'
}

export interface MaterialsInputBoxProps {
  value: string;
  parsedValue: string | string[];
  field: string;
  debounce?: number;
  showFieldDropdown?: boolean;
  isChemSys?: boolean;
  allowSmiles?: boolean;
  liftInputRef?: (value: React.RefObject<HTMLInputElement>) => any;
  onChange: (value: string) => void;
  onPropsChange?: (propsObject: any) => void;
  onFieldChange?: (value: string) => void;
  onSubmit?: (value?: any) => any;
  onFocus?: (value?: any) => any;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => any;
  setImmediateInputValue?: React.Dispatch<React.SetStateAction<string>>;
}

interface MaterialsInputProps extends MaterialsInputBoxProps {
  periodicTableMode?: string;
  hidePeriodicTable?: boolean;
  autocompleteFormulaUrl?:string;
  autocompleteApiKey?: string;
}

interface FormulaSuggestion {
  _id: string;
  score: number;
}

let requestCount = 0;

export const MaterialsInput: React.FC<MaterialsInputProps> = props => {
  const [inputRef, setInputRef] = useState<React.RefObject<HTMLInputElement>>();
  const [immediateInputValue, setImmediateInputValue] = useState(props.value);
  const [isChemSys, setIsChemSys] = useState<boolean>(() => props.isChemSys ? props.isChemSys : false);
  // const prevChemSys = usePrevious(isChemSys);
  const [showPeriodicTable, setShowPeriodicTable] = useState(() =>
    props.periodicTableMode === 'toggle' && !props.hidePeriodicTable ? true : false
  );
  const [showAutocomplete, setShowAutocomplete] = useState(true);
  const [formulaSuggestions, setFormulaSuggestions] = useState<FormulaSuggestion[]>([]);

  const shouldShowAutocomplete = () => {
    if(formulaSuggestions.length > 0) {
      return setShowAutocomplete(true);
    } else {
      return setShowAutocomplete(false);
    }
  }
  const getOnFocusProp = () => {
    shouldShowAutocomplete();
    if (props.periodicTableMode === 'onFocus') {
      return setShowPeriodicTable(true);
    } else {
      return;
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
    if (!relatedTarget || relatedTarget.className.indexOf('mat-element') === -1 ) {
      setShowAutocomplete(false);
      if (props.periodicTableMode === 'onFocus') {
        return setShowPeriodicTable(false);
      }
    } else {
      e.target.focus();
    }
  };

  const handleSubmit = (e) => {
    if (props.onSubmit) {
      e.preventDefault();
      e.stopPropagation();
      setShowPeriodicTable(false);
      props.onSubmit();
    }
  };

  const handleChemSysCheck = () => {
    let newIsChemSys = isChemSys;
    if (props.value.match(/-/gi) || (props.value.length < 3 && !props.value.match(/,|\s/gi))) {
      newIsChemSys = true;
    } else if(props.value.match(/,|\s/gi)) {
      newIsChemSys = false;
    }
    if (props.onPropsChange) props.onPropsChange({isChemSys: newIsChemSys});
    setIsChemSys(newIsChemSys);
  };

  /**
   * This effect triggers when the input value changes
   * It handles modifying the chemsys flag (checked when input is dash-delimited or one element)
   * It also handles fetching formula suggestions if the necessary props are supplied
   */
  
  useEffect(() => {
    handleChemSysCheck();
    console.log(props.value);
    if (
      props.field === 'formula' &&
      props.autocompleteApiKey &&
      props.autocompleteFormulaUrl && 
      props.value.length
    ) {
      requestCount++;
      const requestIndex = requestCount;
      axios.get(props.autocompleteFormulaUrl, {
        params: {text: props.value},
        headers: {'X-Api-Key': props.autocompleteApiKey}
      }).then(result => {
        console.log(result.data.data);
        if (requestIndex === requestCount) {
          setFormulaSuggestions(result.data.data);
          console.log('in order: ' + props.value);
          console.log('index: ' + requestIndex);
          console.log('count: ' + requestCount);
        } else {
          console.log('out of order: ' + props.value);
        }
      }).catch(error => {
        console.log(error);
        if (requestIndex === requestCount) {
          setFormulaSuggestions([]);
        }
      });
    } else {
      setFormulaSuggestions([]);
    }
  }, [props.value]);

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

  const materialsInputControl = 
    <MaterialsInputBox
      value={props.value}
      parsedValue={props.parsedValue}
      field={props.field}
      debounce={props.debounce}
      isChemSys={props.isChemSys}
      allowSmiles={props.allowSmiles}
      onChange={props.onChange}
      onFieldChange={props.onFieldChange}
      onSubmit={props.onSubmit ? handleSubmit : undefined}
      onFocus={getOnFocusProp}
      onBlur={getOnBlurProp}
      liftInputRef={ref => setInputRef(ref)}
      showFieldDropdown={props.showFieldDropdown}
      setImmediateInputValue={setImmediateInputValue}
    />;

  let materialsInputField: JSX.Element | null = null; 
  let chemSysCheckbox: JSX.Element | null = null;
  const hasChemSysCheckbox = props.field === 'elements' && !props.onSubmit;
  let autocompleteMenu: JSX.Element | null = null;
  const hasAutocompleteMenu = props.field === 'formula' && props.autocompleteFormulaUrl && props.autocompleteApiKey;

  if (props.onSubmit) {
    materialsInputField =
      <form onSubmit={handleSubmit}>
        <Field className="has-addons">
          <Control>
            <button
              type="button"
              className="button has-oversized-icon is-size-2"
              onClick={() => setShowPeriodicTable(!showPeriodicTable)}
            >
                <i
                  className={classNames(
                    'icon-fontastic-periodic-table-squares',
                    {'is-active': showPeriodicTable}
                  )}
                />
            </button>            
          </Control>
          {materialsInputControl}
          <Control>
            <Button color="primary" type="submit">
              Search
            </Button>
          </Control>
        </Field>
      </form>;
  } else {
    materialsInputField =
      <Field className="has-addons">
        {materialsInputControl}
      </Field>;
  }

  if (hasChemSysCheckbox) {
    chemSysCheckbox = 
      <label className="checkbox is-block">
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
            if (props.onPropsChange) props.onPropsChange({isChemSys: e.target.checked});
            props.onChange(newValue);
          }}
        />
        <span>Contains no other elements</span>
      </label>
  }

  if (hasAutocompleteMenu) {
    autocompleteMenu =
      <div
        className={classNames('dropdown-menu', 'autocomplete-right', {
          'is-hidden': !showAutocomplete
        })}
        /**
         * Currently not accessible by keyboard so hiding it to screen readers
         */
        aria-hidden={true}
      >
        <div className="dropdown-content">
          <p className="autocomplete-label">Suggested formulas</p>
          {formulaSuggestions.map((d, i) => (
            <a 
              key={i} 
              className="dropdown-item"
              onMouseDown={() => props.onChange(d._id)}
            >
              {d._id}
            </a>
          ))}
        </div>
      </div>;
  }

  return (
    <div className="materials-input">
      <PeriodicContext>
        {materialsInputField}
        {chemSysCheckbox}
        {autocompleteMenu}
        <div
          className={classNames('table-transition-wrapper-small','can-hide-by-height', {
            'is-hidden-by-height': !showPeriodicTable,
            'mt-3': showPeriodicTable
          })}
          onMouseDown={event => {
            if (inputRef && inputRef.current) inputRef.current.focus();
          }}
        >
          <SelectableTable
            maxElementSelectable={20}
            forceTableLayout={TableLayout.MINI}
            hiddenElements={[]}
            onStateChange={enabledElements => {
              Object.keys(enabledElements).filter(el => enabledElements[el]);
            }}
          />
        </div>
      </PeriodicContext>
    </div>
  );
};
