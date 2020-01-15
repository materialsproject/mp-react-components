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
ReactDOM.render(<Table enabledElement={[]} disabledElement={[]}/>, mountNode);
