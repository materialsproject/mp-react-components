import React, { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import Masonry from 'react-masonry-css';
import './card-grid.less';
import SearchCard from './search-card';
import {
  addCard,
  cardsDefinition,
  CardState,
  CS,
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

const reducer = (state: CS, action: any) => {
  switch (action.type) {
    case 'enddragging': {
      console.log('the end', action.id);
      const card = state.map[action.id];
      card.dragging = false;
      return { ...state };
    }

    case 'canceldragging': {
      const card = state.map[action.id];
      card.dragging = false;
      console.log('moving back', action.id, state.dragInitialIndex);
      const ns = smoveCard(state, action.id, state.dragInitialIndex!);
      state.dragInitialIndex = null;
      return { ...ns };
    }
    case 'startdragging': {
      const card = state.map[action.id];
      card.dragging = true;
      state.dragInitialIndex = sfindCard(state, action.id);
      console.log('moving now', action.id, state.dragInitialIndex);
      return { ...state };
    }
    case 'setcards': {
      console.log('new state', action);
      if (!action.meta || action.meta !== 'move') state.onChangeRef!.current(state);
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
      state.onChangeRef!.current(state);
      return { ...state };
    }
    case 'deleteCard': {
      const cardId = action.id;
      const card = state.map[action.id];
      const ns = sdeleteCard(state, cardId);
      card.state !== CardState.PRISTINE && state.onChangeRef!.current(ns);
      return { ...ns };
    }
    case 'moveCard': {
      const { id, targetId } = action;
      const ns = smoveCard(state, id, sfindCard(state, targetId));
      return { ...ns };
    }
    case 'setValue': {
      // expect cardId, widgetId, and value index
      const { id, idx, value } = action;
      const card = state.map[action.id];
      card.state = CardState.DIRTY;
      card.values[idx] = value;
      card.widgetState[idx] = CardState.DIRTY;
      console.log('overall state', state);
      state.onChangeRef!.current(state);
      return { ...state };
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

  //TODO(chab) current implementation is naive, we should just have the list of card values, with
  // a pointer to the definition, and an array that old the layout
  const [cards, dispatch] = useReducer(reducer, { ...startState, onChangeRef });
  const [, drop] = useDrop({ accept: ItemTypes.CARD });

  connectDropTarget(ref);

  // the issue with dispatch is that the upper component will
  // render, if you want to use useMemo, we can let the child update its state
  // and then memoize the array ( if the reference is the same, we do not render )
  const children = cards.cardDef.map((card, idx) => (
    <SearchCard {...card} {...cards.cardSettings[idx]} key={card.id} dispatch={dispatch} />
  ));

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

        {cards.heroCardDef ? (
          <SearchCard {...cards.heroCardDef} {...cards.heroCardSetting} dispatch={dispatch} />
        ) : (
          ''
        )}

        <div className="drag-zone" ref={drop}>
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {children}
          </Masonry>
        </div>
      </div>
    </>
  );
};

export default DropTarget(ItemTypes.CARD, {}, connect => ({
  connectDropTarget: connect.dropTarget()
}))(Grid);

/////////////////////////////////
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
