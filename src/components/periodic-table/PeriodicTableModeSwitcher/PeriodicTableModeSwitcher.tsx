import React, { useEffect, useState } from 'react';
import { PeriodicTableFormulaButtons } from '../PeriodicTableFormulaButtons';
import './PeriodicTableModeSwitcher.css';
import classNames from 'classnames';
import {
  Wrapper as MenuWrapper,
  Button as MenuButton,
  Menu,
  MenuItem
} from 'react-aria-menubutton';
import { FaAngleDown } from 'react-icons/fa';

interface Props {
  mode: PeriodicTableSelectionMode;
  allowedModes?: PeriodicTableSelectionMode[];
  onSwitch: (mode: PeriodicTableSelectionMode) => any;
  onFormulaButtonClick: (value: string) => any;
}

export enum PeriodicTableSelectionMode {
  CHEMICAL_SYSTEM = 'Elements (only)',
  ELEMENTS = 'Elements (at least)',
  FORMULA = 'Formula'
}

export const PeriodicTableModeSwitcher: React.FC<Props> = ({
  allowedModes = [
    'Elements (only)' as PeriodicTableSelectionMode,
    'Elements (at least)' as PeriodicTableSelectionMode,
    'Formula' as PeriodicTableSelectionMode
  ],
  ...otherProps
}) => {
  const props = { allowedModes, ...otherProps };
  const [mode, setMode] = useState(props.mode);

  useEffect(() => {
    setMode(props.mode);
  }, [props.mode]);

  const modesMenu = (
    <MenuWrapper
      data-testid="results-per-page-menu"
      className="dropdown is-active"
      onSelection={(m) => {
        setMode(m);
        props.onSwitch(m);
      }}
    >
      <div className="dropdown-trigger">
        <MenuButton className="button is-small">
          <span>{mode}</span>
          <span className="icon">
            <FaAngleDown />
          </span>
        </MenuButton>
      </div>
      <Menu className="dropdown-menu">
        <ul className="dropdown-content">
          {props.allowedModes.map((d, i) => (
            <MenuItem key={i} value={d}>
              <li className={classNames('dropdown-item', { 'is-active': d === mode })}>{d}</li>
            </MenuItem>
          ))}
        </ul>
      </Menu>
    </MenuWrapper>
  );

  return (
    <>
      <div data-testid="mpc-pt-mode-switcher" className="mpc-pt-mode-switcher first-span">
        <div className="dropdown-container">{modesMenu}</div>
      </div>
      <div className="second-span">
        {props.mode === PeriodicTableSelectionMode.FORMULA && (
          <PeriodicTableFormulaButtons onClick={props.onFormulaButtonClick} />
        )}
        {props.mode === PeriodicTableSelectionMode.CHEMICAL_SYSTEM && (
          <p className="mpc-pt-mode-switcher-description">
            Select elements to search for materials with <strong>only</strong> these elements
          </p>
        )}
        {props.mode === PeriodicTableSelectionMode.ELEMENTS && (
          <p className="mpc-pt-mode-switcher-description">
            Select elements to search for materials with <strong>at least</strong> these elements
          </p>
        )}
      </div>
    </>
  );
};
