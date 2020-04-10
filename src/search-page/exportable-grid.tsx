import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import * as React from 'react';
import MGrid from './card-grid';

export default function() {
  return (
    <DndProvider backend={Backend}>
      <MGrid />
    </DndProvider>
  );
}
