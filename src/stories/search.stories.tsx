import Grid from '../search-page/card-grid';
import { withKnobs } from '@storybook/addon-knobs';
import JSONViewComponent from './scene.stories';
import * as React from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

export const search = () => (
  <>
    <div> Search WIP </div>
    <hr />
    <DndProvider backend={Backend}>
      <Grid onChange={() => {}} />
    </DndProvider>
  </>
);

export default {
  component: Grid,
  title: 'Search',
  decorators: [withKnobs],
  stories: []
};
