import * as React from "react";
import {MatElement} from "../table";
import './periodic-element.module.less';

export interface PeriodicElementProps {
    disabled: boolean;
    enabled: boolean;
    element: MatElement;
}

export function PeriodicElement({element, enabled = false, disabled = false}: PeriodicElementProps) {
    return (<div className={`mat-element  ${element.class} ${(enabled  && !disabled) ? 'enabled' : ''} ${disabled ? 'disabled' : ''} `}>
        <div className="number">
            {element.elementNumber}
        </div>
        <div className="symbol">
            {element.symbol}
        </div>
    </div>)
}
