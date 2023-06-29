import classNames from 'classnames';
import React, { useState, useEffect, useRef, createContext } from 'react';
import { ModalContextProvider, ModalTrigger, Modal } from '../../data-display/Modal';
import { Bell } from './Bell';
import ReactMarkdown from 'react-markdown';
import { UrlObject } from 'query-string';

/* individual items to be included in the dropdown */
export interface NotificationItem {
  className?: string;
  label?: string;
  href?: string;
  content?: string;
  header?: string;
  isRead?: boolean;
  id?: string;
}

export interface NotificationDropdownProps {
  className?: string;
  id?: string;
  notifyLevel?: string;
  hasUnread?: boolean;
  isHidden?: boolean;
  items: NotificationItem[];
  isRight?: boolean;
  isModal?: boolean;
  link?: string;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = (props) => {
  const [isActive, setIsActive] = useState(false); /* state for the dropdown menu */

  /* add reference for closing dropdown, if clicked outside then close the dropdown */
  const dropdownRef = useRef<HTMLDivElement>(null);
  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsActive(false);
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /* map a list of messages with id name and isread state */
  const [unreadMessages, setUnreadMessages] = useState(
    props.items.map((item, i) => ({ id: item.id && item.id, isRead: false }))
  );

  /* state for displaying the red dot next to the bell */
  const [hasUnreadMessages, setHasUnreadMessages] = useState(
    props.hasUnread ? props.hasUnread : false
  );

  let handleItemClick;
  if (props.notifyLevel == 'Message') {
    /* handler for each menu item */
    handleItemClick = async (e: any, messageId: string | undefined) => {
      /**  prevent the dropwdown from closing */
      e.stopPropagation();
      /* when clicked, the corresponding message will update its isRead to true */
      const updatedMessages = unreadMessages.map((message) => {
        if (message.id === messageId) {
          return { ...message, isRead: true };
        }
        return message;
      });
      setUnreadMessages(updatedMessages);
      setHasUnreadMessages(updatedMessages.some((message) => !message.isRead));
      /* TODO: add post method to the api for each message */
    };
  } else {
    handleItemClick = (e: any) => {
      e.stopPropagation();
    };
  }

  if (props.isHidden) {
    return <div></div>;
  } else {
    return (
      <div
        id={props.id}
        className={classNames('navbar-item has-dropdown', props.className, {
          'is-active': isActive
        })}
        onClick={(e) => {
          setIsActive(!isActive);
          if (props.notifyLevel !== 'message') {
            setHasUnreadMessages(false);
          }
        }}
        ref={dropdownRef}
      >
        <a
          className={classNames('navbar-link', {
            'is-arrowless': true
          })}
        >
          {/**
           * Link content is populated by children prop
           * This is the only way a dash component can take a component as a prop
           */}
          <Bell showBadge={hasUnreadMessages}></Bell>
        </a>
        <div className={classNames('navbar-dropdown', { 'is-right': props.isRight })}>
          {props.items.map((item, i) => {
            return (
              <div key={`notification-item-${i}`} onClick={(e) => handleItemClick(e, item.id)}>
                <ModalContextProvider key={`modal-context-${i}`}>
                  <ModalTrigger key={`modal-trigger-${i}`}>
                    <a className={classNames('navbar-item')} key={`message-${i}`}>
                      {props.notifyLevel == 'message' ? (
                        !unreadMessages.find((message) => message.id === item.id)?.isRead && (
                          <i
                            className="fas fa-circle notification-dot"
                            key={`message-dot-${i}`}
                          ></i>
                        )
                      ) : (
                        <span></span>
                      )}
                      {item.label}
                    </a>
                  </ModalTrigger>
                  <Modal key={`modal-${i}`}>
                    <div className="panel">
                      <div className="panel-heading">{item.header}</div>
                      <div className="panel-block p-5">
                        <ReactMarkdown>{item.content ? item.content : ' '}</ReactMarkdown>
                      </div>
                    </div>
                  </Modal>
                </ModalContextProvider>
              </div>
            );
          })}
          <a className={classNames('navbar-item', 'more')} href={props.link} target={'_blank'}>
            More
          </a>
        </div>
      </div>
    );
  }
};

NotificationDropdown.defaultProps = {
  items: []
};

export default NotificationDropdown;
