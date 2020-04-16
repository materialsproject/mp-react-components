import { CardState, CS, sdeleteCard, sfindCard, smoveCard } from './cards-definition';

export const reducer = (state: CS, action: any) => {
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
