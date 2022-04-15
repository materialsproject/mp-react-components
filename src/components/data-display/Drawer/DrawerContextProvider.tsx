import React, { useState, useEffect } from 'react';

interface DrawerState {
  activeDrawer: string | null;
  setActiveDrawer: (value: any) => any;
}

const DrawerContext = React.createContext<DrawerState | undefined>(undefined);

/**
 * Wrap a `DrawerTrigger` component and a `Drawer` component inside a `DrawerContextProvider` to render an element (trigger) that
 * will open up a modal. Apply props to the `DrawerContextProvider`.
 */
export const DrawerContextProvider: React.FC = (props) => {
  const [activeDrawer, setActiveDrawer] = useState(null);

  return (
    <DrawerContext.Provider value={{ activeDrawer, setActiveDrawer }}>
      {props.children}
    </DrawerContext.Provider>
  );
};

/**
 * Custom hook for consuming the DrawerContext
 * Must only be used by child components of DrawerContextProvider
 */
export const useDrawerContext = () => {
  const context = React.useContext(DrawerContext);
  if (context === undefined) {
    throw new Error('useDrawerContext must be used within a DrawerContextProvider');
  }
  return context;
};
