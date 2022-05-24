import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import classNames from 'classnames';
import './Drawer.css';
import { ModalCloseButton } from '../Modal/ModalCloseButton';
import { useDrawerContext } from './DrawerContextProvider';

export interface EnlargeableProps {
  /**
   * A unique ID to use to open and close the drawer in its `DrawerContextProvider`.
   * This id should be passed to the `forDrawerId` prop in a `DrawerTrigger`
   * that sits inside the same `DrawerContextProvider`.
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
 * Render a right-side drawer that can be opened and closed.
 * A `Drawer` must be used inside of a `DrawerContextProvider` and must have a
 * corresponding `DrawerTrigger` within the same context.
 * The `id` of a drawer should be passed to the `forDrawerId` prop of a `DrawerTrigger` to open/close the drawer.
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
