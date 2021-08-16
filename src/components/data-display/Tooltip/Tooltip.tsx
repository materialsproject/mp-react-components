import classNames from 'classnames';
import React from 'react';
import ReactTooltip, { Effect, Place, Type } from 'react-tooltip';
import './Tooltip.css';

/**
 * Wrapper component for react-tooltip
 */

interface Props {
  /**
   * The ID used to identify this component in Dash callbacks
   */
  id?: string;

  /**
   * Dash-assigned callback that should be called whenever any of the
   * properties change
   */
  setProps?: (value: any) => any;

  place?: Place;

  type?: Type;

  effect?: Effect;

  event?: string;

  eventOff?: string;

  globalEventOff?: string;

  isCapture?: boolean;

  offset?: object;

  multiline?: boolean;

  className?: string;

  html?: boolean;

  delayHide?: number;

  delayShow?: number;

  delayUpdate?: number;

  border?: boolean;

  disable?: boolean;

  scrollHide?: boolean;

  clickable?: boolean;
}

export const Tooltip: React.FC<Props> = (props) => {
  const { children, className, ...otherProps } = props;
  return (
    <ReactTooltip className={classNames('mpc-tooltip', className)} {...otherProps}>
      {props.multiline ? (
        <div style={{ maxWidth: '200px', whiteSpace: 'normal' }}>{children}</div>
      ) : (
        { children }
      )}
    </ReactTooltip>
  );
};

Tooltip.defaultProps = {
  effect: 'solid',
  delayShow: 350,
  multiline: true
};
