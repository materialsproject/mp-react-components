import { AiOutlineFullscreen, AiOutlineFullscreenExit } from 'react-icons/ai';
import React, { useState } from 'react';
import './search-palette.less';
import { Card } from '../cards-definition';

const isDisabled = filter =>
  !filter.allowMultipleInstances && filter.activeInstance && filter.activeInstance > 0;

export function SearchPalette({ filters, onFilterClick }) {
  const [isCollapsed, setCollapsed] = useState(false);

  return (
    <div className={`search-palette ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="search-palette-header">
        <div>{!isCollapsed ? 'Add filters to your search' : ''}</div>
        <div onClick={() => setCollapsed(!isCollapsed)}>
          {isCollapsed ? <AiOutlineFullscreen key="a" /> : <AiOutlineFullscreenExit key="b" />}
        </div>
      </div>
      <div className="filters">
        {filters.map((filter: Card) => (
          <div
            className={isDisabled(filter) ? 'filter disabled' : 'filter'}
            key={filter.id}
            onClick={() => !isDisabled(filter) && onFilterClick(filter)}
          >
            {filter.title}
          </div>
        ))}
      </div>
    </div>
  );
}
