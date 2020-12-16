import classNames from "classnames";
import React, { useState } from "react";

interface NavbarItem {
  className?: string;
  text?: string;
  href?: string;
  isDivider?: boolean;
  isMenuLabel?: boolean;
}

interface Props {
  label: string;
  items: NavbarItem[];
}

export const NavbarDropdown: React.FC<Props> = props => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      className={classNames("navbar-item has-dropdown", {
        'is-active': isActive
      })}
      onMouseOver={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      <a className="navbar-link">
        {props.label}
      </a>
      <div className="navbar-dropdown">
        {props.items.map((item, i) => {
          if(item.isDivider) {
            return <hr className="navbar-divider" key={i}/>;  
          } else if(item.isMenuLabel) {
            return <span className="navbar-item menu-label" key={i}>{item.text}</span>;
          } else {
            return (
              <a
                key={i}
                href={item.href} 
                className={classNames("navbar-item", item.className)} 
                onClick={() => setIsActive(false)}
              >
                {item.text}
              </a>
            )
          }      
        })}
      </div>
    </div>
  );
};

NavbarDropdown.defaultProps = {
  navbarLink: '',
  navbarItems: []
};
