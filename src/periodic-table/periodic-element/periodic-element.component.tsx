import * as React from "react";
import {MatElement} from "../table";
import './periodic-element.module.less';

export interface PeriodicElementProps {
    disabled: boolean;
    enabled: boolean;
    element: MatElement;
    onElementClicked: (e:MatElement) => void;
    onElementHovered: (e:MatElement) => void;
}


export function PeriodicElement({element, enabled = false, disabled = false, onElementClicked, onElementHovered}: PeriodicElementProps) {

    const handleClick = (element:MatElement) => onElementClicked(element);
    const handleHover = (element:MatElement) => onElementHovered(element);

    return (<div
      onClick={() => handleClick(element)}
      onMouseOver={() => handleHover(element)}
      className={`mat-element  ${element.class} ${(enabled  && !disabled) ? 'enabled' : ''} ${disabled ? 'disabled' : ''} `}>
        <div className="number">
            {element.elementNumber}
        </div>
        <div className="symbol">
            {element.symbol}
        </div>
    </div>)
}
