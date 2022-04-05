import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import classNames from 'classnames';
import './Drawer.css';
import { useModalContext } from '../Modal/ModalContextProvider';
import { ModalCloseButton } from '../Modal/ModalCloseButton';

export interface EnlargeableProps {
  /**
   * The ID used to identify this component in Dash callbacks.
   */
  id?: string;
  /**
   * Dash-assigned callback that should be called to report property changes
   * to Dash, to make them available for callbacks.
   */
  setProps?: (value: any) => any;
  /**
   * Additional class to apply to drawer
   */
  className?: string;
}

/**
 * Render right side drawer that can be opened by a ModalTrigger within a ModalContextProvider with the isDrawer prop.
 */
export const Drawer: React.FC<EnlargeableProps> = (props) => {
  const { active, setActive } = useModalContext();

  return (
    <div
      id={props.id}
      className={classNames('mpc-drawer', props.className, {
        'is-active': active
      })}
    >
      <ModalCloseButton onClick={() => setActive(false)} />
      {props.children}
    </div>
  );
};
