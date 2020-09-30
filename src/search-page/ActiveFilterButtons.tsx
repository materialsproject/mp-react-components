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

export const ActiveFilterButtons: React.FC<Props> = props => {
  console.log(props.filters);
  return (
    <div className={props.className}>
      {props.filters.map((f, i) => (
        <Button key={i} onClick={() => props.onClick(f.defaultValue, f.id)}>
          {f.displayName ? f.displayName : f.id} {f.value.toString()}
        </Button>
      ))}
    </div>
  );
};
