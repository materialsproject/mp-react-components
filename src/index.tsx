/**
 *
 *  App bootstrapping. See index.html
 *
 */


import * as React from 'react';
import * as ReactDOM from "react-dom";

import { Table } from './periodic-table/periodic-table-component/periodic-table.component';
import "./styles.less";
import { WithSelection } from "./periodic-table/table-state";

const mountNodeSelector = 'app';
const mountNode = document.getElementById(mountNodeSelector);

const enabledElement: any = {Be:true, Na:true, Cl:true};
const disabledElement: any = {Li:true, He:true};

/*ReactDOM.render(<Table onElementClicked={(e) => console.log(e)} enabledElement={enabledElement}
                       disabledElement={disabledElement}/>, mountNode);*/

ReactDOM.render(<WithSelection/>, mountNode);
console.log('RUNNING in', process.env.DEBUG, process.env.NODE_ENV);
