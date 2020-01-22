import * as React from "react";
import {MatElement} from "../table-v2";
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
    element: MatElement;
    displayMode?: DISPLAY_MODE;
    onElementClicked: (e:MatElement) => void;
    onElementHovered: (e:MatElement) => void;
}

//TODO(chab) use render props to customize layout

export function PeriodicElement({element, displayMode = DISPLAY_MODE. SIMPLE,

                                    enabled = false,
                                    disabled = false,
                                    onElementClicked,
                                    onElementHovered}: PeriodicElementProps) {

    const handleClick = (element:MatElement) => onElementClicked(element);
    const handleHover = (element:MatElement) => onElementHovered(element);

    return (<div
      onClick={() => handleClick(element)}
      onMouseOver={() => handleHover(element)}
      className={`mat-element ${displayMode} ${TABLE_DICO_CLASS[element.symbol]} ${(enabled  && !disabled) ? 'enabled' : ''} ${disabled ? 'disabled' : ''} `}>

        {displayMode === DISPLAY_MODE.SIMPLE ?
          <React.Fragment>
              <div className="number">{element.number}</div>
              <div className="symbol"> {element.symbol}</div>
          </React.Fragment>
          : <React.Fragment>
              <div className='main-panel'>
                  <div className="number">{element.number}</div>
                  <div className="symbol"> {element.symbol}</div>
                  <div className="name">{element.name}</div>
                  <div className="weight">{element.atomic_mass}</div>
              </div>
            {element.shells && <div className='side-panel'>
                  {element.shells.map((shell, idx) => <div key={idx}>{shell}</div>)}
              </div>}

          </React.Fragment>
        }

    </div>)
}
