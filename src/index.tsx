/**
 *
 *  App bootstrapping. See index.html
 *
 */
import * as React from 'react';
import * as ReactDOM from "react-dom";
import "./styles.less";
import { SelectableTable } from "./periodic-table/table-state";
import { TableFilter } from "./periodic-table/periodic-filter/table-filter";
import { PeriodicElement } from "./periodic-table";
import { MatElement } from "./periodic-table/table-v2";
import { StandalonePeriodicComponent } from "./periodic-table/periodic-element/standalone-periodic-component";

const mountNodeSelector = 'app';
const mountNode = document.getElementById(mountNodeSelector);

ReactDOM.render(
  <div>
    <SelectableTable
      hiddenElements={{}}
      enabledElements={{'H': true, 'C': true}}
      disabledElements={{'Na':true, 'Ca':true}} />
    <TableFilter/>


    <StandalonePeriodicComponent size={50} disabled={false}
                     enabled={false}
                     hidden={false}
                     element={'H'}
                     onElementClicked={() => {}}
                     onElementHovered={() => {}}/>
  </div>

, mountNode);
console.log('RUNNING in',  process.env.NODE_ENV, 'DEBUGGING IS', process.env.DEBUG);
