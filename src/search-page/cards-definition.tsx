import React from 'react';

export enum WIDGET {
  SLIDERS = 'SLIDER',
  CHECKBOX = 'CHECKBOX',
  CHECKBOX_LIST = 'CHECKBOX_LIST',
  SP_SEARCH = 'SP_SEARCH',
  TAG_SEARCH = 'TAG_SEARCH'
}

interface Widget {
  name?: string | null,
  latexName?: string | null,
  type: WIDGET;
  configuration: any;
}

export interface Card {
  title: string;
  widgets: Widget[];
  dragging?: boolean;
  id: string;
  activeInstance?: number;
  allowMultipleInstances: boolean;
}

export enum ItemTypes {
  CARD = 'CARD'
}

//TODO try to use a simple function to render
export const cardsDefinition: Card[] = [
  {
    title: 'General',
    id: 'general',
    allowMultipleInstances: false,
    widgets: [
      {
        type: WIDGET.SLIDERS,
        name: 'Band Gap Ev',
        configuration: {
          // we can add mode
          handle: 2,
          domain: [0, 10],
          step: 1
        }
      },
      {
        type: WIDGET.SLIDERS,
        name: "Energy Above Hull",
        configuration: {
          // we can add mode
          handle: 2,
          domain: [0, 6],
          step: 1
        }
      },
      {
        type: WIDGET.SLIDERS,
        name: "Formation Energy",
        configuration: {
          // we can add mode
          handle: 2,
          domain: [-4, 4],
          step: 1
        }
      },
      {
        type: WIDGET.SLIDERS,
        name: "# unit cells",
        configuration: {
          // we can add mode
          handle: 2,
          domain: [1, 296],
          step: 1
        }
      },
      {
        type: WIDGET.SLIDERS,
        name: "Density",
        configuration: {
          // we can add mode
          handle: 2,
          domain: [0, 24.6],
          step: 0.1
        }
      },
      {
        type: WIDGET.SLIDERS,
        name: "Volume",
        configuration: {
          // we can add mode
          handle: 2,
          domain: [7, 7698],
          step: 1
        }
      }
    ]
  },
  {
    title: 'Elasticity',
    id: 'elasticity',
    allowMultipleInstances: false,
    widgets: [
      {
        type: WIDGET.SLIDERS,
        name: "Poisson's Ratio",
        configuration: {
          // we can add mode
          handle: 2,
          domain: [-1, 0.5],
          step: 0.1
        }
      },
      {
        type: WIDGET.SLIDERS,
        name: "Elastic Anisotropy",
        configuration: {
          // we can add mode
          handle: 2,
          domain: [0, 398]
        }
      },
      {
        type: WIDGET.SLIDERS,
        name: 'Shear Modulus',
        latexName: '$\\text{G}_\\text{RVH}$',
        configuration: {
          // we can add mode
          handle: 2,
          domain: [2, 523]
        }
      },
      {
        type: WIDGET.SLIDERS,
        name: 'Bulk Modulus',
        latexName:'$\\text{K}_\\text{RVH}$',
        configuration: {
          // we can add mode
          handle: 2,
          domain: [6, 436]
        }
      }
    ]
  },
  {
    title: 'Dielectricity',
    id: 'dielectricity',
    allowMultipleInstances: false,
    widgets: [
      {
        type: WIDGET.SLIDERS,
        latexName: '$\\epsilon_{poly}{^\\infty}$',
        configuration: {
          domain: [1, 158]
        }
      },
      {
        type: WIDGET.SLIDERS,
        latexName: '$\\epsilon_{poly}$',
        configuration: {
          domain: [2, 257]
        }
      },
      {
        type: WIDGET.SLIDERS,
        name: 'Refractive index',
        configuration: {
          domain: [1, 17]
        }
      }
    ]
  },
  {
    title: 'Piezoelectricity',
    id: 'piezoelectricity',
    allowMultipleInstances: false,
    widgets: [
      {
        type: WIDGET.SLIDERS,
        name: 'Piezoelectric Modulus',
        latexName: '$\\lVert {e}_{ij} \\rVert_{\\max}$',
        configuration: {
          domain: [0, 46.2],
          step: 0.1
        }
      }
    ]
  },
  {
    title: 'Has properties',
    id: 'has_properties',
    allowMultipleInstances: false,
    widgets: [
      {
        type: WIDGET.CHECKBOX_LIST,
        name: null,
        configuration: {
          checkboxes: [
            {
              label: 'Elastic',
              name: 'elastic'
            },
            {
              label: 'Vibrational',
              name: 'vibrational'
            },
            {
              label: 'Dielectric',
              name: 'dielectric'
            },
            {
              label: 'Elec. structure',
              name: 'structure'
            }
          ]
        }
      }
    ]
  },
  {
    title: 'A filter',
    id: 'xzy',
    allowMultipleInstances: false,
    widgets: [
      {
        type: WIDGET.CHECKBOX_LIST,
        name: null,
        configuration: {
          checkboxes: [
            {
              label: 'Some content'
            }
          ]
        }
      }
    ]
  },
  {
    title: 'One more filter',
    id: 'xzy2',
    allowMultipleInstances: false,
    widgets: [
      {
        type: WIDGET.CHECKBOX_LIST,
        name: null,
        configuration: {
          checkboxes: [
            {
              label: 'More content'
            }
          ]
        }
      }
    ]
  },
  {
    title: 'Spacegroup search',
    id: 'space',
    allowMultipleInstances: false,
    widgets: [
      {
        type: WIDGET.SP_SEARCH,
        name: null,
        configuration: {}
      }
    ]
  },
  {
    title: 'Tag search',
    id: 'tag',
    allowMultipleInstances: false,
    widgets: [
      {
        type: WIDGET.TAG_SEARCH,
        name: null,
        configuration: {}
      }
    ]
  }
];
export const DICO = cardsDefinition.reduce((acc, card) => {
  acc[card.id] = card;
  return acc;
}, {});

const getStartStateFromCard = (id: string) => {
  const card = DICO[id];
  const collapsed = false;
  const disabled = false;
  const values: any[] = card.widgets.reduce((outerAcc, widget) => {
    switch (widget.type) {
      case WIDGET.CHECKBOX_LIST: {
        widget.configuration.checkboxes.forEach(() => outerAcc.push(false));
        break;
      }
      case WIDGET.SLIDERS: {
        outerAcc.push(widget.configuration.domain);
        break;
      }
    }
    return outerAcc;
  }, []);
  return { id, collapsed, disabled, values };
};

export interface CS {
  cardDef: Card[];
  cardSettings: { id: string; collapsed: boolean; disabled: boolean; values: any[] }[];
  map: any;
}

export function addCard(state: CS, id: string) {
  const definition = DICO[id];
  const settings = getStartStateFromCard(id);

  if (!definition.activeInstance) {
    definition.activeInstance = 0;
  }
  definition.activeInstance++;

  state.cardDef = [...state.cardDef, definition];
  state.cardSettings = [...state.cardSettings, settings];
  state.map[id] = settings; // settings are directly updated from the component
  return state;
}
export function sfindCard(state: CS, id: string) {
  return state.cardDef.findIndex(c => c.id === id);
}
export function sdeleteCard(state: CS, id: string) {
  const index = sfindCard(state, id);
  const definition = state.cardDef.splice(index, 1);
  definition[0].activeInstance!--;
  state.cardSettings.splice(index, 1);
  state.cardDef = [...state.cardDef];
  state.cardSettings = [...state.cardSettings];
  delete state.map[id];
  return state;
}

export function smoveCard(state: CS, id: string, atIndex: number) {
  const index = sfindCard(state, id);
  const array = [...state.cardDef];
  const card = array.splice(index, 1);
  array.splice(atIndex, 0, card[0]);
  const array2 = [...state.cardSettings];
  const card2 = array2.splice(index, 1);
  array2.splice(atIndex, 0, card2[0]);
  state.cardDef = array;
  state.cardSettings = array2;
  return state;
}

export const initialState: CS = {
  cardDef: [],
  cardSettings: [],
  map: {}
};

addCard(initialState, 'elasticity');
addCard(initialState, 'dielectricity');
addCard(initialState, 'piezoelectricity');
addCard(initialState, 'has_properties');
addCard(initialState, 'space');
addCard(initialState, 'tag');

// state is composed of
//  - > [ {cardDef, cardSettings } ]
// and a dico that points to the settings
