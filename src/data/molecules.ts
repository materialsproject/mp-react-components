import { MaterialsInputField } from "../components/search/MaterialsInput";
import { Column, ColumnFormat, FilterGroup, FilterType } from "../components/search/SearchUI/types";

/**
 * Molecules Explorer Test Configuration
 */
export const moleculesGroups: FilterGroup[] = [
  {
    name: 'Molecule Definition',
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
        name: 'Number of Elements',
        id: 'nelements',
        type: FilterType.SLIDER,
        props: {
          domain: [0, 20],
          step: 1
        }
      },
      // {
      //   name: 'Formula',
      //   id: 'formula',
      //   type: FilterType.MATERIALS_INPUT,
      //   props: {
      //     field: MaterialsInputField.FORMULA
      //   }
      // },
      {
        name: 'SMILES',
        id: 'smiles',
        type: FilterType.TEXT_INPUT
      }
    ]
  },
  {
    name: 'Basic Properties',
    expanded: false,
    filters: [
      {
        name: 'Electron Affinity',
        id: 'EA',
        type: FilterType.SLIDER,
        props: {
          domain: [-6098, 4858],
          step: 0.1
        }
      },
      {
        name: 'Ionization Energy',
        id: 'IE',
        type: FilterType.SLIDER,
        props: {
          domain: [-8000, 6886],
          step: 0.1
        }
      },
      {
        name: 'Charge',
        id: 'charge',
        type: FilterType.SLIDER,
        props: {
          domain: [-1, 1],
          step: 1
        }
      },
      {
        name: 'Point Group',
        id: 'pointgroup',
        type: FilterType.SELECT_POINTGROUP
      }
      // {
      //   name: 'Charge',
      //   id: 'charge',
      //   type: FilterType.SELECT,
      //   props: {
      //     options: [
      //       {
      //         label: '-1',
      //         value: -1
      //       },
      //       {
      //         label: '0',
      //         value: 0
      //       },
      //       {
      //         label: '1',
      //         value: 1
      //       }
      //     ]
      //   }
      // }
    ]
  }
];

export const moleculesColumns: Column[] = [
  {
    name: 'Molecule Id',
    selector: 'task_id',
    format: ColumnFormat.LINK,
    formatArg: '/molecules/',
    minWidth: '130px'
  },
  {
    name: 'Formula',
    selector: 'pretty_formula',
    format: ColumnFormat.FORMULA
  },
  {
    name: 'SMILES',
    selector: 'smiles'
  },
  {
    name: 'Electron Affinity',
    selector: 'EA',
    format: ColumnFormat.FIXED_DECIMAL,
    formatArg: 3,
  },
  {
    name: 'Ionization Energy',
    selector: 'IE',
    format: ColumnFormat.FIXED_DECIMAL,
    formatArg: 3,
  },
  {
    name: 'Charge',
    selector: 'charge',
  },
  {
    name: 'Point Group',
    selector: 'pointgroup',
    format: ColumnFormat.POINTGROUP
  }
];