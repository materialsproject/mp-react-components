import React, { useEffect, useReducer, useRef, useState } from 'react';
import Masonry from 'react-masonry-css';
import './card-grid.less';
import SearchCard from './search-card';
import { addCard, Card, CardGridState, ItemTypes } from './cards-definition';
import { ConnectDropTarget, DropTarget, useDrop, DndProvider } from 'react-dnd';
import { SearchPalette } from '../palette/search-palette';
// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-buttons/dist/react-buttons.css';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import { ActionType, initState, reducer } from './grid-reducer';
import Backend from 'react-dnd-html5-backend';

const breakpointColumnsObj = {
  default: 3,
  1200: 3,
  900: 2,
  600: 1
};

export interface GridProps {
  connectDropTarget: ConnectDropTarget;
  allDefinitions: Card[];
  onChange: (change: CardGridState) => void;
  initCards: string[];
}

export const Grid: React.FC<GridProps> = ({
  connectDropTarget,
  onChange,
  initCards,
  allDefinitions
}) => {
  const ref = useRef(null);
  const initialSetting = useRef(true);

  const onChangeRef = useRef<Function>(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  //TODO(chab) current implementation is naive, we should just have the list of card values, with
  // a pointer to the definition, and an array that old the layout

  // we are making a lazy initialisation of the state, we e
  const [cards, dispatch] = useReducer(
    reducer,
    { initCards, onChangeRef, allDefinitions },
    initState
  );
  const [, drop] = useDrop({ accept: ItemTypes.CARD });
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!initialSetting.current) {
      dispatch({ type: ActionType.INIT, initCards, onChangeRef, allDefinitions });
      console.log('should call init state again');
    }
    initialSetting.current = false;
  }, [allDefinitions]);

  connectDropTarget(ref);

  // the issue with dispatch is that the upper component will
  // render, if you want to use useMemo, we can let the child update its state
  // and then memoize the array ( if the reference is the same, we do not render )
  // but we need to store the settings, the definition
  const children = cards.cardDef.map((card, idx) => (
    <SearchCard {...card} {...cards.cardSettings[idx]} key={card.id} dispatch={dispatch} />
  ));

  return (
    <>
      <div className={`search-funnel ${collapsed ? 'funnel-collapsed' : ''}`}>
        {/* Masonry inserts div, the issue is that the component is unmountend and remounted*/
        /* which leads to bad performance */}
        <SearchPalette
          filters={cards.allDefinitions}
          onFilterClick={c =>
            dispatch({ type: ActionType.SET_CARDS, cards: addCard(cards, c.id), meta: 'move' })
          }
          onCollapseClick={c => setCollapsed(c)}
        />
        {cards.cardDef.length === 0 && (
          <h1> You do not have any filters. Add a filter to start your search</h1>
        )}

        <div className="funnel-cards">
          {cards.heroCardDef && (
            <SearchCard {...cards.heroCardDef} {...cards.heroCardSetting} dispatch={dispatch} />
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
      </div>
    </>
  );
};

const DnDGrid = DropTarget(ItemTypes.CARD, {}, connect => ({
  connectDropTarget: connect.dropTarget()
}))(Grid);

export default DnDGrid;

// not sure how to handle the context, should we assume people set in dash, or should we provide
// a component ?
export const GridWithContext = (props: GridProps) => {
  return (
    <DndProvider backend={Backend}>
      <DnDGrid {...props} />
    </DndProvider>
  );
};

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
