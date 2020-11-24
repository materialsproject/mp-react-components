import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Range, getTrackBackground } from 'react-range';
import { countDecimals } from '../utils';
import './DualRangeSlider.css';
import * as d3 from 'd3';
import { initialState } from '../../crystal-toolkit/Simple3DScene/camera-reducer';
import { useDebounce } from '../../../utils/hooks';

const STEPDEF = 0.1;
const MIN = -100;
const MAX = 30000;

interface Props {
  domain: number[];
  initialValues: number[];
  step: number;
  debounce?: number;
  onChange?: (values: number[]) => void;
  onPropsChange?: (props: any) => void;
}

const niceInitialValues = (vals, domain, niceDomain) => {
  const upperBoundIsValid = vals[1] <= niceDomain[1] && vals[1] >= vals[0] && vals[1] >= niceDomain[0];
  const lowerBoundIsValid = vals[0] >= niceDomain[0] && vals[0] <= vals[1] && vals[0] <= niceDomain[1];
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
}

export const DualRangeSlider: React.FC<Props> = ({
  domain = [0, 100],
  step = 1,
  initialValues = domain.slice(),
  debounce = 1000,
  onChange = () => undefined,
  onPropsChange = () => undefined
}) => {
  const decimals = countDecimals(step);
  const tickCount = 5;
  const scale = d3.scaleLinear().domain(domain).nice(tickCount);
  const niceDomain = scale.domain();
  const ticks = scale.ticks(5);
  const [values, setValues] = useState(niceInitialValues(initialValues, domain, niceDomain));
  const [lowerBound, setLowerBound] = useState(values[0]);
  const [upperBound, setUpperBound] = useState(values[1]);
  const [lowerBoundToDebounce, setLowerBoundToDebounce] = useState(lowerBound);
  const [upperBoundToDebounce, setUpperBoundToDebounce] = useState(upperBound);
  const debouncedLowerBound = useDebounce(lowerBoundToDebounce, debounce);
  const debouncedUpperBound = useDebounce(upperBoundToDebounce, debounce);

  const handleSliderFinalChange = (vals) => {
    if (onChange) {
      onChange(vals.map((val) => {  
        return parseFloat(val.toFixed(decimals));
      }));
    }
  };

  const handleSliderChange = (vals) => {
    setValues(vals);
    setLowerBound(vals[0]);
    setUpperBound(vals[1]);
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
    let newValues = [lowerBoundFloat, upperBoundFloat];
    if (lowerBoundFloat > upperBoundFloat) {
      setUpperBound(lowerBoundFloat);
      newValues = [lowerBoundFloat, lowerBoundFloat];
    } else if (lowerBoundFloat < niceDomain[0]) {
      setLowerBound(niceDomain[0]);
      newValues = [niceDomain[0], upperBoundFloat];
    } else if (lowerBoundFloat > niceDomain[1]) {
      setLowerBound(niceDomain[1]);
      newValues = [niceDomain[1], niceDomain[1]];
    }

    if (newValues[0] !== values[0] || newValues[1] !== values[1]) {
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
    let newValues = [lowerBoundFloat, upperBoundFloat];
    if (upperBoundFloat < lowerBoundFloat) {
      setLowerBound(upperBoundFloat);
      newValues = [upperBoundFloat, upperBoundFloat];
    } else if (upperBoundFloat > niceDomain[1]) {
      setUpperBound(niceDomain[1]);
      newValues = [lowerBoundFloat, niceDomain[1]];
    } else if (upperBoundFloat < niceDomain[0]) {
      setUpperBound(niceDomain[0]);
      newValues = [niceDomain[0], niceDomain[0]];
    }

    if (newValues[0] !== values[0] || newValues[1] !== values[1]) {
      setValues(newValues);
      handleSliderFinalChange(newValues);
    }
  };

  /**
   * Domain props are made "nice" (rounded bounds for nice ticks)
   * This effect lifts the prop changes up to the parent
   */
  useEffect(() => {
    onPropsChange({domain: niceDomain, initialValues: values});
  }, []);
  
  /**
   * If the initialValues prop is changed from outside this component
   * trigger a slider change
   */
  useEffect(() => {
    handleSliderChange(niceInitialValues(initialValues, domain, niceDomain))
  }, [initialValues]);

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
    validateDebouncedUpperBound()
  }, [debouncedUpperBound]);

  return (
    <div className="slider-container">
      <div className="level mb-1">
        <div className="level-left">
          <input
            className="input is-small"
            type="number"
            value={lowerBound}
            min={niceDomain[0]}
            max={niceDomain[1]}
            step={step}
            onChange={handleLowerInputChange}
          />
        </div>
        <div className="level-right">
          <input
            className="input is-small"
            type="number"
            value={upperBound}
            min={niceDomain[0]}
            max={niceDomain[1]}
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
          renderTrack={({ props, children }) => (
            <div
              onMouseDown={props.onMouseDown}
              onTouchStart={props.onTouchStart}
              className="slider-track"
              style={{...props.style}}
            >
              <div
                ref={props.ref}
                className="slider-track-inner"
                style={{
                  background: getTrackBackground({
                    values: values,
                    colors: ['#ccc', '#3273dc', '#ccc'],
                    min: niceDomain[0],
                    max: niceDomain[1]
                  }),
                }}
              >
                {children}
              </div>
            </div>
          )}
          renderThumb={({ props, isDragged }) => (
            <div
              {...props}
              className={classNames('button', 'is-slider', {'is-dragged': isDragged})}
            >
              <div className="inner-slider-button"/>
            </div>
          )}
          renderMark={({ props, index }) => {
            const tickValue = niceDomain[0] + (index * step);
            if (ticks.indexOf(tickValue) > -1) {
              return (
                <div key={index + Math.random()}>
                  <div
                    {...props}
                    className="slider-tick-mark"
                    style={{
                      ...props.style,
                      backgroundColor: tickValue >= values[0] && tickValue <= values[1] ? '#3273dc' : '#ccc'
                    }}
                  />
                  <span
                    className="slider-tick-value"
                    style={{...props.style}}
                  >
                    {tickValue}
                  </span>
                </div>
              );
            } else {
              return null;
            } 
          }}
        />
      </div>
    </div>
  );
};