import React, { useState } from 'react';
import { Slider, Rail, Handles, Tracks, Ticks } from 'react-compound-slider';
import { SliderRail, Handle, Track, Tick, KeyboardHandle } from './SliderComponents';
import './DualRangeSlider.css';
import { countDecimals } from '../utils';

const sliderStyle = {
  position: 'relative' as 'relative',
  width: '100%'
};

interface Props {
  domain: number[];
  values: ReadonlyArray<number>;
  step: number;
  onChange?: (values: readonly number[]) => void;
}

export const DualRangeSlider: React.FC<Props> = ({ 
  domain = [0, 100],
  step = 1,
  values = domain.slice(), 
  onChange = undefined 
}) => {
  const [reversed, setReversed] = useState(false);
  const [update, setUpdate] = useState<ReadonlyArray<number>>(values.slice());
  const decimals = countDecimals(step);

  const handleChange = (vals) => {
    if (onChange) {
      onChange(vals.map((val) => {  
        return parseFloat(val.toFixed(decimals));
      }));
    }
  }

  return (
    <div 
      className="slider"
      style={{ height: 50, width: '100%' }}
    >
      <Slider
        mode={3}
        step={step}
        domain={domain}
        reversed={reversed}
        rootStyle={sliderStyle}
        onUpdate={(value: ReadonlyArray<number>) => setUpdate(values.map((val) => {  
          return parseFloat(val.toFixed(decimals));
        }))}
        onChange={handleChange}
        values={values}
      >
        <Rail>{({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}</Rail>
        <Handles>
          {({ handles, activeHandleID, getHandleProps }) => (
            <div className="slider-handles">
              {handles.map(handle => (
                <Handle
                  key={handle.id}
                  handle={handle}
                  domain={domain}
                  decimals={decimals}
                  isActive={handle.id === activeHandleID}
                  getHandleProps={getHandleProps}
                />
              ))}
            </div>
          )}
        </Handles>
        <Tracks left={false} right={false}>
          {({ tracks, getTrackProps }) => (
            <div className="slider-tracks">
              {tracks.map(({ id, source, target }) => (
                <Track key={id} source={source} target={target} getTrackProps={getTrackProps} />
              ))}
            </div>
          )}
        </Tracks>
        <Ticks count={10}>
          {({ ticks }) => (
            <div className="slider-ticks">
              {ticks.map(tick => (
                <Tick key={tick.id} tick={tick} count={ticks.length} />
              ))}
            </div>
          )}
        </Ticks>
      </Slider>
    </div>
  );
};
