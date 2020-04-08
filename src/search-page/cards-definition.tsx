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
              label: 'Elastic'
            },
            {
              label: 'Vibrational'
            },
            {
              label: 'Dielectric'
            },
            {
              label: 'Elec. structure'
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
