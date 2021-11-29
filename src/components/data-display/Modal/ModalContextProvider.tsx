import React, { useState, useEffect } from 'react';

interface ModalState {
  active: boolean;
  setActive: (value: any) => any;
  forceAction: boolean;
  setForceAction: (value: any) => any;
}

export interface ModalContextProviderProps {
  /**
   * Dash-assigned callback that should be called whenever any of the
   * properties change
   */
  setProps?: (value: any) => any;

  /**
   * The current or default state of the modal. If true, the "is-active" class is added to <Modal/>.
   * This value can be watched and changed from outside the component (e.g. via dash callback).
   */
  active?: boolean;

  /**
   * Prevent modal from being closed without completion of a specific action.
   * If set, there must be a button within the modal that updates the "active"
   * state using the ModalContext or a dash callback on the active prop.
   */
  forceAction?: boolean;
}

const ModalContext = React.createContext<ModalState | undefined>(undefined);

/**
 * Wrap a `ModalTrigger` component and a `Modal` component inside a `ModalContextProvider` to render an element (trigger) that
 * will open up a modal. Apply props to the `ModalContextProvider`.
 */
export const ModalContextProvider: React.FC<ModalContextProviderProps> = (props) => {
  const [active, setActive] = useState(() => props.active || false);
  const [forceAction, setForceAction] = useState(() => props.forceAction || false);

  /**
   * Dynamically update the isActive prop so that the
   * active tab index can be accessed via dash callbacks.
   *
   * Prevent document scrolling when active
   */
  useEffect(() => {
    if (active) {
      document.documentElement.classList.add('is-clipped');
    } else {
      document.documentElement.classList.remove('is-clipped');
    }
    props.setProps!({ active: active });
  }, [active]);

  /**
   * Allow changes to active state from outside the component
   * (e.g. to change modal state via dash callback).
   */
  useEffect(() => {
    setActive(props.active || false);
  }, [props.active]);

  return (
    <ModalContext.Provider value={{ active, setActive, forceAction, setForceAction }}>
      {props.children}
    </ModalContext.Provider>
  );
};

ModalContextProvider.defaultProps = {
  setProps: () => null,
  active: false
};

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
