import * as React from "react";
import { MatElement, TABLE_DICO_V2 } from "../table-v2";
import './periodic-element.module.less';
import './periodic-element.detailed.less';
import { TABLE_DICO_CLASS } from "../table";

export enum  DISPLAY_MODE {
    SIMPLE = 'simple',
    DETAILED = 'detailed'
}

export interface PeriodicElementProps {
    disabled: boolean;
    enabled: boolean;
    hidden: boolean;
    element: MatElement | string;
    displayMode?: DISPLAY_MODE;
    onElementClicked: (e:MatElement) => void;
    onElementHovered: (e:MatElement) => void;
}

//TODO(chab) use render props to customize layout



export function PeriodicElement({element, displayMode = DISPLAY_MODE. SIMPLE,
                                    hidden = false,
                                    enabled = false,
                                    disabled = false,
                                    onElementClicked,
                                    onElementHovered}: PeriodicElementProps) {

    const handleClick = (element:MatElement) => !element.hasGroup && onElementClicked(element);
    const handleHover = (element:MatElement) => onElementHovered(element);
    const cl = {
      enabled: !hidden && enabled && !disabled,
      disabled: !hidden && disabled,
      hidden: hidden
    };

    if (typeof(element) === "string") {
      if (!TABLE_DICO_V2[element]) {
        console.error('Element', element, ' not found');
        return <div></div>;
      }
      element = TABLE_DICO_V2[element];
    }

    return (<div
      onClick={() => handleClick(element as MatElement)}
      onMouseOver={() => handleHover(element as MatElement)}
      className={
        `mat-element ${displayMode} ${TABLE_DICO_CLASS[element.symbol]} ${cl.hidden ? 'hidden' : ''} ${cl.enabled ? 'enabled' : ''}
          ${element.hasGroup ? 'mat-group' : ''}  ${cl.disabled ? 'disabled' : ''}`}>

        {displayMode === DISPLAY_MODE.SIMPLE ?
          <React.Fragment>
              <div className="mat-number">{element.number}</div>
              <div className="mat-symbol"> {element.symbol}</div>
          </React.Fragment>
          : <React.Fragment>
              <div className='main-panel'>
                  <div className="mat-number">{element.number}</div>
                  <div className="mat-symbol"> {element.symbol}</div>
                  <div className="mat-name">{element.name}</div>
                {!element.hasGroup && <div className="mat-weight">{element.atomic_mass}</div>}
              </div>
            { (element.shells && element.hasGroup) && <div className='mat-side-panel'>
                  {element.shells.map((shell, idx) => <div key={idx}>{shell}</div>)}
              </div>}

          </React.Fragment>
        }
    </div>)
}

