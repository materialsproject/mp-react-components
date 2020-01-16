/**
 *
 *  App bootstrapping. See index.html
 *
 */
import * as React from 'react';
import * as ReactDOM from "react-dom";
import "./styles.less";
import { SelectableTable } from "./periodic-table/table-state";

const mountNodeSelector = 'app';
const mountNode = document.getElementById(mountNodeSelector);

ReactDOM.render(<SelectableTable enabledElements={{'H': true, 'C': true}} disabledElements={{'Na':true, 'Ca':true}} />, mountNode);
console.log('RUNNING in',  process.env.NODE_ENV, 'DEBUGGING IS', process.env.DEBUG);
