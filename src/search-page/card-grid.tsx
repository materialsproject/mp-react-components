import React, { useState, useRef } from 'react';
import Masonry from 'react-masonry-css';
import './card-grid.less';
import SearchCard from './search-card';
import { cardsDefinition, ItemTypes } from './cards-definition';
import { ConnectDropTarget, DropTarget, useDrop } from 'react-dnd';

const breakpointColumnsObj = {
  default: 3,
  1200: 3,
  900: 2,
  600: 1
};

export interface GridProps {
  connectDropTarget: ConnectDropTarget;
}

export interface GridState {
  cards: any[];
}

const startState = cardsDefinition.slice(0, 3);

const addCard = (state, newCard) => {
  return [...state, newCard];
};

const Grid: React.FC<GridProps> = ({ connectDropTarget }) => {
  const ref = useRef(null);
  const [cards, setCards] = useState([...startState]);

  // TODO (pass cards and setCards and pull out)
  const moveCard = (id: string, atIndex: number) => {
    const { card, index } = findCard(id);
    const array = [...cards];
    array.splice(index, 1);
    array.splice(atIndex, 0, card);
    console.log(array);
    setCards(array);
  };

  const findCard = (id: string) => {
    const card = cards.filter(c => `${c.id}` === id)[0];
    return {
      card,
      index: cards.indexOf(card)
    };
  };

  const [, drop] = useDrop({ accept: ItemTypes.CARD });

  connectDropTarget(ref);

  return (
    <>
      <div>
        Add filters
        <button onClick={() => setCards(addCard(cards, cardsDefinition[3]))}> XZY Filter </button>
        <button onClick={() => setCards(addCard(cards, cardsDefinition[4]))}> Has Propery </button>
        <button onClick={() => setCards(addCard(cards, cardsDefinition[5]))}>
          {' '}
          Has Property2{' '}
        </button>
      </div>
      {/* Masonry inserts div, the issue is that the component is unmountend and remounted*/
      /* which leads to bad performance */}
      <div ref={drop}>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {cards.map(card => (
            <SearchCard {...card} key={card.id} moveCard={moveCard} findCard={findCard} />
          ))}
        </Masonry>
      </div>
    </>
  );
};

export default DropTarget(ItemTypes.CARD, {}, connect => ({
  connectDropTarget: connect.dropTarget()
}))(Grid);
