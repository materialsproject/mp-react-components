import React, { useRef, useReducer } from 'react';
import Masonry from 'react-masonry-css';
import './card-grid.less';
import SearchCard from './search-card';
import {
  addCard,
  cardsDefinition,
  initialState,
  ItemTypes,
  sdeleteCard,
  sfindCard,
  smoveCard
} from './cards-definition';
import { ConnectDropTarget, DropTarget, useDrop } from 'react-dnd';
import { SearchPalette } from './palette/search-palette';

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

const startState = initialState;

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'enddragging': {
      const card = state.map[action.id];
      card.dragging = false;
      return { ...state };
    }
    case 'startdragging': {
      const card = state.map[action.id];
      card.dragging = true;
      return { ...state };
    }
    case 'setcards': {
      console.log('new state', action);
      return { ...action.cards };
    }
    case 'collapse': {
      const card = state.map[action.id];
      card.collapsed = !card.collapsed;
      return { ...state };
    }
    case 'disable': {
      const card = state.map[action.id];
      card.collapsed = !card.collapsed;
      return { ...state };
    }
    case 'setValue': {
      // expect cardId, widgetId, and value index
      const { id, idx, value } = action;
      const card = state.map[action.id];
      card.values[idx] = value;
      console.log('overall state', state);
      return { ...state };
      break;
    }

    default:
      throw new Error('incorrect action' + action.type);
  }
};

const filters = [{ name: 'a' }, { name: 'b' }];
export const Grid: React.FC<GridProps> = ({ connectDropTarget }) => {
  const ref = useRef(null);
  const [cards, dispatch] = useReducer(reducer, startState);

  // TODO (pass cards and setCards and pull out)
  const moveCard = (id: string, atIndex: number) => {
    dispatch({ type: 'setcards', cards: smoveCard(cards, id, atIndex) });
  };

  const findCard = (id: string) => {
    const index = sfindCard(cards, id);
    return {
      index: index
    };
  };

  const [, drop] = useDrop({ accept: ItemTypes.CARD });
  const deleteCard = (id: string) => {
    dispatch({ type: 'setcards', cards: sdeleteCard(cards, id) });
  };

  connectDropTarget(ref);

  return (
    <>
      <div className="search-funnel">
        {/* Masonry inserts div, the issue is that the component is unmountend and remounted*/
        /* which leads to bad performance */}
        <div className="drag-zone" ref={drop}>
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {cards.cardDef.map((card, idx) => (
              <SearchCard
                {...card}
                {...cards.cardSettings[idx]}
                key={card.id}
                deleteCard={deleteCard}
                moveCard={moveCard}
                dispatch={dispatch}
                findCard={findCard}
              />
            ))}
          </Masonry>
        </div>
        <SearchPalette
          filters={cardsDefinition}
          onFilterClick={c => dispatch({ type: 'setcards', cards: addCard(cards, c.id) })}
        />
      </div>
    </>
  );
};

export default DropTarget(ItemTypes.CARD, {}, connect => ({
  connectDropTarget: connect.dropTarget()
}))(Grid);
