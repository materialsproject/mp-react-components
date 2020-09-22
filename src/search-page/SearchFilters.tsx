import React, { useState, useEffect } from 'react';
import { PeriodicContext } from '../periodic-table/periodic-table-state/periodic-selection-context';
import { SelectableTable } from '../periodic-table/table-state';
import { TableLayout } from '../periodic-table/periodic-table-component/periodic-table.component';
import { ElementsInput } from './ElementsInput/ElementsInput';
import { useMaterialsSearch } from './MaterialsSearchProvider';
import { Button } from 'react-bulma-components';

interface Props {
  className: string
}

export const SearchFilters: React.FC<Props> = (props) => {
  const { state, actions } = useMaterialsSearch();
  return (
    <div className={props.className}>
      <div>
        <PeriodicContext>
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
        </PeriodicContext>
      </div>
      <div style={{marginTop: '15px'}}>
        <Button onClick={actions.getData} className="is-primary" style={{marginRight: '5px'}}>Apply</Button>
        <Button onClick={actions.reset}>Reset</Button>
      </div>
    </div>
  );
}