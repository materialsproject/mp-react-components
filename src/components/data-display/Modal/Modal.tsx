import classNames from 'classnames';
import React, { ReactNode, useState } from 'react';
import './Modal.css';

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
   * Element to be used to open the modal.
   * Can also be supplied as the first of two children (necessary in Dash).
   */
  trigger?: ReactNode;

  /**
   * Element to render inside the modal-content div.
   * Can also be supplied as the second of two children (necessary in Dash).
   */
  modalContent?: ReactNode;
}

/**
 * Render a trigger that opens a modal with the specified modal content
 */
export const Modal: React.FC<Props> = (props) => {
  const [active, setActive] = useState(false);
  let trigger = props.trigger;
  let modalContent = props.modalContent;

  if (Array.isArray(props.children) && props.children[1]) {
    trigger = props.children[0];
    modalContent = props.children[1];
  } else if (props.children) {
    modalContent = props.children;
  }

  if (React.isValidElement(trigger)) {
    trigger = React.cloneElement(trigger, { onClick: () => setActive(true) });
  }

  return (
    <div className="mpc-modal">
      {trigger}
      <div
        className={classNames('modal', {
          'is-active': active
        })}
      >
        <div className="modal-background" onClick={() => setActive(false)}></div>
        <div className="modal-content">{modalContent}</div>
        <button
          className="modal-close is-large"
          aria-label="close"
          onClick={() => setActive(false)}
        ></button>
      </div>
    </div>
  );
};
