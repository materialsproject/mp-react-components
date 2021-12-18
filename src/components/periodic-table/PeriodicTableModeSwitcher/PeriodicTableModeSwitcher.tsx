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
import { FaAngleDown, FaAsterisk } from 'react-icons/fa';
import { Tooltip } from '../../data-display/Tooltip';
import { Markdown } from '../../data-display/Markdown';

interface Props {
  mode: PeriodicTableSelectionMode;
  allowedModes?: PeriodicTableSelectionMode[];
  hideWildcardButton?: boolean;
  chemicalSystemSelectHelpText?: string;
  elementsSelectHelpText?: string;
  onSwitch: (mode: PeriodicTableSelectionMode) => any;
  onFormulaButtonClick: (value: string) => any;
}

export enum PeriodicTableSelectionMode {
  CHEMICAL_SYSTEM = 'Only Elements',
  ELEMENTS = 'At Least Elements',
  FORMULA = 'Formula'
}

export const PeriodicTableModeSwitcher: React.FC<Props> = ({
  allowedModes = [
    'Formula' as PeriodicTableSelectionMode,
    'At Least Elements' as PeriodicTableSelectionMode,
    'Only Elements' as PeriodicTableSelectionMode
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

  const modesSelector = (
    <div className="tabs is-small is-toggle is-toggle-rounded is-centered">
      <ul>
        {props.allowedModes.map((d, i) => (
          <li key={'mode-' + i} className={classNames({ 'is-active': d === mode })}>
            <a
              onClick={() => {
                setMode(d);
                props.onSwitch(d);
              }}
            >
              <span>{d}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      <div data-testid="mpc-pt-mode-switcher" className="mpc-pt-mode-switcher first-span">
        <div className="dropdown-container">{modesSelector}</div>
      </div>
      <div className="second-span mpc-pt-mode-content">
        {props.mode === PeriodicTableSelectionMode.FORMULA && (
          <PeriodicTableFormulaButtons
            onClick={props.onFormulaButtonClick}
            hideWildcardButton={props.hideWildcardButton}
          />
        )}
        {props.mode === PeriodicTableSelectionMode.CHEMICAL_SYSTEM && (
          <>
            <div className="pt-spacer"></div>
            {!props.hideWildcardButton && (
              <>
                <button
                  type="button"
                  className="pt-wildcard-button mat-element has-tooltip-bottom"
                  onClick={() => props.onFormulaButtonClick('-*')}
                  data-tip
                  data-for="element-wildcard-button"
                >
                  <span className="mat-symbol">
                    <FaAsterisk />
                  </span>
                </button>
                <Tooltip id="element-wildcard-button" place="bottom">
                  Wildcard element
                </Tooltip>
              </>
            )}
            <div className="pt-description">
              {props.chemicalSystemSelectHelpText && (
                <Markdown>{props.chemicalSystemSelectHelpText}</Markdown>
              )}
            </div>
          </>
        )}
        {props.mode === PeriodicTableSelectionMode.ELEMENTS && (
          <div className="pt-description">
            {props.chemicalSystemSelectHelpText && (
              <Markdown>{props.elementsSelectHelpText}</Markdown>
            )}
          </div>
        )}
      </div>
    </>
  );
};
