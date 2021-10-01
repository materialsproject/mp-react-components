import classNames from 'classnames';
import React, { ReactNode, useState } from 'react';
import './Modal.css';
import { useModalContext } from './ModalContextProvider';

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
   * Class name applied to modal content div.
   * The "mpc-modal-content" and "modal" classes are added automatically
   */
  className?: string;

  /**
   * Element to be used to open the modal.
   * Can also be supplied as the first of two children (necessary in Dash).
   */
  trigger?: ReactNode;

  /**
   * Element to render inside the modal-content div.
   * Can also be supplied as the second of two children (necessary in Dash).
   */
  modalContent?: ReactNode;
}

/**
 * Render modal that can be opened by a ModalTrigger within its same ModalContextProvider
 */
export const Modal: React.FC<Props> = (props) => {
  const { active, setActive } = useModalContext();
  return (
    <div
      id={props.id}
      className={classNames('mpc-modal modal', props.className, {
        'is-active': active
      })}
    >
      <div className="modal-background" onClick={() => setActive(false)}></div>
      <div className="modal-content">{props.children}</div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={() => setActive(false)}
      ></button>
    </div>
  );
};
