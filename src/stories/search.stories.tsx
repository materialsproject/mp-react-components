import Grid from '../search-page/search-grid/card-grid';
import { withKnobs } from '@storybook/addon-knobs';
import * as React from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import { initialGrid } from '../search-page/search-grid/cards-definition';

export const search = () => (
  <>
    <div> Search WIP </div>
    <hr />
    <DndProvider backend={Backend}>
      <Grid initCards={initialGrid} onChange={() => {}} />
    </DndProvider>
  </>
);

export default {
  component: Grid,
  title: 'Search',
  decorators: [withKnobs],
  stories: []
};
