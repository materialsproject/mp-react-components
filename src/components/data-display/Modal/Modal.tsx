import classNames from 'classnames';
import React, { ReactNode, useState } from 'react';
import './Modal.css';
import { ModalCloseButton } from './ModalCloseButton';
import { useModalContext } from './ModalContextProvider';

export interface ModalProps {
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
   * The "mpc-modal" and "modal" classes are added automatically
   */
  className?: string;
}

/**
 * Render modal that can be opened by a ModalTrigger within its same ModalContextProvider
 */
export const Modal: React.FC<ModalProps> = (props) => {
  const { active, setActive, forceAction } = useModalContext();
  return (
    <div
      id={props.id}
      className={classNames('mpc-modal modal', props.className, {
        'is-active': active
      })}
    >
      <div
        className="modal-background"
        onClick={() => {
          if (forceAction) {
            return;
          } else {
            setActive(false);
          }
        }}
      ></div>
      <div className="modal-content">
        {!forceAction && <ModalCloseButton onClick={() => setActive(false)} />}
        {props.children}
      </div>
    </div>
  );
};
