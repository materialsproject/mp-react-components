import React from 'react';

export enum WIDGET {
  SLIDERS = 'SLIDER',
  CHECKBOX = 'CHECKBOX',
  CHECKBOX_LIST = 'CHECKBOX_LIST'
}

interface Widget {
  name: (() => any) | null;
  type: WIDGET;
  configuration: any;
}

export interface Card {
  title: string;
  widgets: Widget[];
  dragging?: boolean;
  id: string;
}

export enum ItemTypes {
  CARD = 'CARD'
}

//TODO try to use a simple function to render
export const cardsDefinition: Card[] = [
  {
    title: 'Elasticity',
    id: 'elasticity',
    widgets: [
      {
        type: WIDGET.SLIDERS,
        name: () => <span>Poisson's Ratio</span>,
        configuration: {
          // we can add mode
          handle: 2,
          domain: [-1, 0.5],
          step: 0.1
        }
      },
      {
        type: WIDGET.SLIDERS,
        name: () => <span>Elastic Anisotropy</span>,
        configuration: {
          // we can add mode
          handle: 2,
          domain: [0, 398]
        }
      },
      {
        type: WIDGET.SLIDERS,
        name: () => (
          <span>
            {' '}
            Shear Modulus G<sub>RVH</sub>
          </span>
        ),
        configuration: {
          // we can add mode
          handle: 2,
          domain: [2, 523]
        }
      },
      {
        type: WIDGET.SLIDERS,
        name: () => (
          <span>
            Bulk Modulus K<sub>RVH</sub>
          </span>
        ),
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
    widgets: [
      {
        type: WIDGET.SLIDERS,
        name: () => (
          <span>
            {' '}
            <em>ε</em>
            <sub>poly</sub>
            <sup>∞</sup>
          </span>
        ),
        configuration: {
          domain: [1, 158]
        }
      },
      {
        type: WIDGET.SLIDERS,
        name: () => (
          <span>
            {' '}
            <em>ε</em>
            <sub>poly</sub>
            <sup>∞</sup>
          </span>
        ),
        configuration: {
          domain: [2, 257]
        }
      },
      {
        type: WIDGET.SLIDERS,
        name: () => <span>Refractive index</span>,
        configuration: {
          domain: [1, 17]
        }
      }
    ]
  },
  {
    title: 'Piezoelectricity',
    id: 'piezoelectricity',
    widgets: [
      {
        type: WIDGET.SLIDERS,
        name: () => (
          <span>
            Piezoelectric Modulus ‖<em>e</em>
            <sub>ij</sub>‖<sub>max</sub>
          </span>
        ),
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
  state.cardDef.splice(index, 1);
  state.cardSettings.splice(index, 1);
  state.cardDef = [...state.cardDef];
  state.cardSettings = [...state.cardSettings];
  delete state.map[id];
  return state;
}

export function smoveCard(state: CS, id: string, atIndex: number) {
  console.log(atIndex);
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

// state is composed of
//  - > [ {cardDef, cardSettings } ]
// and a dico that points to the settings
