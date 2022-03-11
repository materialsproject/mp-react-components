import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Range, getTrackBackground } from 'react-range';
import { countDecimals, initSliderScale, initSliderTicks, pow10Fixed } from '../utils';
import '../RangeSlider/RangeSlider.css';
import * as d3 from 'd3';
import { useDebounce } from '../../../utils/hooks';
import { renderMark, renderThumb, renderTrack } from '../RangeSlider/RangeSlider';

const STEPDEF = 0.1;
const MIN = -100;
const MAX = 30000;

export interface DualRangeSliderProps {
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
   * Note that the domain bounds will be made "nice" so that
   * the slider ticks can be placed on easy-to-read numbers.
   */
  domain: number[];
  /**
   * Array with the min and max values that the slider
   * should be set to.
   */
  value?: number[];
  valueMin?: number;
  valueMax?: number;
  /**
   * Number by which the slider handles should move with each step.
   * Defaults to 1.
   */
  step: number;
  /**
   * Use a logarithmic scale for the slider.
   * Domain values will be interpreted as exponents and will be transformed to be `10^x`.
   * So a domain of `[-1, 2]` will yields a range of `[0.01, 100]`.
   * Note that when using a log scale, the `value` prop will always be the pre-transformed value.
   */
  isLogScale?: boolean;
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
  onChange?: (min: number, max: number) => void;
  /**
   * Function to call when the slider props change.
   * This can be used to lift the new "nice" domain upwards.
   */
  onPropsChange?: (props: any) => void;
}

/**
 * Ensure the slider values are valid.
 * i.e. ensure that the values are within the domain bounds
 * and that the first value is less than the second value.
 * @param vals array of slider lower and upper values e.g. [4, 27]
 * @param domain array of original slider lower and upper limits e.g. [1, 49]
 * @param niceDomain array of rounded (nice) slider lower and upper limits e.g. [0, 50]
 * @returns valid array of slider values
 */
const niceInitialValues = (vals, domain, niceDomain) => {
  if (!vals) vals = domain;
  /**
   * The lower bound will be null if initialized from a url that only has a max param.
   * The upper bound will be null if initialized from a url that only has a min param.
   * When this happens, set value to the corresponding nice domain bound.
   */
  if (vals[0] === null) vals[0] = niceDomain[0];
  if (vals[1] === null) vals[1] = niceDomain[1];

  const upperBoundIsValid =
    vals[1] <= niceDomain[1] && vals[1] >= vals[0] && vals[1] >= niceDomain[0];
  const lowerBoundIsValid =
    vals[0] >= niceDomain[0] && vals[0] <= vals[1] && vals[0] <= niceDomain[1];

  if (vals[0] === domain[0] && vals[1] === domain[1]) {
    return [niceDomain[0], niceDomain[1]];
  } else if (upperBoundIsValid && !lowerBoundIsValid) {
    return [niceDomain[0], vals[1]];
  } else if (lowerBoundIsValid && !upperBoundIsValid) {
    return [vals[0], niceDomain[1]];
  } else if (lowerBoundIsValid && upperBoundIsValid) {
    return vals;
  } else {
    return [niceDomain[0], niceDomain[1]];
  }
};

/**
 * Slider input with controls for both the minimum and maximum bounds.
 */
export const DualRangeSlider: React.FC<DualRangeSliderProps> = ({
  domain = [0, 100],
  step = 1,
  value,
  isLogScale = false,
  debounce = isLogScale ? 1000 : 500,
  ticks = 5,
  onChange = () => undefined,
  onPropsChange = () => undefined,
  ...otherProps
}) => {
  const props = {
    domain,
    step,
    value,
    isLogScale,
    debounce,
    ticks,
    onChange,
    onPropsChange,
    ...otherProps
  };
  const decimals = countDecimals(step);
  /**
   * For log sliders, the scale is 10^min to 10^max
   */
  const scale = initSliderScale(props.domain, props.isLogScale);
  /**
   * The niceDomain determines the allowable values in the slider.
   * For regular linear sliders, the domain prop is translated into "nice"
   * values (values ending in 5 or 0) that are determined when the scale is initialized.
   * For log sliders, the exact values from the domain prop are used to determine allowable
   * slider values so niceDomain is the same as props.domain.
   * Note that for log sliders, the slider values are the exponent values but the tick and
   * input values are 10^value.
   */
  const niceDomain = props.isLogScale ? props.domain : scale.domain();
  const tickMarks = initSliderTicks(props.ticks, props.domain, scale);
  // if (!props.value) props.value = []
  const [values, setValues] = useState(
    niceInitialValues([props.valueMin, props.valueMax], domain, niceDomain)
  );
  const [lowerBound, setLowerBound] = useState(
    props.isLogScale ? pow10Fixed(values[0]) : values[0]
  );
  const [upperBound, setUpperBound] = useState(
    props.isLogScale ? pow10Fixed(values[1]) : values[1]
  );
  const [lowerBoundToDebounce, setLowerBoundToDebounce] = useState(lowerBound);
  const [upperBoundToDebounce, setUpperBoundToDebounce] = useState(upperBound);
  const debouncedLowerBound = debounce
    ? useDebounce(lowerBoundToDebounce, debounce)
    : lowerBoundToDebounce;
  const debouncedUpperBound = debounce
    ? useDebounce(upperBoundToDebounce, debounce)
    : upperBoundToDebounce;

  const handleSliderFinalChange = (vals) => {
    if (props.setProps) {
      props.setProps({ value: vals });
    }
    if (onChange) {
      const min = parseFloat(vals[0].toFixed(decimals));
      const max = parseFloat(vals[1].toFixed(decimals));
      onChange(min, max);
    }
  };

  const handleSliderChange = (vals) => {
    setValues(vals);
    const newLowerInputValue = props.isLogScale ? pow10Fixed(vals[0]) : vals[0].toString();
    const newUpperInputValue = props.isLogScale ? pow10Fixed(vals[1]) : vals[1].toString();
    setLowerBound(newLowerInputValue);
    setUpperBound(newUpperInputValue);
  };

  /**
   * Set the lowerBound input value and its debounce value
   * Setting the debounce value will trigger handleSliderFinalChange
   * after the specified delay.
   * The bound values are set using the raw input strings to allow
   * users to type in negative numbers.
   */
  const handleLowerInputChange = (e) => {
    setLowerBound(e.target.value);
    setLowerBoundToDebounce(e.target.value);
  };

  /**
   * Same as above but for upperBound
   */
  const handleUpperInputChange = (e) => {
    setUpperBound(e.target.value);
    setUpperBoundToDebounce(e.target.value);
  };

  /**
   * Triggered by debouncedLowerBound effect
   * Ensures that the value in the input is valid and within
   * the set limits.
   * Handles updating values and triggering a final slider change event.
   */
  const validateDebouncedLowerBound = () => {
    const lowerBoundFloat = parseFloat(debouncedLowerBound);
    const upperBoundFloat = parseFloat(upperBound);
    let newLowerBoundValue: number = props.isLogScale
      ? parseFloat(Math.log10(lowerBoundFloat).toFixed(decimals))
      : lowerBoundFloat;
    let newUpperBoundValue: number = props.isLogScale
      ? parseFloat(Math.log10(upperBoundFloat).toFixed(decimals))
      : upperBoundFloat;
    const domainForComparison = props.isLogScale ? scale.domain() : niceDomain;

    if (lowerBoundFloat > upperBoundFloat && lowerBoundFloat <= domainForComparison[1]) {
      setUpperBound(lowerBoundFloat);
      newLowerBoundValue = props.isLogScale
        ? parseFloat(Math.log10(lowerBoundFloat).toFixed(decimals))
        : lowerBoundFloat;
      newUpperBoundValue = newLowerBoundValue;
    } else if (lowerBoundFloat < domainForComparison[0]) {
      const newInputValue = props.isLogScale ? pow10Fixed(niceDomain[0]) : niceDomain[0];
      setLowerBound(newInputValue);
      newLowerBoundValue = niceDomain[0];
      newUpperBoundValue = props.isLogScale
        ? parseFloat(Math.log10(upperBoundFloat).toFixed(decimals))
        : upperBoundFloat;
    } else if (lowerBoundFloat > domainForComparison[1]) {
      const newInputValue = props.isLogScale ? pow10Fixed(niceDomain[1]) : niceDomain[1];
      setLowerBound(newInputValue);
      setUpperBound(newInputValue);
      newLowerBoundValue = niceDomain[1];
      newUpperBoundValue = newLowerBoundValue;
    }

    if (newLowerBoundValue !== values[0] || newUpperBoundValue !== values[1]) {
      const newValues = [newLowerBoundValue, newUpperBoundValue];
      setValues(newValues);
      handleSliderFinalChange(newValues);
    }
  };

  /**
   * Same as above but for debouncedUpperBound
   */
  const validateDebouncedUpperBound = () => {
    const lowerBoundFloat = parseFloat(lowerBound);
    const upperBoundFloat = parseFloat(debouncedUpperBound);
    let newLowerBoundValue: number = props.isLogScale
      ? parseFloat(Math.log10(lowerBoundFloat).toFixed(decimals))
      : lowerBoundFloat;
    let newUpperBoundValue: number = props.isLogScale
      ? parseFloat(Math.log10(upperBoundFloat).toFixed(decimals))
      : upperBoundFloat;
    const domainForComparison = props.isLogScale ? scale.domain() : niceDomain;

    if (upperBoundFloat < lowerBoundFloat && upperBoundFloat >= domainForComparison[0]) {
      setLowerBound(upperBoundFloat);
      newLowerBoundValue = props.isLogScale
        ? parseFloat(Math.log10(upperBoundFloat).toFixed(decimals))
        : upperBoundFloat;
      newUpperBoundValue = newLowerBoundValue;
    } else if (upperBoundFloat > domainForComparison[1]) {
      const newInputValue = props.isLogScale ? pow10Fixed(niceDomain[1]) : niceDomain[1];
      setUpperBound(newInputValue);
      newLowerBoundValue = props.isLogScale
        ? parseFloat(Math.log10(lowerBoundFloat).toFixed(decimals))
        : lowerBoundFloat;
      newUpperBoundValue = niceDomain[1];
    } else if (upperBoundFloat < domainForComparison[0]) {
      const newInputValue = props.isLogScale ? pow10Fixed(niceDomain[0]) : niceDomain[0];
      setUpperBound(newInputValue);
      setLowerBound(newInputValue);
      newLowerBoundValue = niceDomain[0];
      newUpperBoundValue = newLowerBoundValue;
    }

    if (newLowerBoundValue !== values[0] || newUpperBoundValue !== values[1]) {
      const newValues = [newLowerBoundValue, newUpperBoundValue];
      setValues(newValues);
      handleSliderFinalChange(newValues);
    }
  };

  /**
   * Domain props are made "nice" (rounded bounds for nice ticks)
   * This effect lifts the prop changes up to the parent
   */
  useEffect(() => {
    onPropsChange({ domain: niceDomain, value: values });
  }, []);

  /**
   * If the value prop is changed from outside this component
   * trigger a slider change
   */
  useEffect(() => {
    handleSliderChange(niceInitialValues([props.valueMin, props.valueMax], domain, niceDomain));
  }, [props.valueMin, props.valueMax]);

  /**
   * These two effects are triggered when debouncedLowerBound and debouncedUpperBound
   * are changed (respectively).
   * This happens X milliseconds after lowerBoundToDebounce/upperBoundToDebounce is set.
   * Using a separate variable for debouncing makes it so that only text input changes
   * to the bounds will trigger the debounce effect, not regular slider changes.
   * This prevents double firing the final onChange event on slider changes.
   */
  useEffect(() => {
    validateDebouncedLowerBound();
  }, [debouncedLowerBound]);

  useEffect(() => {
    validateDebouncedUpperBound();
  }, [debouncedUpperBound]);

  return (
    <div
      id={props.id}
      className={classNames('mpc-dual-range-slider mpc-range-slider', props.className)}
      data-testid="dual-range-slider"
    >
      <div className="level is-mobile">
        <div className="level-left">
          <input
            data-testid="lower-bound-input"
            className="input is-small"
            type="number"
            value={lowerBound}
            min={scale.domain()[0]}
            max={scale.domain()[1]}
            step={step}
            onChange={handleLowerInputChange}
          />
        </div>
        <div className="level-right">
          <input
            data-testid="upper-bound-input"
            className="input is-small"
            type="number"
            value={upperBound}
            min={scale.domain()[0]}
            max={scale.domain()[1]}
            step={step}
            onChange={handleUpperInputChange}
          />
        </div>
      </div>
      <div className="slider">
        <Range
          values={values}
          step={step}
          min={niceDomain[0]}
          max={niceDomain[1]}
          onChange={handleSliderChange}
          onFinalChange={handleSliderFinalChange}
          renderTrack={renderTrack(values, niceDomain, ['#ccc', '#3273dc', '#ccc'])}
          renderThumb={renderThumb()}
          renderMark={
            tickMarks &&
            renderMark(
              props.step,
              tickMarks,
              niceDomain,
              props.isLogScale,
              props.inclusiveTickBounds
            )
          }
        />
      </div>
    </div>
  );
};
