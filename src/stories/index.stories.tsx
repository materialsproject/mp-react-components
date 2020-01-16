import * as React from "react";
import { Table } from "../periodic-table/periodic-table.component";
import { action } from "@storybook/addon-actions";

export default {
  component: Table,
  title: 'Periodic Table'
};

const disabledElement = {Be:true, Na:true, Cl:true};

export const table = () => <Table disabledElement={disabledElement} enabledElement={{}} onElementClicked={ action('element-click')}/>;
