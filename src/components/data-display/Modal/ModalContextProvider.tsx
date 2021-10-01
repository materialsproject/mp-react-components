import React, { useState } from 'react';

interface ModalState {
  active: boolean;
  setActive: (value: any) => any;
}

const ModalContext = React.createContext<ModalState | undefined>(undefined);

/**
 * Use ModalContextProvider to coordinate modal trigger and modal content
 */
export function ModalContextProvider(props: any) {
  const [active, setActive] = useState(false);
  return (
    <ModalContext.Provider value={{ active, setActive }}>{props.children}</ModalContext.Provider>
  );
}

/**
 * Custom hook for consuming the ModalContext
 * Must only be used by child components of ModalContextProvider
 */
export const useModalContext = () => {
  const context = React.useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModalContext must be used within a ModalContextProvider');
  }
  return context;
};
