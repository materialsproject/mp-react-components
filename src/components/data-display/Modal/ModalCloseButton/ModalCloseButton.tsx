import classNames from 'classnames';
import React, { ReactNode, useState } from 'react';
import './ModalCloseButton.css';

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
  /**
   * Class name applied to the modal close button.
   * The "modal-close" and "mpc-modal-close" classes are added automatically.
   */
  className?: string;
  /**
   * Function to handle closing the modal
   */
  onClick?: () => any;
}

/**
 * Render an "x" button at the top right of the modal
 */
export const ModalCloseButton: React.FC<Props> = (props) => {
  return (
    <button
      id={props.id}
      className={classNames('mpc-modal-close modal-close', props.className)}
      aria-label="close"
      onClick={props.onClick}
    ></button>
  );
};
