import { Card, WIDGET } from '../../search-page/search-grid/cards-definition';

export const sliders: Card[] = [
  {
    title: 'Some filter',
    id: 'test',
    bypassIdForKey: true,
    allowMultipleInstances: false,
    widgets: [
      {
        type: WIDGET.SLIDERS,
        name: 'Test one',
        id: 't1',
        configuration: {
          // we can add mode
          handle: 1,
          domain: [0, 10],
          step: 1
        }
      },
      {
        type: WIDGET.SLIDERS,
        name: 'Test two',
        id: 't2',
        configuration: {
          // we can add mode
          handle: 2,
          domain: [10, 50],
          step: 0.5
        }
      },
      {
        type: WIDGET.SLIDERS,
        name: 'One handle',
        id: 't2',
        configuration: {
          // we can add mode
          handle: 1,
          domain: [10, 50],
          step: 0.5
        }
      }
    ]
  }
];
