import React, { useState } from 'react';
import { Slider, Rail, Handles, Tracks, Ticks } from 'react-compound-slider';
import { SliderRail, Handle, Track, Tick } from './SliderComponents';

const sliderStyle = {
  position: 'relative' as 'relative',
  width: '100%'
};

const defaultValues = [10, 50];

interface SliderState {
  values: ReadonlyArray<number>;
  update: ReadonlyArray<number>;
  reversed: boolean;
}

interface Props {
  domain: number[];
  values: ReadonlyArray<number>;
  onChange?: (values: readonly number[]) => void;
}

const initialState: SliderState = {
  values: defaultValues.slice(),
  update: defaultValues.slice(),
  reversed: false
};

export const DualRangeSlider: React.FC<Props> = props => {
  const [state, setState] = useState(initialState);

  const onUpdate = (update: ReadonlyArray<number>) => {
    setState({ ...state, update });
  };

  const onChange = props.onChange
    ? props.onChange
    : (values: ReadonlyArray<number>) => {
        setState({ ...state, values });
      };

  return (
    <div style={{ height: 50, width: '100%' }}>
      <Slider
        mode={1}
        step={1}
        domain={props.domain}
        reversed={state.reversed}
        rootStyle={sliderStyle}
        onUpdate={onUpdate}
        onChange={onChange}
        values={props.values}
      >
        <Rail>{({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}</Rail>
        <Handles>
          {({ handles, getHandleProps }) => (
            <div className="slider-handles">
              {handles.map(handle => (
                <Handle
                  key={handle.id}
                  handle={handle}
                  domain={props.domain}
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
