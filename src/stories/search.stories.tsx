import Grid from '../search-page/search-grid/card-grid';
import { withKnobs } from '@storybook/addon-knobs';
import * as React from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import { Card, WIDGET } from '../search-page/search-grid/cards-definition';

// Those are some defaults you can use
const cardsDefinition: Card[] = [
  {
    title: 'Periodic table',
    id: 'periodic',
    hero: true,
    permanent: true,
    bypassIdForKey: true,
    allowMultipleInstances: false,
    widgets: [
      {
        type: WIDGET.PERIODIC_TABLE,
        id: 'sp',
        configuration: {
          hiddenElements: [],
          disabledElements: [],
          enabledElements: []
        }
      }
    ]
  },
  {
    title: 'General',
    id: 'general',
    bypassIdForKey: true,
    allowMultipleInstances: false,
    widgets: [
      {
        type: WIDGET.SLIDERS,
        name: 'Band Gap Ev',
        id: 'band_gap',
        configuration: {
          // we can add mode
          handle: 2,
          domain: [0, 10],
          step: 1
        }
      },
      {
        type: WIDGET.SLIDERS,
        name: 'Energy Above Hull',
        id: 'e_above_hull',
        configuration: {
          // we can add mode
          handle: 2,
          domain: [0, 6],
          step: 1
        }
      }
    ]
  },
  {
    title: 'Some filter',
    id: 'test',
    bypassIdForKey: true,
    allowMultipleInstances: false,
    widgets: [
      {
        type: WIDGET.SLIDERS,
        name: 'Test one',
        id: 't1',
        configuration: {
          // we can add mode
          handle: 1,
          domain: [0, 10],
          step: 1
        }
      },
      {
        type: WIDGET.SLIDERS,
        name: 'Test two',
        id: 't2',
        configuration: {
          // we can add mode
          handle: 2,
          domain: [10, 50],
          step: 0.5
        }
      }
    ]
  }
];

export const search = () => (
  <>
    <div> Search WIP </div>
    <hr />
    <DndProvider backend={Backend}>
      <Grid
        allDefinitions={cardsDefinition}
        initCards={['periodic']}
        onChange={c => {
          console.log(c);
        }}
      />
    </DndProvider>
  </>
);

export default {
  component: Grid,
  title: 'Search',
  decorators: [withKnobs],
  stories: []
};
