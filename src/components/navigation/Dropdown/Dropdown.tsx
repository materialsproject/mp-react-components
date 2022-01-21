import classNames from 'classnames';
import React, { ReactNode, useState } from 'react';
import {
  Wrapper as MenuWrapper,
  Button as MenuButton,
  Menu,
  MenuItem
} from 'react-aria-menubutton';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

export interface DropdownProps {
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
   * Class name(s) to append to the component's default class (`dropdown`)
   */
  className?: string;

  /**
   * Text to display in the button that triggers the dropdown to open
   */
  triggerLabel?: string;

  /**
   * Class name(s) to apply to button that opens the dropdown menu
   * @default 'button'
   */
  triggerClassName?: string;

  /**
   * Class name(s) for the icon to display to the left of the trigger label (optional)
   */
  triggerIcon?: string | ReactNode;

  /**
   * List of strings to display inside the dropdown menu.
   * Omit this and use the children prop instead if you want supply components as dropdown items.
   */
  items?: React.ReactNode[];

  /**
   * Set to true to remove the arrow to the right of the trigger label
   */
  isArrowless?: boolean;

  /**
   * Set to true to make the dropdown menu open upwards
   */
  isUp?: boolean;

  /**
   * Set to true to align the dropdown menu with the right of the trigger
   */
  isRight?: boolean;

  /**
   * Set to false to keep the menu open when an item is clicked
   * @default true
   */
  closeOnSelection?: boolean;
}

/**
 * Generic dropdown menu that can render arbitrary items for display
 * and navigation purposes only (i.e. not for selecting options or performing actions that are not links)
 */
export const Dropdown: React.FC<DropdownProps> = ({
  items = [],
  triggerClassName = 'button',
  closeOnSelection = true,
  ...otherProps
}) => {
  const props = { items, closeOnSelection, triggerClassName, ...otherProps };
  const iconComponent = React.isValidElement(props.triggerIcon) ? (
    props.triggerIcon
  ) : (
    <i className={props.triggerIcon?.toString()}></i>
  );

  return (
    <MenuWrapper
      data-testid="mpc-dropdown"
      id={props.id}
      className={classNames('dropdown is-active', props.className, {
        'is-up': props.isUp,
        'is-right': props.isRight
      })}
      closeOnSelection={props.closeOnSelection}
    >
      <div className="dropdown-trigger">
        <MenuButton className={classNames(props.triggerClassName)}>
          {props.triggerIcon && iconComponent}
          {props.triggerLabel && <span>{props.triggerLabel}</span>}
          {!props.isArrowless && (
            <span className="icon">{props.isUp ? <FaAngleUp /> : <FaAngleDown />}</span>
          )}
        </MenuButton>
      </div>
      <Menu className="dropdown-menu">
        <div className="dropdown-content">
          {props.children
            ? React.Children.map(props.children, (item, i) => <MenuItem key={i}>{item}</MenuItem>)
            : props.items?.map((item, i) => (
                <MenuItem key={i}>
                  <div className="dropdown-item">{item}</div>
                </MenuItem>
              ))}
        </div>
      </Menu>
    </MenuWrapper>
  );
};
