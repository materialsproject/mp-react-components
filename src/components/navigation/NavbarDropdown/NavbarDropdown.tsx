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
  label: React.ReactNode;
  items: NavbarItem[];
  isArrowless?: boolean;
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
        {props.label}
      </a>
      <div className="navbar-dropdown">
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
  label: '',
  items: [],
};
