import React, { useState } from 'react';
import { Story } from '@storybook/react';
import { Modal, ModalContextProvider, ModalTrigger } from '../../components/data-display/Modal';
import { ModalContextProviderProps } from '../../components/data-display/Modal/ModalContextProvider';
import { DrawerContextProvider } from '../../components/data-display/Drawer/DrawerContextProvider';
import { DrawerTrigger } from '../../components/data-display/Drawer/DrawerTrigger';
import { Drawer } from '../../components/data-display/Drawer';

export default {
  component: Drawer,
  title: 'Data-Display/Drawer'
};

export const Basic: Story<React.PropsWithChildren<ModalContextProviderProps>> = (args) => (
  <DrawerContextProvider>
    <DrawerTrigger forDrawerId="drawer-1">
      <button className="button">Drawer 1</button>
    </DrawerTrigger>
    <Drawer id="drawer-1">
      <h2>Drawer Content</h2>
      <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
      </ul>
    </Drawer>
  </DrawerContextProvider>
);

export const WithTwoDifferentDrawers: Story<React.PropsWithChildren<ModalContextProviderProps>> = (
  args
) => {
  return (
    <DrawerContextProvider>
      <DrawerTrigger forDrawerId="drawer-1">
        <button className="button mr-2">Drawer 1</button>
      </DrawerTrigger>
      <DrawerTrigger forDrawerId="drawer-2">
        <button className="button">Drawer 2</button>
      </DrawerTrigger>
      <Drawer id="drawer-1">
        <h2>Drawer Content</h2>
        <ul>
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
        </ul>
      </Drawer>
      <Drawer id="drawer-2">
        <h2>Another Drawer</h2>
        <p>Here is its content.</p>
      </Drawer>
    </DrawerContextProvider>
  );
};
