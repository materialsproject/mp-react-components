import * as React from 'react';
import { GetRailProps, GetTrackProps, SliderItem } from 'react-compound-slider';

// *******************************************************
// RAIL
// *******************************************************
const railOuterStyle = {
  position: 'absolute' as 'absolute',
  width: '100%',
  transform: 'translate(0%, -50%)',
  cursor: 'pointer'
};

const railInnerStyle = {
  position: 'absolute' as 'absolute',
  width: '100%',
  transform: 'translate(0%, -50%)',
  pointerEvents: 'none' as 'none',
};

interface SliderRailProps {
  getRailProps: GetRailProps;
}

export const SliderRail: React.FC<SliderRailProps> = ({ getRailProps }) => {
  return (
    <>
      <div className="outer-rail" style={railOuterStyle} {...getRailProps()} />
      <div className="inner-rail" style={railInnerStyle} />
    </>
  );
};

// *******************************************************
// HANDLE COMPONENT
// *******************************************************
type OtherProps = { [key: string]: any };

interface HandleEventHandlers {
  onKeyDown?: (event: React.KeyboardEvent) => void;
  onMouseDown?: (event: React.MouseEvent) => void;
  onTouchStart?: (event: React.TouchEvent) => void;
}

type GetHandleProps = (
  id: string,
  props?: HandleEventHandlers & OtherProps
) => HandleEventHandlers & OtherProps;

interface HandleProps {
  isActive: boolean;
  domain: number[];
  handle: SliderItem;
  getHandleProps: GetHandleProps;
  disabled?: boolean;
}

export class Handle extends React.Component<HandleProps> {
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
      getHandleProps
    } = this.props;
    const { mouseOver } = this.state;

    return (
      <React.Fragment>
        {(mouseOver || isActive) && !disabled ? (
          <div
            className="tooltip"
            style={{
              left: `${percent}%`,
              position: 'absolute',
              transform: 'translate(-50%, 0)',
              marginTop: '-45px'
            }}
          >
            <div>
              <span>{value}</span>
            </div>
          </div>
        ) : null}
        <div
          className="handle-cover"
          style={{
            left: `${percent}%`,
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
            WebkitTapHighlightColor: 'rgba(0,0,0,0)',
            cursor: 'pointer',
            backgroundColor: 'none'
          }}
          {...getHandleProps(id, {
            onMouseEnter: this.onMouseEnter,
            onMouseLeave: this.onMouseLeave
          })}
        />
        <div
          className={`handle${disabled ? ' disabled' : ''}`}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          style={{
            left: `${percent}%`,
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
            WebkitTapHighlightColor: 'rgba(0,0,0,0)',
          }}
        />
      </React.Fragment>
    );
  }
}

// *******************************************************
// KEYBOARD HANDLE COMPONENT
// Uses a button to allow keyboard events
// *******************************************************
export const KeyboardHandle: React.FC<HandleProps> = ({
  domain: [min, max],
  handle: { id, value, percent },
  disabled = false,
  getHandleProps
}) => {
  return (
    <button
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      style={{
        left: `${percent}%`,
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        zIndex: 2,
        width: 24,
        height: 24,
        borderRadius: '50%',
        boxShadow: '1px 1px 1px 1px rgba(0, 0, 0, 0.3)',
        backgroundColor: disabled ? '#666' : '#9BBFD4'
      }}
      {...getHandleProps(id)}
    />
  );
};

// *******************************************************
// TRACK COMPONENT
// *******************************************************
interface TrackProps {
  source: SliderItem;
  target: SliderItem;
  getTrackProps: GetTrackProps;
  disabled?: boolean;
}

export const Track: React.FC<TrackProps> = ({
  source,
  target,
  getTrackProps,
  disabled = false
}) => {
  return (
    <div
      className={`track${disabled ? ' disabled' : ''}`}
      style={{
        position: 'absolute',
        transform: 'translate(0%, -50%)',
        zIndex: 1,
        cursor: 'pointer',
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`
      }}
      {...getTrackProps()}
    />
  );
};

// *******************************************************
// TICK COMPONENT
// *******************************************************
interface TickProps {
  tick: SliderItem;
  count: number;
  format?: (val: number) => string;
}

export const Tick: React.FC<TickProps> = ({ tick, count, format = d => d }) => {
  return (
    <div>
      <div
        style={{
          position: 'absolute',
          marginTop: 14,
          width: 1,
          height: 5,
          backgroundColor: 'rgb(200,200,200)',
          left: `${tick.percent}%`
        }}
      />
      <div
        style={{
          position: 'absolute',
          marginTop: 22,
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
};
