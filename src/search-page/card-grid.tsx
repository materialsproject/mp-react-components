import React from 'react';
import Masonry from 'react-masonry-css';
import './card-grid.less';
import { SearchCard } from './search-card';
import { cardsDefinition } from './cards-definition';

const breakpointColumnsObj = {
  default: 3,
  1200: 3,
  900: 2,
  600: 1
};

export function Grid() {
  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      <div>
        {' '}
        <SearchCard {...cardsDefinition[0]} />{' '}
      </div>
      <div>
        {' '}
        <SearchCard {...cardsDefinition[1]} />{' '}
      </div>
      <div>
        {' '}
        <SearchCard {...cardsDefinition[2]} />{' '}
      </div>
      <div>
        {' '}
        <SearchCard {...cardsDefinition[3]} />{' '}
      </div>
    </Masonry>
  );
}
