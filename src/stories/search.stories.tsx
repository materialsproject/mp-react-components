import Grid from '../search-page/search-grid/card-grid';
import { withKnobs } from '@storybook/addon-knobs';
import * as React from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import { cardsDefinition, initialGrid } from '../search-page/search-grid/cards-definition';

export const search = () => (
  <>
    <div> Search WIP </div>
    <hr />
    <DndProvider backend={Backend}>
      <Grid
        allDefinitions={cardsDefinition}
        initCards={initialGrid}
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
