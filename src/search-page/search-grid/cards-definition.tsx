import React from 'react';
import { SelectionStyle } from '../checkboxes-list/checkbox-list';
import { ValidationOptions } from 'react-hook-form';

export enum WIDGET {
  SLIDERS = 'SLIDERS',
  CHECKBOX = 'CHECKBOX',
  CHECKBOX_LIST = 'CHECKBOX_LIST',
  SP_SEARCH = 'SP_SEARCH', // try to make it generic
  TAG_SEARCH = 'TAG_SEARCH', // try to make it generic
  PERIODIC_TABLE = 'PERIODIC_TABLE',
  FILE_UPLOAD = 'FILE_UPLOAD', //TODO(chab)
  INPUT_FORM = 'INPUT_FORM' //TODO(chab)
}

export enum CardState {
  PRISTINE = 'pristine',
  DIRTY = 'dirty'
}

export interface Widget<T extends WIDGET> {
  name?: string | null;
  latexName?: string | null;
  type: WIDGET;
  id: string;
  configuration: ModelInterfaceMap[T];
}

export type ModelInterfaceMap = {
  SLIDERS: WidgetSlider;
  CHECKBOX: WidgetCheckboxList;
  CHECKBOX_LIST: WidgetCheckboxList;
  PERIODIC_TABLE: WidgetPeriodicTable;
  SP_SEARCH: any;
  TAG_SEARCH: any;
  FILE_UPLOAD: any;
  INPUT_FORM: WidgetInputForm;
};

export function getWidgetConfiguration<T extends WIDGET>(
  widgetType: T,
  widget
): ModelInterfaceMap[T] {
  return widget.configuration;
}

export interface Field {
  id: string;
  label: string;
  name: string;
  type: 'text' | 'number';
  placeholder?: string;
  validationOptions: ValidationOptions; // see below for validation example
}

export interface WidgetInputForm {
  fields: Field[];
}
/*export type ValidationOptions = Partial<{
  required: Message | ValidationOption<boolean>;
  min: ValidationOption<number | string>;
  max: ValidationOption<number | string>;
  maxLength: ValidationOption<number | string>;
  minLength: ValidationOption<number | string>;
  pattern: ValidationOption<RegExp>;
  validate: Validate | Record<string, Validate>;
}>;
pattern: {
  value: /[A-Za-z]{3}/,
  message: 'error message' // <p>error message</p>
}
required: 'Field is required'
maxLength : {
  value: 2,
    message: 'error message' // <p>error message</p>
}*/

export interface WidgetSlider {
  // we can add mode
  handle: number;
  domain: number[];
  step: number;
}

export interface WidgetCheckboxList {
  checkboxes: { label: string; name: string }[];
  selectionStyle: SelectionStyle;
}

export interface WidgetPeriodicTable {
  disabledElements: any[];
  hiddenElements: any[];
  enabledElements: any[];
}

export interface Card {
  hero?: boolean; // an hero card take all the width
  title: string;
  widgets: Widget<WIDGET>[];
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

// Those are some defaults you can use
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
          handle: 2,
          domain: [1, 158]
        }
      },
      {
        type: WIDGET.SLIDERS,
        id: 'poly_total',
        latexName: '$\\epsilon_{poly}$',
        configuration: {
          handle: 2,
          domain: [2, 257]
        }
      },
      {
        type: WIDGET.SLIDERS,
        id: 'poly_electronic',
        name: 'Refractive index',
        configuration: {
          handle: 2,
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
          handle: 2,
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
          selectionStyle: SelectionStyle.SINGLE,
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

export const getStartStateFromCard = (id: string | Card, cardMap) => {
  const card = typeof id === 'string' ? cardMap[id] : id;
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
        outerAcc.push(widget.configuration.domain.slice(0, widget.configuration.handle));
        break;
      }
    }
    return outerAcc;
  }, []);
  return { id: card.id, collapsed, disabled, values, widgetState, state: CardState.PRISTINE };
};

export interface CardSetting {
  id: string;
  collapsed: boolean;
  dragging?: boolean;
  disabled: boolean;
  values: any[];
  state: CardState;
  widgetState: CardState[];
}

export interface CardGridState {
  viewMode: ViewMode;
  cardDef: Card[]; // used definition
  cardSettings: CardSetting[]; // settings
  map: { [cardId: string]: CardSetting }; // map of visible card
  heroCardDef?: Card;
  heroCardSetting?: CardSetting;
  dragInitialIndex?: number | null;
  onChangeRef?: React.MutableRefObject<Function>; // callback for triggering requests
  allDefinitions: Card[]; // list of all definitions
  allDefinitionsMap: { [cardId: string]: Card };
}

// PRINT displays only the table with ALL the rows ( = no pagination) , hide the table header
export enum ViewMode {
  STANDARD = 'standard',
  PRINT = 'print'
}

export function addCard(state: CardGridState, id: string) {
  const DICO = state.allDefinitionsMap;
  const definition = DICO[id];

  if (definition.hero) {
    state.heroCardDef = definition;
    state.heroCardSetting = getStartStateFromCard(id, DICO);
    state.map[id] = state.heroCardSetting; // settings are directly updated from the component
    return state;
  }
  const settings = getStartStateFromCard(id, DICO);

  if (!definition.activeInstance) {
    definition.activeInstance = 0;
  }
  definition.activeInstance++;
  state.cardDef = [...state.cardDef, definition];
  state.cardSettings = [...state.cardSettings, settings];
  state.map[id] = settings; // settings are directly updated from the component
  return state;
}
export function sfindCard(state: CardGridState, id: string) {
  return state.cardDef.findIndex(c => c.id === id);
}
export function sdeleteCard(state: CardGridState, id: string) {
  const index = sfindCard(state, id);
  const definition = state.cardDef.splice(index, 1);
  definition[0].activeInstance!--;
  state.cardSettings.splice(index, 1);
  state.cardDef = [...state.cardDef];
  state.cardSettings = [...state.cardSettings];
  delete state.map[id];
  return state;
}

export function smoveCard(state: CardGridState, id: string, atIndex: number) {
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

export const initialState: CardGridState = {
  cardDef: [],
  cardSettings: [],
  map: {},
  viewMode: ViewMode.STANDARD,
  allDefinitions: [],
  allDefinitionsMap: {}
};

/*
addCard(initialState, 'elasticity');
addCard(initialState, 'diel');
addCard(initialState, 'piezo');
addCard(initialState, 'space');
addCard(initialState, 'tags');
addCard(initialState, 'periodic');*/
export const initialGrid = ['periodic', 'general', 'space'];

// state is composed of
//  - > [ {cardDef, cardSettings } ]
// and a dico that points to the settings
