import {
  CardState,
  CardGridState,
  sdeleteCard,
  sfindCard,
  smoveCard,
  Card,
  cardsDefinition,
  getStartStateFromCard,
  initialState
} from './cards-definition';

export enum ActionType {
  START_DRAG = 'startdragging',
  END_DRAG = 'enddragging',
  CANCEL_DRAG = 'canceldragging',
  SET_CARDS = 'setcards',
  COLLAPSE = 'colapse',
  DISABLE = 'disable',
  SET_VALUE = 'setValue',
  DELETE = 'delete',
  MOVE_CARD = 'move_card'
}

export const reducer = (state: CardGridState, action) => {
  switch (action.type as ActionType) {
    case ActionType.END_DRAG: {
      const card = state.map[action.id];
      card.dragging = false;
      return { ...state };
    }

    case ActionType.CANCEL_DRAG: {
      const card = state.map[action.id];
      card.dragging = false;
      console.log('moving back', action.id, state.dragInitialIndex);
      const ns = smoveCard(state, action.id, state.dragInitialIndex!);
      state.dragInitialIndex = null;
      return { ...ns };
    }
    case ActionType.START_DRAG: {
      const card = state.map[action.id];
      card.dragging = true;
      state.dragInitialIndex = sfindCard(state, action.id);
      console.log('moving now', action.id, state.dragInitialIndex);
      return { ...state };
    }
    case ActionType.SET_CARDS: {
      console.log('new state', action);
      if (!action.meta || action.meta !== 'move') state.onChangeRef!.current(state);
      return { ...action.cards };
    }
    case ActionType.COLLAPSE: {
      const card = state.map[action.id];
      card.collapsed = !card.collapsed;
      return { ...state };
    }
    case ActionType.DISABLE: {
      const card = state.map[action.id];
      card.disabled = !card.disabled;
      state.onChangeRef!.current(state);
      return { ...state };
    }
    case ActionType.DELETE: {
      const cardId = action.id;
      const card = state.map[action.id];
      const ns = sdeleteCard(state, cardId);
      card.state !== CardState.PRISTINE && state.onChangeRef!.current(ns);
      return { ...ns };
    }
    case ActionType.MOVE_CARD: {
      const { id, targetId } = action;
      const ns = smoveCard(state, id, sfindCard(state, targetId));
      return { ...ns };
    }
    case ActionType.SET_VALUE: {
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

export function initState({
  initCards: cards,
  onChangeRef,
  allDefinitions
}: {
  initCards: string[];
  onChangeRef: any;
  allDefinitions: Card[];
}): CardGridState {
  const cardIdToCardDefinition = cardsDefinition.reduce((acc, card) => {
    acc[card.id] = card;
    return acc;
  }, {});

  const state: CardGridState = cards.reduce(
    (state: any, card: string) => {
      const c: Card = cardIdToCardDefinition[card];
      const settings = getStartStateFromCard(c, cardIdToCardDefinition);
      if (c.hero) {
        state.heroCardDef = c;
        state.heroCardSetting = settings;
      } else {
        if (!c.activeInstance) {
          c.activeInstance = 0;
        }
        c.activeInstance++;
        state.cardDef = [...state.cardDef, c];
        state.cardSettings = [...state.cardSettings, settings];
      }
      state.map[c.id] = settings; // settings are directly updated from the component
      return state;
    },
    { ...initialState }
  );

  state.onChangeRef = onChangeRef;
  state.allDefinitions = allDefinitions;
  state.allDefinitionsMap = cardIdToCardDefinition;
  return state;
}
