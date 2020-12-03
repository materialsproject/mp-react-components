import { MaterialsInputField } from "../components/search/MaterialsInput";
import { Column, ColumnFormat, FilterGroup, FilterType } from "../components/search/SearchUI/types";

/**
 * Materials Explorer Test Configuration
 */
export const materialsGroups: FilterGroup[] = [
  {
    name: 'Material',
    expanded: false,
    filters: [
      {
        name: 'ID',
        id: 'task_ids',
        type: FilterType.TEXT_INPUT
      },
      {
        name: 'Elements',
        id: 'elements',
        type: FilterType.MATERIALS_INPUT,
        props: {
          field: MaterialsInputField.ELEMENTS
        }
      },
      {
        name: 'Formula',
        id: 'formula',
        type: FilterType.MATERIALS_INPUT,
        props: {
          field: MaterialsInputField.FORMULA
        }
      }
    ]
  },
  {
    name: 'Basic Properties',
    expanded: false,
    filters: [
      {
        name: 'Volume',
        id: 'volume',
        type: FilterType.SLIDER,
        props: {
          domain: [5, 19407],
          step: 1
        }
      },
      {
        name: 'Density',
        id: 'density',
        type: FilterType.SLIDER,
        props: {
          domain: [0, 25],
          step: 0.1
        }
      },
      {
        name: 'Number of Sites',
        id: 'nsites',
        type: FilterType.SLIDER,
        props: {
          domain: [1, 360],
          step: 1
        }
      }
    ]
  },
  {
    name: 'Thermodynamics',
    expanded: false,
    filters: [
      {
        name: 'Energy Above Hull',
        id: 'e_above_hull',
        type: FilterType.SLIDER,
        props: {
          domain: [0, 7],
          step: 0.1
        }
      },
      {
        name: 'Formation Energy',
        id: 'formation_energy_per_atom',
        type: FilterType.SLIDER,
        props: {
          domain: [-10, 6],
          step: 0.1
        }
      },
      {
        name: 'Stability',
        id: 'is_stable',
        type: FilterType.THREE_STATE_BOOLEAN_SELECT,
        props: {
          options: [
            {
              label: 'Is stable',
              value: true
            },
            {
              label: 'Is not stable',
              value: false
            }
          ]
        }
      }
    ]
  },
  {
    name: 'Symmetry',
    expanded: false,
    filters: [
      {
        name: 'Spacegroup Symbol',
        id: 'spacegroup_symbol',
        type: FilterType.SELECT_SPACEGROUP_SYMBOL
      },
      {
        name: 'Spacegroup Number',
        id: 'spacegroup_number',
        type: FilterType.SELECT_SPACEGROUP_NUMBER
      },
      {
        name: 'Crystal System',
        id: 'crystal_system',
        type: FilterType.SELECT_CRYSTAL_SYSTEM
      }
    ]
  },
  {
    name: 'Electronic Structure',
    expanded: false,
    filters: [  
      {
        name: 'Band Gap',
        id: 'sc_band_gap',
        type: FilterType.SLIDER,
        props: {
          domain: [0, 100],
          step: 1
        }
      },
      {
        name: 'Direct Band Gap',
        id: 'sc_direct',
        type: FilterType.THREE_STATE_BOOLEAN_SELECT,
        props: {
          options: [
            {
              label: 'Is direct',
              value: true
            },
            {
              label: 'Is not direct',
              value: false
            }
          ]
        }
      }
    ]
  }
];

export const materialsColumns: Column[] = [
  {
    name: 'Material Id',
    selector: 'task_id',
    format: ColumnFormat.LINK,
    formatArg: '/materials/'
  },
  {
    name: 'Formula',
    selector: 'formula_pretty',
    format: ColumnFormat.FORMULA
  },
  {
    name: 'Volume',
    selector: 'volume',
    format: ColumnFormat.FIXED_DECIMAL,
    formatArg: 3,
    omit: true
  },
  {
    name: 'Density',
    selector: 'density',
    format: ColumnFormat.SIGNIFICANT_FIGURES,
    formatArg: 4,
    omit: true
  },
  {
    name: 'Sites',
    selector: 'nsites'
  },
  {
    name: 'Energy Above Hull',
    selector: 'e_above_hull',
    format: ColumnFormat.SIGNIFICANT_FIGURES,
    formatArg: 4
  },
  {
    name: 'Formation Energy',
    selector: 'formation_energy_per_atom',
    format: ColumnFormat.SIGNIFICANT_FIGURES,
    formatArg: 4,
    omit: true
  },
  {
    name: 'Is Stable',
    selector: 'is_stable',
    format: ColumnFormat.BOOLEAN,
    formatArg: ['yes', 'no'],
    omit: true
  },
  {
    name: 'Spacegroup Symbol',
    selector: 'symmetry.symbol',
    format: ColumnFormat.SPACEGROUP_SYMBOL
  },
  {
    name: 'Spacegroup Number',
    selector: 'symmetry.number'
  },
  {
    name: 'Crystal System',
    selector: 'symmetry.crystal_system'
  }
];