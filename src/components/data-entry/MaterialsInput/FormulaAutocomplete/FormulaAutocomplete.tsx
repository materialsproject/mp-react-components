import axios from 'axios';
import classNames from 'classnames';
import React, { useState, useRef, useEffect } from 'react';
import { formatFormula } from '../../utils';
import { MaterialsInputType } from '../MaterialsInput';

interface FormulaSuggestion {
  formula_pretty: string;
}

interface Props {
  value: string;
  apiEndpoint: string;
  apiKey?: string;
  show?: boolean;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
  setError?: (value: string) => void;
}

let requestCount = 0;

/**
 *
 */
export const FormulaAutocomplete: React.FC<any> = (props) => {
  const [show, setShow] = useState(props.show);
  const [formulaSuggestions, setFormulaSuggestions] = useState<FormulaSuggestion[]>([]);

  /**
   * When the input value or type changes...
   * dynamically modify the chem sys flag,
   * change the periodic table selection mode dropdown value based on the input type,
   * fetch formula suggestions if input is a formula and the necessary props are supplied
   */
  useEffect(() => {
    if (props.value.length && props.value.indexOf('*') === -1) {
      requestCount++;
      const requestIndex = requestCount;
      axios
        .get(props.apiEndpoint, {
          params: { formula: props.value },
          headers: props.apiKey ? { 'X-Api-Key': props.apiKey } : null
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
  }, [props.value]);

  /**
   * Modify visibility of autocomplete when show prop is changed from
   * outside the component (e.g. from MaterialsInputBox),
   * but never show the autocomplete if there are zero suggestions.
   */
  useEffect(() => {
    if (formulaSuggestions.length === 0) {
      setShow(false);
    } else {
      setShow(props.show);
    }
  }, [props.show, formulaSuggestions]);

  return (
    <div
      data-testid="materials-input-autocomplete-menu"
      className={classNames('dropdown-menu', 'autocomplete', {
        'is-hidden': !show
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
              setShow(false);
              props.setError(null);
              props.onChange(d.formula_pretty);
              if (props.onSubmit) {
                props.onSubmit(e, d.formula_pretty);
              }
            }}
          >
            {formatFormula(d.formula_pretty)}
          </a>
        ))}
      </div>
    </div>
  );
};
