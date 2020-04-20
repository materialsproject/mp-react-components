import Grid from '../search-page/search-grid/card-grid';
import { object, withKnobs } from '@storybook/addon-knobs';
import * as React from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import { action } from '@storybook/addon-actions';
import { card } from './search-json/simple_form';
import cb from './search-json/checkbox';
import { sliders } from './search-json/sliders';
import { cardsDefinition } from './search-json/demo';

export const search = () => (
  <>
    <div> Search WIP</div>
    <hr />
    <DndProvider backend={Backend}>
      <Grid
        allDefinitions={object('cards', cardsDefinition)}
        initCards={object('start cards', ['Form', 'test', 'has_properties'])}
        onChange={action('state')}
      />
    </DndProvider>
  </>
);

export const SmallForm = () => (
  <>
    <div> Small Form </div>
    <hr />
    <DndProvider backend={Backend}>
      <Grid
        allDefinitions={object('cards', card)}
        initCards={object('start cards', [card[0].id])}
        onChange={action('state')}
      />
    </DndProvider>
  </>
);

export const CheckboxList = () => (
  <>
    <div> Checkbox</div>
    <hr />
    <DndProvider backend={Backend}>
      <Grid
        allDefinitions={object('cards', cb)}
        initCards={object('start cards', [cb[0].id])}
        onChange={action('state')}
      />
    </DndProvider>
  </>
);

export const SliderList = () => (
  <>
    <div> Sliders </div>
    <hr />
    <DndProvider backend={Backend}>
      <Grid
        allDefinitions={object('cards', sliders)}
        initCards={object('start cards', [sliders[0].id])}
        onChange={action('state')}
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
