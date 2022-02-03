import React, { useEffect, useState } from 'react';
import { Range, getTrackBackground } from 'react-range';
import classNames from 'classnames';
import './RangeSlider.css';
import { useDebounce } from '../../../utils/hooks';
import { countDecimals, validateValueInRange } from '../utils';
import * as d3 from 'd3';

export const renderTrack = (values: number[], domain: number[], colors: string[]) => {
  return ({ props, children }) => (
    <div
      onMouseDown={props.onMouseDown}
      onTouchStart={props.onTouchStart}
      className="slider-track"
      style={{ ...props.style }}
    >
      <div
        ref={props.ref}
        className="slider-track-inner"
        style={{
          background: getTrackBackground({
            values: values,
            colors: colors,
            min: domain[0],
            max: domain[1]
          })
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const renderThumb = () => {
  return ({ props, isDragged }) => (
    <div
      {...props}
      data-testid="slider-button"
      className={classNames('button', 'is-slider', { 'is-dragged': isDragged })}
    >
      <div className="inner-slider-button" />
    </div>
  );
};

export const renderMark = (
  step: number,
  tickMarks: any,
  domain: number[],
  inclusiveTickBounds?: boolean
) => {
  return ({ props, index }) => {
    /**
     * Only render the number of ticks specificed in the ticks var (currently 5).
     * Otherwise, react-range will try to render a tick at each step
     * which is way too many.
     */
    const tickValue = domain[0] + index * step;
    let showTick = false;
    if (tickMarks.length === 2) {
      showTick = tickValue === domain[0] || tickValue === domain[1];
    } else if (tickMarks.indexOf(tickValue) > -1) {
      showTick = true;
    }

    if (showTick) {
      return (
        <div key={'tick-' + index}>
          <div
            {...props}
            className="slider-tick-mark"
            style={{
              ...props.style,
              backgroundColor: '#ccc'
              // tickValue >= values[0] && tickValue <= values[1] ? '#3273dc' : '#ccc',
            }}
          />
          <span data-testid="tick-value" className="slider-tick-value" style={{ ...props.style }}>
            {tickValue}
            {inclusiveTickBounds && tickValue === tickMarks[tickMarks.length - 1] && '+'}
          </span>
        </div>
      );
    } else {
      return null;
    }
  };
};

export interface RangeSliderProps {
  /**
   * The ID used to identify this component in Dash callbacks
   */
  id?: string;
  /**
   * Dash-assigned callback that should be called whenever any of the
   * properties change
   */
  setProps?: (value: any) => any;
  /**
   * Class name(s) to append to the component's default class.
   */
  className?: string;
  /**
   * Array with the minimum and maximum possible values.
   */
  domain: number[];
  /**
   * Array with the initial min and max values that the slider
   * should be set to.
   */
  value?: number;
  /**
   * Number by which the slider handles should move with each step.
   * Defaults to 1.
   */
  step?: number;
  /**
   * Number of milliseconds that should pass between typing into the slider
   * number input and the slider handles updating.
   */
  debounce?: number;
  /**
   * Number of ticks to show on the slider scale.
   * Note that D3 will automatically convert this number to a multiple of 1, 2, 5, or 10.
   * Set to 2 to only include ticks at the min and max bounds of the scale.
   */
  ticks?: number | null;
  /**
   * Set to true to display a "+" with the upper bound tick (e.g. "100+").
   * Use this to indicate that the upper bound is inclusive (e.g. 100 or more).
   */
  inclusiveTickBounds?: boolean;
  /**
   * Function to call when slider values change.
   */
  onChange?: (values: number[]) => void;
}

/**
 * Wrapper component for react-select.
 * Automatically adds the wrapper class "react-select-container"
 * and the class prefix "react-select-" to all the elements created by react-select.
 */
export const RangeSlider: React.FC<RangeSliderProps> = ({
  domain,
  value = domain[0],
  step = 1,
  debounce = 500,
  ticks = 3,
  ...otherProps
}) => {
  const props = { domain, value, step, debounce, ticks, ...otherProps };
  const [values, setValues] = useState(() => {
    return [validateValueInRange(props.value, props.domain[0], props.domain[1])];
  });
  const [inputValue, setInputValue] = useState(values[0]);
  const [inputValueToDebounce, setInputValueToDebounce] = useState(inputValue);
  const debouncedInputValue = props.debounce
    ? useDebounce(inputValueToDebounce, props.debounce)
    : inputValue;
  const decimals = countDecimals(props.step);
  const scale = d3.scaleLinear().domain(props.domain);
  let tickMarks: number[] | undefined = undefined;

  if (props.ticks === 2) {
    tickMarks = props.domain;
  } else if (props.ticks !== null) {
    tickMarks = scale.ticks(props.ticks);
  }

  const handleSliderChange = (vals) => {
    setValues(vals);
    setInputValue(vals[0]);
  };

  const handleSliderFinalChange = (vals) => {
    if (props.setProps) {
      props.setProps({ value: vals[0] });
    }
    if (props.onChange) {
      props.onChange(
        vals.map((val) => {
          return parseFloat(val.toFixed(decimals));
        })
      );
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setInputValueToDebounce(e.target.value);
  };

  const validateDebouncedInputValue = () => {
    const newValue = validateValueInRange(parseFloat(debouncedInputValue), domain[0], domain[1]);
    if (newValue !== values[0]) {
      setValues([newValue]);
      setInputValue(newValue);
      handleSliderFinalChange([newValue]);
    }
  };

  useEffect(() => {
    validateDebouncedInputValue();
  }, [debouncedInputValue]);

  useEffect(() => {
    handleSliderChange([validateValueInRange(props.value, props.domain[0], props.domain[1])]);
  }, [props.value]);

  return (
    <div
      id={props.id}
      className={classNames('mpc-range-slider', props.className, {
        'no-ticks': !tickMarks
      })}
    >
      <input
        data-testid="lower-bound-input"
        className="input is-small"
        type="number"
        value={inputValue}
        min={props.domain[0]}
        max={props.domain[1]}
        step={props.step}
        onChange={handleInputChange}
      />
      <div className="slider">
        <Range
          values={values}
          step={props.step}
          min={props.domain[0]}
          max={props.domain[1]}
          onChange={handleSliderChange}
          onFinalChange={handleSliderFinalChange}
          renderTrack={renderTrack(values, props.domain, ['#3273dc', '#ccc'])}
          renderThumb={renderThumb()}
          renderMark={
            tickMarks && renderMark(props.step, tickMarks, props.domain, props.inclusiveTickBounds)
          }
        />
      </div>
    </div>
  );
};
