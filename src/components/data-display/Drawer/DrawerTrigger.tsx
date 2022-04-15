import classNames from 'classnames';
import React, { ReactNode, useState } from 'react';
import { useDrawerContext } from './DrawerContextProvider';

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
   * Class name applied to the drawer trigger span.
   * The "mpc-drawer-trigger" class is added automatically
   */
  className?: string;

  for: string;
}

/**
 * Render a trigger that opens a ModalContent that is within the same ModalContextProvider
 */
export const DrawerTrigger: React.FC<Props> = (props) => {
  const { activeDrawer, setActiveDrawer } = useDrawerContext();

  return (
    <span
      id={props.id}
      className={classNames('mpc-drawer-trigger', props.className)}
      onClick={() => {
        if (activeDrawer === props.for) {
          setActiveDrawer(null);
        } else {
          setActiveDrawer(props.for);
        }
      }}
    >
      {props.children}
    </span>
  );
};
