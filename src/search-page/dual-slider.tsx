// @flow weak
import { format } from 'd3-format';
import { interpolateReds } from 'd3-scale-chromatic';

import {
  Slider,
  Rail,
  Handles,
  Tracks,
  Ticks,
  HandlesObject,
  SliderItem
} from 'react-compound-slider';

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
//import './tooltip.css';

const sliderStyle: any = {
  position: 'relative',
  width: '100%'
};

const getGradient = (steps: number[]) => {
  const length = steps.length - 1;
  const percentStep = 100 / steps.length;

  // non block-gradient
  // return `${acc}${interpolateReds(step)} ${percentStep * idx}%${ idx < length - 1 ? ', ' : ''}`;
  return steps.slice(0, steps.length - 1).reduce((acc, step, idx) => {
    const c = interpolateReds(step);
    const next = interpolateReds(steps[idx + 1]);
    const p = percentStep * (idx + 1);
    return `${acc}${c} ${p}%, ${next} ${p}% ${idx < length - 1 ? ',' : ''}`;
  }, 'linear-gradient(to right, ');
};

//'linear-gradient(to right, green 20%, yellowgreen 20%, yellowgreen 40%, yellow 40%, yellow 60%, orange 60%, orange 80%, red 80%)';

const test = [0, 0.4, 0.12, 0.9, 0.1, 0.01, 0.08, 0.13, 0.24, 0.3, 0.35];
const gradient = getGradient(test);

export class DualSlider extends Component<any, any> {
  static defaultProps = {
    step: 1
  };
  constructor(public props: any) {
    super(props);
    const defaultValues = this.props.value;
    this.state = {
      domain: this.props.domain,
      values: defaultValues.slice(),
      update: defaultValues.slice(),
      reversed: false
    };
  }

  shouldComponentUpdate(nextProps, nextState): boolean {
    // bail out if we can
    if (
      nextProps.domain === this.props.domain &&
      nextProps.step === this.props.step &&
      nextState === this.state
    ) {
      return false;
    }
    return true;
  }

  onUpdate = update => {
    this.setState({ update });
  };

  onChange = values => {
    this.props.onChange(values);
    this.setState({ values });
  };

  setDomain = domain => {
    this.setState({ domain });
  };

  tooltipFormatter(handles: SliderItem[], value) {
    const offset = Math.abs(handles[0].percent - handles[1].percent);
    const v = format('.1f')(value);
    const v1 = format('.1f')(handles[0].value);
    const v2 = format('.1f')(handles[1].value);
    return offset < 10 ? `Value ${v1} - ${v2}` : `Value: ${v}`;
  }

  render() {
    const {
      state: { domain, values, update, reversed }
    } = this;

    return (
      <div style={{ height: 60, width: '100%' }}>
        <Slider
          mode={3}
          step={this.props.step}
          domain={domain}
          reversed={reversed}
          rootStyle={sliderStyle}
          onUpdate={this.onUpdate}
          onChange={this.onChange}
          values={values}
        >
          <Rail>
            {({ getRailProps }) => (
              <SliderRail gradient={getGradient(test)} getRailProps={getRailProps} />
            )}
          </Rail>
          <Handles>
            {({ handles, activeHandleID, getHandleProps }) => (
              <div className="slider-handles">
                {handles.map(handle => (
                  <Handle
                    key={handle.id}
                    handle={handle}
                    domain={domain}
                    tooltipFormatter={value => this.tooltipFormatter(handles, value)}
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
  }
}
// *******************************************************
// TOOLTIP RAIL
// *******************************************************
const railStyle = {
  position: 'absolute',
  width: '100%',
  transform: 'translate(0%, -50%)',
  height: 40,
  cursor: 'pointer',
  zIndex: 300
  // border: '1px solid grey',
};

const railCenterStyle: any = {
  position: 'absolute',
  width: '100%',
  transform: 'translate(0%, -50%)',
  height: 14,
  borderRadius: 7,
  cursor: 'pointer',
  pointerEvents: 'none',
  backgroundColor: 'rgb(155,155,155)'
};

export class TooltipRail extends Component<any, any> {
  state = {
    value: null,
    percent: null
  };

  onMouseEnter = () => {
    document.addEventListener('mousemove', this.onMouseMove);
  };

  onMouseLeave = () => {
    this.setState({ value: null, percent: null });
    document.removeEventListener('mousemove', this.onMouseMove);
  };

  onMouseMove = e => {
    const { activeHandleID, getEventData } = this.props;

    if (activeHandleID) {
      this.setState({ value: null, percent: null });
    } else {
      this.setState(getEventData(e));
    }
  };

  render() {
    const { value, percent } = this.state;
    const { activeHandleID, getRailProps } = this.props;

    return (
      <Fragment>
        {!activeHandleID && value ? (
          <div
            style={{
              left: `${percent}%`,
              position: 'absolute',
              marginLeft: '-11px',
              marginTop: '-35px'
            }}
          >
            <div className="tooltip">
              <span className="tooltiptext">Value: {value}</span>
            </div>
          </div>
        ) : null}
        <div
          style={railStyle}
          {...getRailProps({
            onMouseEnter: this.onMouseEnter,
            onMouseLeave: this.onMouseLeave
          })}
        />
        <div style={railCenterStyle} />
      </Fragment>
    );
  }
}

(TooltipRail as any).propTypes = {
  getEventData: PropTypes.func,
  activeHandleID: PropTypes.string,
  getRailProps: PropTypes.func.isRequired
};

(TooltipRail as any).defaultProps = {
  disabled: false
};

// *******************************************************
// SLIDER RAIL (no tooltips)
// *******************************************************
const railOuterStyle = {
  position: 'absolute',
  transform: 'translate(0%, -50%)',
  width: '100%',
  height: 42,
  borderRadius: 7,
  cursor: 'pointer'
  // border: '1px solid grey',
};

const railInnerStyle: any = {
  position: 'absolute',
  width: '100%',
  height: 14,
  transform: 'translate(0%, -50%)',
  borderRadius: 7,
  pointerEvents: 'none'
};

export function SliderRail({ getRailProps, gradient }) {
  return (
    <Fragment>
      <div style={railOuterStyle} {...getRailProps()} />
      <div style={{ ...railInnerStyle, background: gradient }} />
    </Fragment>
  );
}

SliderRail.propTypes = {
  getRailProps: PropTypes.func.isRequired
};

// *******************************************************
// HANDLE COMPONENT
// *******************************************************
export class Handle extends Component<any, any> {
  state = {
    mouseOver: false
  };

  onMouseEnter = () => {
    this.setState({ mouseOver: true });
  };

  onMouseLeave = () => {
    this.setState({ mouseOver: false });
  };

  render() {
    const {
      domain: [min, max],
      handle: { id, value, percent },
      isActive,
      disabled,
      getHandleProps,
      tooltipFormatter
    } = this.props;
    const { mouseOver } = this.state;

    return (
      <Fragment>
        {(mouseOver || isActive) && !disabled ? (
          <div
            style={
              percent < 70
                ? {
                    left: `${percent}%`,
                    position: 'absolute',
                    marginLeft: '-11px',
                    marginTop: '-35px'
                  }
                : {
                    right: `0`,
                    position: 'absolute',
                    marginLeft: '-11px',
                    marginTop: '-35px'
                  }
            }
          >
            <div className="tooltip">
              <span className="tooltiptext">{tooltipFormatter(value)}</span>
            </div>
          </div>
        ) : null}
        <div
          style={{
            left: `${percent}%`,
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
            WebkitTapHighlightColor: 'rgba(0,0,0,0)',
            zIndex: 400,
            width: 26,
            height: 42,
            cursor: 'pointer',
            // border: '1px solid grey',
            backgroundColor: 'none'
          }}
          {...getHandleProps(id, {
            onMouseEnter: this.onMouseEnter,
            onMouseLeave: this.onMouseLeave
          })}
        />
        <div
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          style={{
            left: `${percent}%`,
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
            WebkitTapHighlightColor: 'rgba(0,0,0,0)',
            zIndex: 300,
            width: 24,
            height: 24,
            border: 0,
            borderRadius: '50%',
            boxShadow: '1px 1px 1px 1px rgba(0, 0, 0, 0.2)',
            backgroundColor: disabled ? '#666' : '#8b6068'
          }}
        />
      </Fragment>
    );
  }
}

(Handle as any).propTypes = {
  domain: PropTypes.array.isRequired,
  handle: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired
  }).isRequired,
  getHandleProps: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  tooltipFormatter: PropTypes.func
};

(Handle as any).defaultProps = {
  disabled: false
};

// *******************************************************
// TRACK COMPONENT
// *******************************************************
export function Track({ source, target, getTrackProps, disabled }) {
  return (
    <div
      style={{
        position: 'absolute',
        transform: 'translate(0%, -50%)',
        height: 14,
        zIndex: 1,
        backgroundColor: disabled ? '#999' : 'rgba(120, 120, 120, 0.85)',
        borderRadius: 7,
        cursor: 'pointer',
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`
      }}
      {...getTrackProps()}
    />
  );
}

Track.propTypes = {
  source: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired
  }).isRequired,
  target: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired
  }).isRequired,
  getTrackProps: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

Track.defaultProps = {
  disabled: false
};

// *******************************************************
// TICK COMPONENT
// *******************************************************
export function Tick({ tick, count, format }) {
  return (
    <div>
      <div
        style={{
          position: 'absolute',
          marginTop: 17,
          width: 1,
          height: 5,
          backgroundColor: 'rgb(200,200,200)',
          left: `${tick.percent}%`
        }}
      />
      <div
        style={{
          position: 'absolute',
          marginTop: 25,
          fontSize: 10,
          textAlign: 'center',
          marginLeft: `${-(100 / count) / 2}%`,
          width: `${100 / count}%`,
          left: `${tick.percent}%`
        }}
      >
        {format(tick.value)}
      </div>
    </div>
  );
}

Tick.propTypes = {
  tick: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired
  }).isRequired,
  count: PropTypes.number.isRequired,
  format: PropTypes.func.isRequired
};

Tick.defaultProps = {
  format: d => d
};

//AiOutlineFullscreen
//AiOutlineFullscreenExit
