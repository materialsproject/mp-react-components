import React from 'react';
export enum WIDGET {
  SLIDERS = 'SLIDER',
  CHECKBOX = 'CHECKBOX',
  CHECKBOX_LIST = 'CHECKBOX_LIST'
}

interface Widget {
  name: () => any;
  type: WIDGET;
  configuration: any;
}

export interface Card {
  title: string;
  widgets: Widget[];
}

//TODO try to use a simple function to render
export const cardsDefinition: Card[] = [
  {
    title: 'Elasticity',
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
  }
];
