import * as React from 'react';
import { MatElement, TABLE_DICO_V2 } from '../periodic-table-data/table-v2';
import './periodic-element.module.less';
import './periodic-element.detailed.less';
import { TABLE_DICO_CLASS } from '../periodic-table-data/table';

export enum DISPLAY_MODE {
  /** only display number-symbol-name */
  SIMPLE = 'simple',
  /** displays other properties of the element */
  DETAILED = 'detailed'
}

export interface PeriodicElementProps {
  /** whether the element is disabled. A disabled element is still visible */
  disabled: boolean;
  /** whether the element is selected. An enabled element is still visible */
  enabled: boolean;
  /** whether the element is hidden. An hidden element is still visible */
  hidden: boolean;
  color?: string;
  /** A periodic element. Can be either the symbol string, or an object implementing MatElement **/
  element: MatElement | string;
  /** what to display  */
  displayMode?: DISPLAY_MODE;
  /** callback called when an element clicked */
  onElementClicked?: (e: MatElement) => void;
  /** callback called when an element is moused over */
  onElementMouseOver?: (e: MatElement) => void;
  /** callback called when mouse leaves an element */
  onElementMouseLeave?: (e: MatElement) => void;
}

//TODO(chab) use render props to customize layout

export function PeriodicElement({
  element,
  displayMode = DISPLAY_MODE.SIMPLE,
  hidden = false,
  enabled = false,
  disabled = false,
  color,
  onElementClicked = () => {},
  onElementMouseOver = () => {},
  onElementMouseLeave = () => {}
}: PeriodicElementProps) {
  const handleClick = (element: MatElement) => !element.hasGroup && onElementClicked(element);
  const handleHover = (element: MatElement) => onElementMouseOver(element);
  const handleLeave = (element: MatElement) => onElementMouseLeave(element);
  const cl = {
    enabled: !hidden && enabled && !disabled,
    disabled: !hidden && disabled,
    hidden: hidden
  };

  if (typeof element === 'string') {
    if (!TABLE_DICO_V2[element]) {
      console.error('Element', element, ' not found');
      return <div></div>;
    }
    element = TABLE_DICO_V2[element];
  }

  return (
    <button
      onClick={() => handleClick(element as MatElement)}
      onMouseOver={() => handleHover(element as MatElement)}
      onMouseLeave={() => handleLeave(element as MatElement)}
      style={color ? { background: color } : {}}
      className={`mat-element ${displayMode} ${TABLE_DICO_CLASS[element.symbol]} ${
        cl.hidden ? 'hidden' : ''
      } ${cl.enabled ? 'enabled' : ''}
          ${element.hasGroup ? 'mat-group' : ''}  ${cl.disabled ? 'disabled' : ''}`}
      disabled={cl.disabled || cl.hidden}
      aria-disabled={cl.disabled}
      aria-hidden={cl.hidden}
    >
      {displayMode === DISPLAY_MODE.SIMPLE ? (
        <React.Fragment>
          <div className="mat-number">{element.number}</div>
          <div className="mat-symbol"> {element.symbol}</div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="main-panel">
            <div className="mat-number">{element.number}</div>
            <div className="mat-symbol"> {element.symbol}</div>
            <div className="mat-name">{element.name}</div>
            {!element.hasGroup && <div className="mat-weight">{element.atomic_mass}</div>}
          </div>
          {element.shells && !element.hasGroup && (
            <div className="mat-side-panel">
              {element.shells.map((shell, idx) => (
                <div key={idx}>{shell}</div>
              ))}
            </div>
          )}
        </React.Fragment>
      )}
    </button>
  );
}
