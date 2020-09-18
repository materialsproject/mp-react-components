import React, { useState, useEffect } from 'react';
import { PeriodicContext } from '../periodic-table/periodic-table-state/periodic-selection-context';
import { SelectableTable } from '../periodic-table/table-state';
import { TableLayout } from '../periodic-table/periodic-table-component/periodic-table.component';
import { ElementsInput } from './ElementsInput/ElementsInput';
import { SearchFiltersProvider } from './SearchFiltersProvider';

export const SearchFilters = () => {
  return (
    <SearchFiltersProvider>
      <PeriodicContext>
        <div>
          <ElementsInput />
          <SelectableTable
            maxElementSelectable={20}
            forceTableLayout={TableLayout.MINI}
            hiddenElements={[]}
            onStateChange={enabledElements => {
              Object.keys(enabledElements).filter(el => enabledElements[el]);
            }}
            enabledElements={['Co']}
            disabledElements={['H', 'C']}
          />
        </div>
      </PeriodicContext>
    </SearchFiltersProvider>
  );
}