import { Card, WIDGET } from '../../search-page/search-grid/cards-definition';
import { SelectionStyle } from '../../search-page/checkboxes-list/checkbox-list';

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
    title: 'Form example',
    id: 'Form',
    allowMultipleInstances: false,
    bypassIdForKey: true,
    widgets: [
      {
        type: WIDGET.INPUT_FORM,
        id: 'sp',
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
                min: 12,
                max: 140
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
                maxLength: 2
              }
            }
          ]
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
        id: 'props',
        name: null,
        configuration: {
          selectionStyle: SelectionStyle.SINGLE,
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
      }
    ]
  },
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
      }
    ]
  }
];
