import * as React from 'react';
import { useState } from 'react';
import {
  COLORSCHEME,
  Table,
  TableLayout
} from '../periodic-table/periodic-table-component/periodic-table.component';
import { action } from '@storybook/addon-actions';
import { SelectableTable } from '../periodic-table/table-state';
import { useElements } from '../periodic-table/periodic-table-state/table-store';
import { TableFilter } from '../periodic-table/periodic-filter/table-filter';
import { StandalonePeriodicComponent } from '../periodic-table/periodic-element/standalone-periodic-component';
import { PeriodicContext } from '../index';

import './style.css';
import { DISPLAY_MODE } from '../periodic-table/periodic-element/periodic-element.component';
import { withKnobs, color, select, boolean, number } from '@storybook/addon-knobs';

const disabledElement = { Be: true, Na: true, Cl: true };
const selectedElement = { O: true, H: true, Be: true };

const elementOptions = {
  H: ['H'],
  OH: ['O', 'H'],
  OHK: ['K', 'O', 'H'],
  NaCl: ['Na', 'Cl'],
  PBCl: ['Pb', 'Cl'],
  Lots: ['K', 'O', 'H', 'Na', 'Cl', 'Pb', 'He', 'Ur', 'Be', 'Po', 'Fl'],
  Empty: []
};

function SelectedComponent() {
  const { enabledElements } = useElements();
  // try to delete the key in the store instead
  const getElementsList = () => Object.keys(enabledElements).filter(el => enabledElements[el]);
  return (
    <ul>
      {getElementsList().map(el => (
        <li key={el}>{el}</li>
      ))}
    </ul>
  );
}

export const table = () => (
  <>
    <div>
      This a periodic table with no state management. You need to explicitly wire which elements are
      selected/disabled/hidden. Two callbacks are exposed. One is called when an element is hovered,
      one is called when an element is clicked
    </div>
    <div> Look below, if you want to colorize some elements of the table </div>
    <Table
      onElementMouseOver={action('element-hovered')}
      disabledElement={disabledElement}
      hiddenElement={{}}
      enabledElement={selectedElement}
      onElementClicked={action('element-click')}
    />
    ;
  </>
);

export const managedTable = () => (
  <>
    <div>
      <p>
        This is a managed table that retains selection from user. The state of the selection is
        managed outside of the components and can be reused by other components, look at the{' '}
        <code> SelectedComponent </code>, which is a simple component that display the list of
        selected components.
      </p>
      <p>
        This table exposes just one callback that is called when the selection changes. In addition,
        you can pass the maximum number of elements that are selectable.
      </p>

      <p>
        The <code> &lt;PeriodicContext&gt;</code> component exposes a React Context object. You can
        use object to be notified of the current state of the table, and to change the state of the
        table. This allow you to build a component and then wire it to a periodic table. A typical
        use case is to display which components are selected, or compute a chart based on the
        selected component. See the Wired Table stories for an example
      </p>
    </div>
    <div style={{ margin: 10 }} />
    <div>
      {' '}
      For working with dash, you'll need to use the `setProps` function from the dash API in the
      <code> onStateChange </code> callback. This will notifity dash that something has changed
    </div>

    <PeriodicContext>
      <>
        <SelectedComponent />
        <SelectableTable
          onStateChange={a => console.log(a)}
          enabledElements={select('Enabled elements', elementOptions, [])}
          disabledElements={select('Disabled elements', elementOptions, [])}
          forceTableLayout={select(
            'forceTableLayout',
            [TableLayout.SPACED, TableLayout.COMPACT, TableLayout.MINI, TableLayout.MAP],
            TableLayout.SPACED
          )}
          maxElementSelectable={number('maxElementsSelectable', 1)}
          hiddenElements={select('Hidden elements', elementOptions, [])}
        />
      </>
    </PeriodicContext>
  </>
);

export const wiredTables = () => (
  <>
    <div>
      {' '}
      The <code> &lt;PeriodicContext&gt;</code> component can be used to wire two tables together{' '}
    </div>

    <PeriodicContext>
      <>
        <SelectableTable
          onStateChange={a => console.log(a)}
          enabledElements={[]}
          forceTableLayout={TableLayout.MINI}
          disabledElements={[]}
          maxElementSelectable={4}
          hiddenElements={[]}
        />

        <SelectableTable
          forceTableLayout={TableLayout.MAP}
          enabledElements={[]}
          disabledElements={[]}
          hiddenElements={[]}
          maxElementSelectable={4}
        />
      </>
    </PeriodicContext>
  </>
);

export const filteredTable = () => (
  <>
    <div>
      {' '}
      A filtered table. The <code> &lt;TableFilter&gt;</code> component leverages the provided
      context to update the table
    </div>
    <PeriodicContext>
      <>
        <SelectedComponent />
        <SelectableTable
          onStateChange={a => console.log(a)}
          enabledElements={[]}
          maxElementSelectable={1}
          disabledElements={[]}
          hiddenElements={[]}
        />
        <div style={{ margin: 10 }} />
        <TableFilter />
      </>
    </PeriodicContext>
  </>
);

const label = 'Elements';
const options = ['H', 'He', 'O', 'Pb', 'Xe', 'Fe', 'K', 'Na', 'Cl', 'La'];
const defaultValue = 'H';

export const component = () => (
  <>
    <div>
      <p> There are some cases when you might want to display just one standalone component. </p>
      <p>
        {' '}
        If you pass no <code>color</code>, the default element color will be used{' '}
      </p>
      <b>
        {' '}
        Some setting might not produce correct results. If you use detailed mode, you'll need to
        give a sufficient size to the component
      </b>
    </div>

    <StandalonePeriodicComponent
      size={number('Size', 50)}
      disabled={boolean('Disabled', false)}
      enabled={boolean('Enabled', false)}
      hidden={boolean('Hidden', false)}
      color={color('', '#AAAAAA')}
      displayMode={select(
        'Display Mode',
        [DISPLAY_MODE.DETAILED, DISPLAY_MODE.SIMPLE],
        DISPLAY_MODE.SIMPLE
      )}
      element={select(label, options, defaultValue)}
      onElementClicked={() => {}}
      onElementMouseOver={() => {}}
    />
  </>
);

function FormulaSelector(props) {
  const array = [
    { C: 16, H: 9, N: 4, Na: 3, O: 9, S: 2 },
    { C: 17, H: 20, N: 4, Na: 1, O: 9, P: 1 },
    {
      H: 1,
      C: 22,
      Fe: 14,
      K: 52,
      O: 12,
      Cl: 4,
      Be: 12,
      Pb: 7,
      F: 35,
      S: 18,
      N: 5,
      Zr: 22,
      Nb: 12,
      Mo: 45,
      Tc: 15,
      Cs: 4,
      Fr: 12,
      Mg: 50,
      Hs: 12,
      Bh: 3,
      Xe: 10,
      Rn: 20,
      Kr: 31,
      Ar: 41
    },
    { H: 2, O: 1 }
  ];

  const css = `
    li {
        padding: 10px;
        margin: 5px;
        border: 1px solid black;
        width: 150px;
        cursor: pointer;
    }
    ul {
        list-style: none;
    }
  `;

  return (
    <>
      <style>{css}</style>
      <ul>
        <li onClick={() => props.onFormulaClicked(array[0])}>C16H9N4Na3O9S2</li>
        <li onClick={() => props.onFormulaClicked(array[1])}>C17H20N4NaO9P</li>
        <li onClick={() => props.onFormulaClicked(array[2])}> Random heatmap </li>
        <li onClick={() => props.onFormulaClicked(array[3])}> H2O</li>
        <li onClick={() => props.onFormulaClicked({})}> No heatmap</li>
      </ul>
    </>
  );
}

export const heatmapTable = props => {
  const MIN = '#FF4422';
  const MAX = '#FFFF99';
  const [heatmap, setHeatmap] = useState({});

  return (
    <>
      <div>
        {' '}
        The periodic table can be rendered as an heatmap. You have to pass the color associated with
        the minimum and maximum value, and an dictionnary whose keys are symbol, and values a number
        that will be used to determine the color of the element. The component computes on the fly
        the color of the elements
      </div>
      <div>Click on one of the formula below to update the heatmap.</div>
      <div>
        <FormulaSelector onFormulaClicked={hm => setHeatmap(hm)} />
        <Table
          enabledElement={{}}
          disabledElement={{}}
          forceTableLayout={select(
            'forceTableLayout',
            [TableLayout.SPACED, TableLayout.COMPACT, TableLayout.MINI, TableLayout.MAP],
            TableLayout.SPACED
          )}
          heatmapMax={color('max', MAX)}
          heatmapMin={color('min', MIN)}
          heatmap={heatmap}
          colorScheme={
            select(
              'color-scheme',
              [...Object.keys(COLORSCHEME), 'none'],
              Object.keys(COLORSCHEME)[2]
            ) as keyof typeof COLORSCHEME
          }
          onElementClicked={() => {}}
          onElementMouseOver={() => {}}
          hiddenElement={{}}
        />
      </div>
    </>
  );
};

export default {
  component: SelectableTable,
  title: 'Periodic Table',
  decorators: [withKnobs],
  subcomponents: { TableFilter, Table, StandalonePeriodicComponent }
};
