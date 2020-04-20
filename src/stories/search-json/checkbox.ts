import { Card, WIDGET } from '../../search-page/search-grid/cards-definition';
import { SelectionStyle } from '../../search-page/checkboxes-list/checkbox-list';

export default [
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
  }
] as Card[];
