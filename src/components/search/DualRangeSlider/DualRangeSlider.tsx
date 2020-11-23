import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Range, getTrackBackground } from 'react-range';
import { countDecimals } from '../utils';
import './DualRangeSlider.css';
import * as d3 from 'd3';
import { initialState } from '../../crystal-toolkit/Simple3DScene/camera-reducer';

const STEPDEF = 0.1;
const MIN = -100;
const MAX = 30000;

interface Props {
  domain: number[];
  initialValues: number[];
  step: number;
  onChange?: (values: number[]) => void;
  onPropsChange?: (props: any) => void;
}

const niceInitialValues = (vals, domain, niceDomain) => {
  if (vals[0] === domain[0] && vals[1] === domain[1]) {
    return [niceDomain[0], niceDomain[1]];
  } else {
    return vals;
  }
}

export const DualRangeSlider: React.FC<Props> = ({
  domain = [0, 100],
  step = 1,
  initialValues = domain.slice(), 
  onChange = () => undefined,
  onPropsChange = () => undefined
}) => {
  const decimals = countDecimals(step);
  const tickCount = 5;
  const scale = d3.scaleLinear().domain(domain).nice(tickCount);
  const niceDomain = scale.domain();
  const ticks = scale.ticks(5);
  const [values, setValues] = useState(niceInitialValues(initialValues, domain, niceDomain));

  const handleFinalChange = (vals) => {
    if (onChange) {
      onChange(vals.map((val) => {  
        return parseFloat(val.toFixed(decimals));
      }));
    }
  }

  useEffect(() => {
    onPropsChange({domain: niceDomain, initialValues: values});
    handleFinalChange(values);
  }, []);
  
  useEffect(() => {
    setValues(niceInitialValues(initialValues, domain, niceDomain));
  }, [initialValues]);

  return (
    <div className="slider-container">
      <div className="level mb-1">
        <div className="level-left">
          <input
            className="input is-small"
            type="text"
            value={values[0]}
            // onChange={handleRawValueChange}
            // onFocus={handleFocus}
            // onBlur={handleBlur}
          />
        </div>
        <div className="level-right">
          <input
            className="input is-small"
            type="text"
            value={values[1]}
            // onChange={handleRawValueChange}
            // onFocus={handleFocus}
            // onBlur={handleBlur}
          />          
        </div>
      </div>
      <div className="slider">
        <Range
          values={values}
          step={step}
          min={niceDomain[0]}
          max={niceDomain[1]}
          onChange={(vals) => setValues(vals)}
          onFinalChange={handleFinalChange}
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