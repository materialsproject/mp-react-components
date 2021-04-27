import { MaterialsInputField } from '../components/search/MaterialsInput';
import { Column, ColumnFormat, FilterGroup, FilterType } from '../components/search/SearchUI/types';

/**
 * XAS App Test Configuration
 */
export const xasGroups: FilterGroup[] = [
  {
    name: 'XAS Composition',
    alwaysExpanded: true,
    filters: [
      {
        name: 'Edge',
        id: 'edge',
        type: 'SELECT' as FilterType,
        props: {
          options: [
            {
              label: 'K-edge',
              value: 'K',
            },
            {
              label: 'L2-edge',
              value: 'L2',
            },
            {
              label: 'L3-edge',
              value: 'L3',
            },
            {
              label: 'L23-edge',
              value: 'L2,3',
            },
          ],
          defaultValue: 'K',
          isClearable: false,
        },
      },
      {
        name: 'Absorbing Element',
        id: 'absorbing_element',
        type: FilterType.MATERIALS_INPUT,
        props: {
          field: MaterialsInputField.ABSORBING_ELEMENT,
        },
      },
      {
        name: 'Other Elements',
        id: 'elements',
        type: FilterType.MATERIALS_INPUT,
        props: {
          field: MaterialsInputField.ELEMENTS,
        },
      },
      {
        name: 'Formula',
        id: 'formula',
        type: FilterType.MATERIALS_INPUT,
        props: {
          field: MaterialsInputField.FORMULA,
        },
      },
    ],
  },
];

export const xasColumns: Column[] = [
  {
    name: 'Material ID',
    selector: 'task_id',
    format: ColumnFormat.LINK,
    formatArg: '/materials/',
    minWidth: '130px',
  },
  {
    name: 'Formula',
    selector: 'formula_pretty',
    format: ColumnFormat.FORMULA,
  },
  {
    name: 'Absorbing Element',
    selector: 'absorbing_element',
  },
  {
    name: 'Edge',
    selector: 'edge',
  },
  {
    name: 'Spectrum Type',
    selector: 'spectrum_type',
  },
  {
    name: 'xas_id',
    selector: 'xas_id',
  },
  {
    name: 'xas_ids',
    selector: 'xas_ids',
  },
  {
    name: 'spectrum',
    selector: 'spectrum',
    hidden: true,
  },
];
