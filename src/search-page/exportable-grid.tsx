import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import * as React from 'react';
import MGrid from './card-grid';

export default function ExportableGrid() {
  return (
    <DndProvider backend={Backend}>
      <MGrid
        onChange={c => {
          console.log(c);
        }}
      />
    </DndProvider>
  );
}
