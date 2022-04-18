import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import classNames from 'classnames';
import './Drawer.css';
import { ModalCloseButton } from '../Modal/ModalCloseButton';
import { useDrawerContext } from './DrawerContextProvider';

export interface EnlargeableProps {
  /**
   * A unique ID to use to open and close the drawer in its DrawerContext.
   * Also used to identify this component in Dash callbacks.
   */
  id: string;
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
  const { activeDrawer, setActiveDrawer } = useDrawerContext();

  return (
    <div
      id={props.id}
      className={classNames('mpc-drawer', props.className, {
        'is-active': activeDrawer === props.id
      })}
    >
      <ModalCloseButton onClick={() => setActiveDrawer(null)} />
      {props.children}
    </div>
  );
};
