import React from 'react';

export enum WIDGET {
  SLIDERS = 'SLIDER',
  CHECKBOX = 'CHECKBOX',
  CHECKBOX_LIST = 'CHECKBOX_LIST',
  SP_SEARCH = 'SP_SEARCH',
  TAG_SEARCH = 'TAG_SEARCH',
  PERIODIC_TABLE = 'PERIODIC_TABLE'
}

export enum CardState {
  PRISTINE = 'pristine',
  DIRTY = 'dirty'
}

export interface Widget {
  name?: string | null;
  latexName?: string | null;
  type: WIDGET;
  id: string;
  configuration: any;
}

export interface Card {
  hero?: boolean; // an hero card take all the width
  title: string;
  widgets: Widget[];
  bypassIdForKey?: true;
  dragging?: boolean;
  permanent?: boolean;
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
    title: 'Periodic table',
    id: 'periodic',
    hero: true,
    permanent: true,
    bypassIdForKey: true,
    allowMultipleInstances: false,
    widgets: [
      {
        type: WIDGET.PERIODIC_TABLE,
        id: 'sp',
        configuration: {
          hiddenElements: [],
          disabledElements: [],
          enabledElements: []
        }
      }
    ]
  },
  {
    title: 'General',
    id: 'general',
    bypassIdForKey: true,
    allowMultipleInstances: false,
    widgets: [
      {
        type: WIDGET.SLIDERS,
        name: 'Band Gap Ev',
        id: 'band_gap',
        configuration: {
          // we can add mode
          handle: 2,
          domain: [0, 10],
          step: 1
        }
      },
      {
        type: WIDGET.SLIDERS,
        name: 'Energy Above Hull',
        id: 'e_above_hull',
        configuration: {
          // we can add mode
          handle: 2,
          domain: [0, 6],
          step: 1
        }
      },
      {
        type: WIDGET.SLIDERS,
        name: 'Formation Energy',
        id: 'formation_energy_per_atom',
        configuration: {
          // we can add mode
          handle: 2,
          domain: [-4, 4],
          step: 1
        }
      },
      {
        type: WIDGET.SLIDERS,
        name: '# unit cells',
        id: 'nsites',
        configuration: {
          // we can add mode
          handle: 2,
          domain: [1, 296],
          step: 1
        }
      },
      {
        type: WIDGET.SLIDERS,
        name: 'Density',
        id: 'density',
        configuration: {
          // we can add mode
          handle: 2,
          domain: [0, 24.6],
          step: 0.1
        }
      },
      {
        type: WIDGET.SLIDERS,
        name: 'Volume',
        id: 'volume',
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
        id: 'homogeneous_poisson',
        configuration: {
          // we can add mode
          handle: 2,
          domain: [-1, 0.5],
          step: 0.1
        }
      },
      {
        type: WIDGET.SLIDERS,
        name: 'Elastic Anisotropy',
        id: 'universal_anisotropy',
        configuration: {
          // we can add mode
          handle: 2,
          domain: [0, 398]
        }
      },
      {
        type: WIDGET.SLIDERS,
        name: 'Shear Modulus',
        id: 'G_Voigt_Reuss_Hill',
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
        latexName: '$\\text{K}_\\text{RVH}$',
        id: 'K_Voigt_Reuss_Hill',
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
    id: 'diel',
    allowMultipleInstances: false,
    widgets: [
      {
        type: WIDGET.SLIDERS,
        id: 'n',
        latexName: '$\\epsilon_{poly}{^\\infty}$',
        configuration: {
          domain: [1, 158]
        }
      },
      {
        type: WIDGET.SLIDERS,
        id: 'poly_total',
        latexName: '$\\epsilon_{poly}$',
        configuration: {
          domain: [2, 257]
        }
      },
      {
        type: WIDGET.SLIDERS,
        id: 'poly_electronic',
        name: 'Refractive index',
        configuration: {
          domain: [1, 17]
        }
      }
    ]
  },
  {
    title: 'Piezoelectricity',
    id: 'piezo',
    allowMultipleInstances: false,
    widgets: [
      {
        type: WIDGET.SLIDERS,
        id: 'eij_max',
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
    title: 'External Provenance',
    id: 'provenance',
    allowMultipleInstances: false,
    widgets: [
      {
        type: WIDGET.CHECKBOX_LIST,
        name: null,
        id: 'ck',
        configuration: {
          checkboxes: [
            {
              label: 'ICSD',
              name: 'has_icsd_id'
            },
            {
              label: 'Expt. ICSD',
              name: 'has_icsd_exptl_id'
            }
          ]
        }
      }
    ]
  },
  /*{
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
  */
  {
    title: 'Spacegroup search',
    id: 'space', // ID are extrapolated from the data itself
    allowMultipleInstances: false,
    widgets: [
      {
        id: 'spacegroup',
        type: WIDGET.SP_SEARCH,
        name: null,
        configuration: {}
      }
    ]
  },
  {
    title: 'Tag search',
    id: 'tags',
    allowMultipleInstances: false,
    widgets: [
      {
        id: 'tags',
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
  const widgetState: CardState[] = [];
  const values: any[] = card.widgets.reduce((outerAcc, widget) => {
    widgetState.push(CardState.PRISTINE);
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
  return { id, collapsed, disabled, values, widgetState, state: CardState.PRISTINE };
};

export interface CS {
  cardDef: Card[];
  viewMode: ViewMode;
  cardSettings: { id: string; collapsed: boolean; disabled: boolean; values: any[] }[];
  map: any;
  heroCardDef?: Card;
  heroCardSetting?: any;
  dragInitialIndex?: number | null;
  onChangeRef?: React.MutableRefObject<Function>; // callback for triggering requests
}

// PRINT displays only the table with ALL the rows ( = no pagination) , hide the table header
export enum ViewMode {
  STANDARD = 'standard',
  PRINT = 'print'
}

export function addCard(state: CS, id: string) {
  const definition = DICO[id];
  const settings = getStartStateFromCard(id);

  if (definition.hero) {
    state.heroCardDef = definition;
    state.heroCardSetting = getStartStateFromCard(id);
    state.map[id] = state.heroCardSetting; // settings are directly updated from the component
    return state;
  }

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
  map: {},
  viewMode: ViewMode.STANDARD
};

addCard(initialState, 'elasticity');
addCard(initialState, 'diel');
addCard(initialState, 'piezo');
addCard(initialState, 'space');
addCard(initialState, 'tags');
addCard(initialState, 'periodic');

// state is composed of
//  - > [ {cardDef, cardSettings } ]
// and a dico that points to the settings
