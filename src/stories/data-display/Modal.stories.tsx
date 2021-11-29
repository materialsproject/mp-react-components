import React, { useState } from 'react';
import { Story } from '@storybook/react';
import { Modal, ModalContextProvider, ModalTrigger } from '../../components/data-display/Modal';
import { ModalContextProviderProps } from '../../components/data-display/Modal/ModalContextProvider';

export default {
  component: ModalContextProvider,
  title: 'Data-Display/Modal'
};

export const Basic: Story<React.PropsWithChildren<ModalContextProviderProps>> = (args) => (
  <ModalContextProvider {...args}>
    <ModalTrigger>
      <button className="button">Open Modal</button>
    </ModalTrigger>
    <Modal>
      <div className="panel">
        <div className="panel-heading">Panel</div>
        <div className="panel-block p-5">content</div>
      </div>
    </Modal>
  </ModalContextProvider>
);

export const WithForcedAction: Story<React.PropsWithChildren<ModalContextProviderProps>> = (
  args
) => {
  const [active, setActive] = useState(false);
  return (
    <ModalContextProvider {...args} active={active}>
      <ModalTrigger>
        <button className="button">Open Modal with Forced Action</button>
      </ModalTrigger>
      <Modal>
        <div className="panel">
          <div className="panel-heading">Panel</div>
          <div className="p-5">
            <div>
              <strong>Refresh page to close.</strong>
            </div>
            <div>
              In a normal react context, you can set the active prop to a state variable and modify
              that state from a button inside the modal.
            </div>
          </div>
          <button className="button m-5" onClick={() => setActive(false)}>
            Save
          </button>
        </div>
      </Modal>
    </ModalContextProvider>
  );
};

WithForcedAction.args = {
  forceAction: true
};
