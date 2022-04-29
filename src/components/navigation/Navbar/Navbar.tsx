import classNames from 'classnames';
import React, { useState } from 'react';
import Collapsible from 'react-collapsible';
import { FaBars, FaTimes } from 'react-icons/fa';
import { isUrl } from '../../../utils/navigation';
import { Link } from '../Link';
import { NavbarDropdown } from '../NavbarDropdown';
import './Navbar.css';

export interface NavbarItem {
  className?: string;
  label?: string;
  href?: string;
  target?: string;
  icon?: string;
  image?: string;
  isDivider?: boolean;
  isMenuLabel?: boolean;
  items?: NavbarItem[];
  isArrowless?: boolean;
  isRight?: boolean;
}

export interface NavbarProps {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  items: NavbarItem[];
  brandItem: NavbarItem;
}

export const Navbar: React.FC<NavbarProps> = ({ items = [], ...otherProps }) => {
  const props = { items, ...otherProps };
  const [activeMobile, setActiveMobile] = useState(false);

  const Icon = ({ icon }) => (
    <span className="icon">
      <i className={icon}></i>
    </span>
  );

  const InternalOrExternalLink = ({ item }: { item: NavbarItem }) => {
    if (item.href && isUrl(item.href)) {
      return (
        <a
          className={classNames('navbar-item', item.className)}
          href={item.href}
          target={item.target}
        >
          {item.icon && <Icon icon={item.icon} />}
          {item.label}
        </a>
      );
    } else {
      return (
        <Link
          className={classNames('navbar-item', item.className)}
          href={item.href}
          // onClick={() => setActiveMobile(false)}
        >
          {item.icon && <Icon icon={item.icon} />}
          {item.label}
        </Link>
      );
    }
  };

  return (
    <nav
      id={props.id}
      className={classNames('navbar', props.className)}
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <Link
          className={classNames('navbar-item', props.brandItem.className)}
          href={props.brandItem.href}
        >
          {props.brandItem.image && <img src={props.brandItem.image} />}
          {props.brandItem.icon && <Icon icon={props.brandItem.icon} />}
          {props.brandItem.label}
        </Link>
        <button className="navbar-burger" onClick={() => setActiveMobile(true)}>
          <FaBars />
        </button>
      </div>
      <div className="navbar-menu">
        <div className="navbar-end">
          {props.items.map((item, i) => {
            if (item.items) {
              return (
                <NavbarDropdown
                  key={`navbar-item-${i}`}
                  className={classNames('navbar-item', item.className)}
                  items={item.items}
                  isArrowless={item.isArrowless}
                  isRight={item.isRight}
                >
                  {item.icon && <Icon icon={item.icon} />}
                  {item.label}
                </NavbarDropdown>
              );
            } else {
              return <InternalOrExternalLink item={item} key={`navbar-item-${i}`} />;
            }
          })}
        </div>
      </div>
      <div
        className={classNames('navbar-mobile', {
          'is-active': activeMobile
        })}
      >
        <div className="navbar-brand">
          <Link
            className={classNames('navbar-item', props.brandItem.className)}
            href={props.brandItem.href}
            // onClick={() => setActiveMobile(false)}
          >
            {props.brandItem.image && <img src={props.brandItem.image} />}
            {!props.brandItem.image && props.brandItem.icon && <Icon icon={props.brandItem.icon} />}
            {!props.brandItem.image && !props.brandItem.icon && props.brandItem.label}
          </Link>
          <button className="navbar-burger" onClick={() => setActiveMobile(false)}>
            <FaTimes />
          </button>
        </div>
        <div className="navbar-mobile-menu">
          {props.items.map((item, i) => (
            <div key={`navbar-mobile-item-${i}`}>
              {item.items ? (
                <div className={item.className}>
                  <Collapsible
                    contentInnerClassName="navbar-dropdown"
                    trigger={item.label || <Icon icon={item.icon} /> || ''}
                    triggerClassName="navbar-item"
                    triggerOpenedClassName="navbar-item"
                    transitionTime={250}
                  >
                    {item.items.map((innerItem, k) => {
                      if (innerItem.isMenuLabel) {
                        /** Use a <span> and the menu-label class for menu labels */
                        return (
                          <span
                            className="navbar-item menu-label"
                            key={`navbar-mobile-inner-item-${k}`}
                          >
                            {innerItem.label}
                          </span>
                        );
                      } else {
                        return (
                          <InternalOrExternalLink
                            item={innerItem}
                            key={`navbar-mobile-inner-item-${k}`}
                          />
                        );
                      }
                    })}
                  </Collapsible>
                </div>
              ) : (
                <InternalOrExternalLink item={item} />
              )}
            </div>
          ))}
        </div>
      </div>
      <div
        className={classNames('modal-background', {
          'is-hidden-by-opacity': !activeMobile
        })}
        onClick={() => setActiveMobile(false)}
      ></div>
    </nav>
  );
};
