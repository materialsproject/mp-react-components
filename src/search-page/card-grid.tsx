import React, { useRef, useReducer, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import './card-grid.less';
import SearchCard from './search-card';
import {
  addCard,
  cardsDefinition,
  CardState,
  initialState,
  ItemTypes,
  sdeleteCard,
  sfindCard,
  smoveCard
} from './cards-definition';
import { ConnectDropTarget, DropTarget, useDrop } from 'react-dnd';
import { SearchPalette } from './palette/search-palette';

// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-buttons/dist/react-buttons.css';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';

const breakpointColumnsObj = {
  default: 3,
  1200: 3,
  900: 2,
  600: 1
};

export interface GridProps {
  connectDropTarget: ConnectDropTarget;
  onChange: any;
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
      if (!action.meta || action.meta !== 'move') state.onChangeRef.current(state);
      return { ...action.cards };
    }
    case 'collapse': {
      const card = state.map[action.id];
      card.collapsed = !card.collapsed;
      return { ...state };
    }
    case 'disable': {
      const card = state.map[action.id];
      card.disabled = !card.disabled;
      state.onChangeRef.current(state);
      return { ...state };
    }
    case 'setValue': {
      // expect cardId, widgetId, and value index
      const { id, idx, value } = action;
      const card = state.map[action.id];
      card.state = CardState.DIRTY;
      card.values[idx] = value;
      console.log('overall state', state);
      state.onChangeRef.current(state);
      return { ...state };
      break;
    }

    default:
      throw new Error('incorrect action' + action.type);
  }
};

export const Grid: React.FC<GridProps> = ({ connectDropTarget, onChange }) => {
  const ref = useRef(null);
  const onChangeRef = useRef<Function>(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const [cards, dispatch] = useReducer(reducer, { ...startState, onChangeRef });

  // TODO (pass cards and setCards and pull out)
  const moveCard = (id: string, atIndex: number) => {
    dispatch({ type: 'setcards', cards: smoveCard(cards, id, atIndex), meta: 'move' });
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
        <SearchPalette
          filters={cardsDefinition}
          onFilterClick={c =>
            dispatch({ type: 'setcards', cards: addCard(cards, c.id), meta: 'move' })
          }
        />
        {cards.cardDef.length === 0 ? (
          <h1> You do not have any filters. Add a filter to start your search</h1>
        ) : (
          ''
        )}
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
      </div>
    </>
  );
};

export default DropTarget(ItemTypes.CARD, {}, connect => ({
  connectDropTarget: connect.dropTarget()
}))(Grid);

// sliders.. take $gte and $lte
// spacegroups.. just put everything in
const query = {
  volume: { $gte: 4527, $lte: 7698 },
  density: { $gte: 13.6, $lte: 24.6 },
  nsites: { $gte: 187, $lte: 296 },
  formation_energy_per_atom: { $gte: 1.54, $lte: 4 },
  e_above_hull: { $gte: 0, $lte: 3.74 },
  band_gap: { $gte: 0, $lte: 3.2 },
  crystal_system: { $in: ['hexagonal', 'monoclinic'] },
  'spacegroup.number': { $in: ['0', '1', '2'] },
  'spacegroup.symbol': { $in: ['C222', 'Cmcm', 'Cmm2', 'Cmme'] },
  nelements: 2,
  elements: 'Re-Ru-Pd-Cd-Ir'
};

// in dielectricity
//"diel.pot_ferroelectric":true}

// Tags
// "tags":"[\"dsfds\"]"

// External provenance
//"has_icsd_id":true,"has_icsd_exptl_id":true}

/*
const mapDispatch => dispatch => ({
  reset: () => dispatch({ type: 'reset' }),
  addTest: () => dispatch({ type: 'addTest' }),
  removeTest: () => dispatch({ type: 'removeTest' })
})

const Button = (props) => (
  <button
    type="button"
    onClick={props.onClick}>
    {props.children}
  </button>
);

const App = () => {
  const [state, dispatch] = getReducer();
  const actions = mapDispatch(dispatch)
  return (
    <React.Fragment>
      {state.test}
      <Button onClick={actions.addTest}>Add 1</Button>
      <Button onClick={actions.removeTest}>Remove 1</Button>
      <Button onClick={actions.reset}>Reset</Button>
    </React.Fragment>
  );
};
 */
