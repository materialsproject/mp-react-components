import classNames from 'classnames';
import React, { useState } from 'react';
import { Link } from '../Link';

interface NavbarItem {
  className?: string;
  text?: string;
  href?: string;
  isDivider?: boolean;
  isMenuLabel?: boolean;
  openInNewTab?: boolean;
}

interface Props {
  className?: string;
  items: NavbarItem[];
  isArrowless?: boolean;
  isRight?: boolean;
}

export const NavbarDropdown: React.FC<Props> = (props) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      className={classNames('navbar-item has-dropdown', props.className, {
        'is-active': isActive,
      })}
      onMouseOver={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      <a
        className={classNames('navbar-link', {
          'is-arrowless': props.isArrowless,
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
          'is-right': props.isRight,
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
                {item.text}
              </span>
            );
          } else if (item.href && item.href.indexOf('://') > -1) {
            /** Use a regular <a> tag for full external links */
            return (
              <a
                key={i}
                href={item.href}
                target={item.openInNewTab ? '_blank' : '_self'}
                className={classNames('navbar-item', item.className)}
                onClick={() => setIsActive(false)}
              >
                {item.text}
              </a>
            );
          } else {
            /** Use a <Link> component for internal links */
            return (
              <Link
                key={i}
                href={item.href}
                className={classNames('navbar-item', item.className)}
                onClick={() => setIsActive(false)}
              >
                {item.text}
              </Link>
            );
          }
        })}
      </div>
    </div>
  );
};

NavbarDropdown.defaultProps = {
  items: [],
};
