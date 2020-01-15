import * as React from "react";
import './periodic-table.module.less';
import { MatElement, TABLE } from "./table";
import { PeriodicElement } from "./periodic-element/periodic-element.component";

export interface TableProps {
  disabledElement: {[symbol:string]: boolean};
  enabledElement: {[symbol:string]: boolean};
}

// Ultimately, we'll allow people to pass a specific component by using render props
// the goal is to allow people to insert whatever you want there
export function TableSpacer() {
  return (<React.Fragment>
    <div className="first-span"></div>
    <div className="second-span"></div>
    <div className="third-span"></div>
    <div className="separator-span"></div>
    <div className="first-lower-span"></div>
    <div className="second-lower-span"></div>
  </React.Fragment>);
}

export function Table({disabledElement, enabledElement}: TableProps) {
  return (
    <div className="table-container">
      <TableSpacer/>
      {TABLE.map((element: MatElement) =>
          <PeriodicElement
            key={`${element.symbol}--${element.elementNumber}`}
            disabled={disabledElement[element.symbol]} enabled={enabledElement[element.symbol]} element={element}/>
      )}
    </div>)
}

