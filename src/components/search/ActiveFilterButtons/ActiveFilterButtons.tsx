import React, { useState } from 'react';
import { Button } from 'react-bulma-components';
import { FaTimes } from 'react-icons/fa';
import { ActiveFilter } from '../SearchUI/constants';

interface Props {
  className?: string;
  filters: ActiveFilter[];
  onClick: (defaultValue: any, id: string) => any;
}

function formatValue(value: any) {
  if (Array.isArray(value) && value.length === 2 && !isNaN(value[0])) {
    return value[0] + ' to ' + value[1];
  } else {
    return value.toString();
  }
}

export const ActiveFilterButtons: React.FC<Props> = props => {
  return (
    <div className={props.className}>
      <div className={props.filters.length > 0 ? 'columns' : ''}>
        {props.filters.map((f, i) => (
          <div className="column is-narrow" key={i}>
            <Button
              className="is-rounded is-small"
              onClick={() => props.onClick(f.defaultValue, f.id)}
            >
              <FaTimes />
              <span className="ml-1">
                {f.displayName ? f.displayName : f.id}: {formatValue(f.value)}
              </span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
