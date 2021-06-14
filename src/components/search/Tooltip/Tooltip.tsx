import React, { useState } from 'react';
import { default as ReactSelect } from 'react-select';
import './Select.css';
import classNames from 'classnames';
import ReactTooltip, { Effect, Place, Type } from 'react-tooltip';

/**
 * Wrapper component for react-select
 * Automatically adds the wrapper class "react-select-container"
 * and the class prefix "react-select-" to all the elements created by react-select
 */

interface Props {
  /**
   * The ID used to identify this component in Dash callbacks
   */
  [id: string]: any;

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
  return <ReactTooltip {...props} />;
};
