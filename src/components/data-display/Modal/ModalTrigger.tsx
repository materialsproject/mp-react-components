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
}

/**
 * Render a trigger that opens a ModalContent that is within the same ModalContextProvider
 */
export const ModalTrigger: React.FC<Props> = (props) => {
  const { active, setActive } = useModalContext();
  return (
    <span
      id={props.id}
      className={classNames('mpc-modal-trigger', props.className)}
      onClick={() => setActive(true)}
    >
      {props.children}
    </span>
  );
};
