/**
 *
 *  App bootstrapping. See index.html
 *
 */


import * as React from 'react';
import * as ReactDOM from "react-dom";

//import { Table } from './periodic-table/periodic-table-component/periodic-table.component';
import "./styles.less";
import { WithSelection } from "./periodic-table/table-state";

const mountNodeSelector = 'app';
const mountNode = document.getElementById(mountNodeSelector);


/*ReactDOM.render(<Table onElementClicked={(e) => console.log(e)} enabledElement={enabledElement}
                       disabledElement={disabledElement}/>, mountNode);*/

ReactDOM.render(<WithSelection enabledElements={{'H': true, 'C': true}} disabledElements={{'Na':true, 'Ca':true}} />, mountNode);
console.log('RUNNING in',  process.env.NODE_ENV, 'DEBUGGING IS', process.env.DEBUG);
