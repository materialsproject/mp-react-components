import React, { useState } from 'react';
import { Button } from 'react-bulma-components';
import { FaTimes } from 'react-icons/fa';
import { filter } from 'rxjs/operators';
import { ActiveFilter } from '../SearchUI/types';
import { formatPointGroup } from '../utils';

interface Props {
  className?: string;
  filters: ActiveFilter[];
  onClick: (defaultValue: any, id: string) => any;
}

const formatValue = (filter: ActiveFilter) => {
  if (Array.isArray(filter.value) && filter.value.length === 2 && !isNaN(filter.value[0])) {
    return filter.value[0] + ' to ' + filter.value[1];
  } else if (filter.id === 'pointgroup') {
    return formatPointGroup(filter.value);
  } else {
    return filter.value.toString();
  }
};

export const ActiveFilterButtons: React.FC<Props> = props => {
  return (
    <div className={props.filters.length > 0 ? 'columns is-multiline column m-0 p-0' : ''}>
      {props.filters.map((f, i) => (
        <div className="column is-narrow p-0 mr-2 mb-2" key={i}>
          <Button
            className="is-rounded is-small"
            onClick={() => props.onClick(f.defaultValue, f.id)}
          >
            <FaTimes />
            <span className="ml-1">
              {f.displayName}: {formatValue(f)}
            </span>
          </Button>
        </div>
      ))}
    </div>
  );
};
