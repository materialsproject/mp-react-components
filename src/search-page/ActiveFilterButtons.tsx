import React, { useState } from 'react';
import { Button } from 'react-bulma-components';

export interface ActiveFilter {
  id: string;
  displayName?: string;
  value: any;
  defaultValue: any;
}

interface Props {
  className?: string;
  filters: ActiveFilter[];
  onClick: (defaultValue: any, id: string) => any;
}

function formatValue(value: any) {
  if (Array.isArray(value) && value.length === 2) {
    return value[0] + ' to ' + value[1];
  } else {
    return value.toString();
  }
}

export const ActiveFilterButtons: React.FC<Props> = props => {
  return (
    <div className={props.className}>
      {props.filters.map((f, i) => (
        <Button key={i} onClick={() => props.onClick(f.defaultValue, f.id)}>
          {f.displayName ? f.displayName : f.id}: {formatValue(f.value)}
        </Button>
      ))}
    </div>
  );
};
