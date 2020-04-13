import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import * as React from 'react';
import { useContext, useState } from 'react';
import MGrid from './card-grid';
import { Card, CardState, Widget, WIDGET } from './cards-definition';
import { PeriodicContext, SelectableTable } from '../periodic-table';
import { TableLayout } from '../periodic-table/periodic-table-component/periodic-table.component';
import { PeriodicSelectionContext } from '../periodic-table/periodic-table-state/table-store';

const cb = c => {};

export default function ExportableGrid() {
  const [selectionStyle, setSelectionStyle] = useState('select');
  const { observable, actions } = useContext(PeriodicSelectionContext);

  return (
    <>
      <div className="form-check">
        <label>
          <input
            type="radio"
            name="selection-style"
            value="select"
            checked={selectionStyle === 'select'}
            className="form-check-input"
            onChange={() => {}}
          />
          Choose elements to include on the search
        </label>
      </div>

      <div className="form-check">
        <label>
          <input
            type="radio"
            name="selection-style"
            value="enableDisable"
            checked={selectionStyle === 'enableDisable'}
            onChange={() => {}}
          />
          Choose elements to not include the search
        </label>
      </div>

      <PeriodicContext>
        <SelectableTable
          maxElementSelectable={2}
          forceTableLayout={TableLayout.COMPACT}
          hiddenElements={[]}
          enabledElements={[]}
          onStateChange={cb}
          disabledElements={[]}
        />
      </PeriodicContext>

      <DndProvider backend={Backend}>
        <MGrid
          onChange={c => {
            const query = {};
            // filter cards
            const cards = c.cardSettings.reduce((acc, card, idx) => {
              if (card.state !== CardState.PRISTINE && !card.disabled) {
                acc.push({ cardDef: c.cardDef[idx], cardSettings: card });
              }
              return acc;
            }, []);
            // write mongodb query

            cards.forEach(card => {
              // look at card widget
              const def: Card = card.cardDef;
              def.widgets.forEach((widget: Widget, widgetIndex) => {
                if (widget.type === WIDGET.SLIDERS) {
                  const key = widget.id;
                  query[key] = {
                    $gte: card.cardSettings.values[widgetIndex][0],
                    $lte: card.cardSettings.values[widgetIndex][1]
                  };
                } else if (widget.type === WIDGET.TAG_SEARCH) {
                  query[card.cardSettings.id] = card.cardSettings.values[widgetIndex];
                } else if (widget.type === WIDGET.SP_SEARCH) {
                  const spaceGroups = card.cardSettings.values[widgetIndex];
                  query['spacegroup.number'] = {
                    $in: spaceGroups.map(s => s['space-group.number'])
                  };
                } else if (widget.type === WIDGET.CHECKBOX_LIST) {
                  //TODO(chab) fix the update logic of the widget.
                  console.log(card.cardSettings, card.cardDef);
                  query['provenance'] = card.cardSettings.values[0];
                }
              });
            });
            console.log(query);
          }}
        />
      </DndProvider>
    </>
  );
}
