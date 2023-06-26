import classNames from 'classnames';
import React, { useState, useEffect, useRef } from 'react';
import { isUrl } from '../../../utils/navigation';
import { Link } from '../Link';
import { NavbarItem } from '../Navbar';
import { ModalContextProvider, ModalTrigger, Modal } from '../../data-display/Modal';
import { IsArrowless } from '../../../stories/navigation/Dropdown.stories';

interface Props {
  className?: string;
  items: NavbarItem[];
  isArrowless?: boolean;
  isRight?: boolean;
  isActiveOnClick?: boolean;
  isModal?: boolean;
  displayDot?: boolean;
}

export const NavbarDropdown: React.FC<Props> = (props) => {
  const [isActive, setIsActive] = useState(false); /* state for the dropdown menu */

  let onClickHandler = () => setIsActive(!isActive);

  let dropDownContent = (
    <>
      <a
        className={classNames('navbar-link', {
          'is-arrowless': props.isArrowless
        })}
      >
        {/**
         * Link content is populated by children prop
         * This is the only way a dash component can take a component as a prop
         */}
        {props.children}
      </a>
      <div
        className={classNames('navbar-dropdown', {
          'is-right': props.isRight
        })}
      >
        {props.items.map((item, i) => {
          if (item.isDivider) {
            /** Use an <hr> for dividers */
            return <hr className="navbar-divider" key={i} />;
          } else if (item.isMenuLabel) {
            /** Use a <span> and the menu-label class for menu labels */
            return (
              <span className="navbar-item menu-label" key={i}>
                {item.label}
              </span>
            );
          } else if (item.href && isUrl(item.href)) {
            /** Use a regular <a> tag for full external links */
            return (
              <a
                key={i}
                href={item.href}
                target={item.target}
                className={classNames('navbar-item', item.className)}
                onClick={() => setIsActive(false)}
              >
                {item.label}
              </a>
            );
          } else {
            /** Use a <Link> component for internal links */
            return (
              <span onClick={() => setIsActive(false)} key={i}>
                <Link
                  key={i}
                  href={item.href || ''}
                  className={classNames('navbar-item', item.className)}
                >
                  {item.label}
                </Link>
              </span>
            );
          }
        })}
      </div>
    </>
  );

  if (props.isModal) {
    return (
      <div
        className={classNames('navbar-item has-dropdown', props.className, {
          'is-active': isActive
        })}
        onClick={onClickHandler}
      >
        <a
          className={classNames('navbar-link', {
            'is-arrowless': props.isArrowless
          })}
        >
          {/**
           * Link content is populated by children prop
           * This is the only way a dash component can take a component as a prop
           */}
          {props.children}
        </a>
        <div className={classNames('navbar-dropdown', { 'is-right': props.isRight })}>
          {props.items.map((item, i) => {
            return (
              /**  prevent the dropwdown from closing */
              <div key={i} onClick={(e) => e.stopPropagation()}>
                <ModalContextProvider key={i}>
                  <ModalTrigger key={i}>
                    <span className={classNames('navbar-item')}>{item.label}</span>
                  </ModalTrigger>
                  <Modal key={i}>
                    <div className="panel">
                      <div className="panel-heading">{item.header && item.header}</div>
                      <div className="panel-block p-5">{item.content && item.content}</div>
                    </div>
                  </Modal>
                </ModalContextProvider>
              </div>
            );
          })}
        </div>
      </div>
    );
  } else if (props.isActiveOnClick) {
    return (
      <div
        className={classNames('navbar-item has-dropdown', props.className, {
          'is-active': isActive
        })}
        onClick={() => setIsActive(!isActive)}
      >
        {dropDownContent}
      </div>
    );
  } else {
    return (
      <div
        className={classNames('navbar-item has-dropdown', props.className, {
          'is-active': isActive
        })}
        onMouseOver={() => setIsActive(true)}
        onMouseLeave={() => setIsActive(false)}
      >
        {dropDownContent}
      </div>
    );
  }
};

NavbarDropdown.defaultProps = {
  items: []
};
