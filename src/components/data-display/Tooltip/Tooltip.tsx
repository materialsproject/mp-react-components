import classNames from 'classnames';
import React, { ReactNode } from 'react';
import ReactTooltip, { Effect, Place, Type } from 'react-tooltip';
import './Tooltip.css';

export interface TooltipProps {
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
   * The content to display inside the tooltip
   */
  children?: ReactNode;
  /**
   * Position of the tooltip. Defaults to `"top"`.
   * Place will change dynamically tooltip won't fit on screen.
   */
  place?: Place;
  /**
   * Set whether tooltip should float with mouse or stay in a solid position.
   */
  effect?: Effect;
  /**
   * Custom event to trigger tooltip
   */
  event?: string;
  /**
   * Custom event to hide tooltip (only makes effect after setting event attribute)
   */
  eventOff?: string;
  /**
   * Global event to hide tooltip (global only)
   */
  globalEventOff?: string;
  /**
   * Object with `left`, `right`, `top`, and `bottom` keys to set tooltip offsets
   */
  offset?: object;
  /**
   * Whether tooltip should render with multiple lines or not
   */
  multiline?: boolean;
  /**
   * Class name(s) to append to the component's default class (`mpc-data-block`)
   */
  className?: string;
  /**
   * Allow html inside the tooltip content
   */
  html?: boolean;
  /**
   * How long to delay the disappearance of the tooltip after leaving the trigger element
   */
  delayHide?: number;
  /**
   * How long to delay the appearance of the tooltip after hovering the trigger element
   */
  delayShow?: number;
  /**
   * Add one pixel white border
   */
  border?: boolean;
  /**
   * Disable the tooltip behaviour, default is false
   */
  disable?: boolean;
  /**
   * Hide the tooltip when scrolling, default is true
   */
  scrollHide?: boolean;
  /**
   * Enables tooltip to respond to mouse (or touch) events, default is false
   */
  clickable?: boolean;
}

/**
 * Create a tooltip that will display when hovering another element.
 * A `Tooltip` must be used in conjunction with another element that acts as the trigger.
 * The trigger element must have the `data-tip` attribute and set `data-for` to the `id` of the `Tooltip`.
 * See react-tooltip library documentation for more. https://github.com/wwayne/react-tooltip
 */
export const Tooltip: React.FC<TooltipProps> = (props) => {
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
