/**
 *
 *  App bootstrapping. See index.html
 *
 */


import * as React from 'react';
import * as ReactDOM from "react-dom";

import { Table } from './periodic-table/periodic-table.component';
import "./styles.less";

const mountNodeSelector = 'app';
const mountNode = document.getElementById(mountNodeSelector);

const enabledElement: any = {Be:true, Na:true, Cl:true};
const disabledElement: any = {Li:true, He:true};

ReactDOM.render(<Table onElementClicked={(e) => console.log(e)} enabledElement={enabledElement}
                       disabledElement={disabledElement}/>, mountNode);
