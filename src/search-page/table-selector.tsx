import { useContext, useEffect, useState } from 'react';
import { PeriodicSelectionContext } from '../periodic-table/periodic-table-state/table-store';
import { Button, ButtonGroup } from '@zendeskgarden/react-buttons';
import React from 'react';

export default function TableSelectionSelector() {
  const [selectedItem, setSelectedItem] = useState('select');
  const { actions } = useContext(PeriodicSelectionContext);

  return (
    <ButtonGroup
      selectedItem={selectedItem}
      onSelect={s => {
        // there is a bug in zendesk
        window.requestAnimationFrame(() => setSelectedItem(s));
        actions.selectionStyle = s;
      }}
    >
      <Button key="i1" value="select">
        {' '}
        Enable elements{' '}
      </Button>
      <Button key="i2" value="enableDisable">
        {' '}
        Exclude elements{' '}
      </Button>
    </ButtonGroup>
  );
}
