import classNames from 'classnames';
import React, { useState, useEffect, useRef, createContext, useContext, EventHandler } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

interface Props {
  className?: string;
  showBadge?: boolean;
  showNumber?: boolean;
  badgeNumber?: string;
}

export const Bell: React.FC<Props> = (props) => {
  if (props.showBadge) {
    if (props.showNumber) {
      return (
        <span className="fa-stack bell-icon">
          <span className="fa-stack-2x has-badge-number" data-count={props.badgeNumber}>
            <i className={classNames('fa fa-bell fa-stack-1x fa-inverse', props.className)}></i>
          </span>
        </span>
      );
    } else {
      return (
        /* dummy number 0 with the same color as the background */
        <span className="fa-stack bell-icon">
          <span className="fa-stack-2x has-badge" data-count="0">
            <i className={classNames('fa fa-bell fa-stack-1x fa-inverse', props.className)}></i>
          </span>
        </span>
      );
    }
  } else {
    /* 2 times the regular size of the icon, for consistency with the stacked icons  */
    return (
      <span className="fa-stack bell-icon">
        <i className={classNames('fa fa-bell fa-stack-2x fa-inverse', props.className)}></i>
      </span>
    );
  }
};
