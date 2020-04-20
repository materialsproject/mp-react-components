import { Card, WIDGET } from '../../search-page/search-grid/cards-definition';

export const card: Card[] = [
  {
    title: 'Form example',
    id: 'form',
    allowMultipleInstances: false,
    bypassIdForKey: true,
    widgets: [
      {
        type: WIDGET.INPUT_FORM,
        id: 'wg',
        configuration: {
          fields: [
            {
              id: 'a',
              name: 'number',
              label: 'Some number',
              placeholder: 'Enter a number',
              type: 'number',
              validationOptions: {
                required: true,
                min: 120,
                max: 1000
              }
            },
            {
              id: 'b',
              name: 'Some text',
              label: 'Some text',
              placeholder: 'Enter a text',
              type: 'text',
              validationOptions: {
                required: true,
                maxLength: 10
              }
            },
            {
              id: 'c',
              name: 'Some text with pattern',
              label: 'Some text',
              placeholder: 'Enter a text',
              type: 'text',
              validationOptions: {
                pattern: '/abc/'
              }
            }
          ]
        }
      }
    ]
  }
];
