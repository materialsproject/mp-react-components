import { MaterialsInputField } from '../components/search/MaterialsInput';
import { Column, ColumnFormat, FilterGroup, FilterType } from '../components/search/SearchUI/types';

/**
 * Batteries Explorer Test Configuration
 */
export const batteriesGroups: FilterGroup[] = [
  {
    name: 'Composition',
    expanded: false,
    filters: [
      {
        name: 'Working Ion',
        id: 'working_ion',
        type: 'SELECT' as FilterType,
        props: {
          options: [
            {
              label: 'Calcium',
              value: 'Ca',
            },
            {
              label: 'Lithium',
              value: 'Li',
            },
            {
              label: 'Magnesium',
              value: 'Mg',
            },
          ],
        },
      },
      {
        name: 'Include Elements',
        id: 'elements',
        type: 'MATERIALS_INPUT' as FilterType,
        props: {
          field: 'elements' as MaterialsInputField,
        },
      },
      {
        name: 'Exclude Elements',
        id: 'exclude_elements',
        type: 'MATERIALS_INPUT' as FilterType,
        props: {
          field: 'exclude_elements' as MaterialsInputField,
        },
      },
      {
        name: 'Formula',
        id: 'formula',
        type: 'MATERIALS_INPUT' as FilterType,
        props: {
          field: 'formula' as MaterialsInputField,
        },
      },
    ],
  },
  {
    name: 'Battery Properties',
    expanded: false,
    filters: [
      {
        name: 'Max Delta Volume',
        id: 'delta_volume',
        type: 'SLIDER' as FilterType,
        props: {
          domain: [0, 10],
          step: 0.1,
        },
      },
      {
        name: 'Average Voltage',
        id: 'average_voltage',
        type: 'SLIDER' as FilterType,
        props: {
          domain: [0, 10],
          step: 0.1,
        },
      },
      {
        name: 'Gravimetric Capacity',
        id: 'capacity_grav',
        type: 'SLIDER' as FilterType,
        props: {
          domain: [0, 1400],
          step: 1,
        },
      },
      {
        name: 'Volumetric Capacity',
        id: 'capacity_vol',
        type: 'SLIDER' as FilterType,
        props: {
          domain: [0, 4000],
          step: 1,
        },
      },
      {
        name: 'Gravimetric Energy',
        id: 'energy_grav',
        type: 'SLIDER' as FilterType,
        props: {
          domain: [0, 4000],
          step: 1,
        },
      },
      {
        name: 'Volumetric Energy',
        id: 'energy_vol',
        type: 'SLIDER' as FilterType,
        props: {
          domain: [0, 2500],
          step: 1,
        },
      },
      {
        name: 'Fraca Charge',
        id: 'fracA_charge',
        type: 'SLIDER' as FilterType,
        props: {
          domain: [0, 0.2],
          step: 0.001,
        },
      },
      {
        name: 'Fraca Discharge',
        id: 'fracA_discharge',
        type: 'SLIDER' as FilterType,
        props: {
          domain: [0, 0.5],
          step: 0.001,
        },
      },
      {
        name: 'Stability Charge',
        id: 'stability_charge',
        type: 'SLIDER' as FilterType,
        props: {
          domain: [0, 1500],
          step: 1,
        },
      },
      {
        name: 'Stability Discharge',
        id: 'stability_discharge',
        type: 'SLIDER' as FilterType,
        props: {
          domain: [0, 400],
          step: 1,
        },
      },
      {
        name: 'Steps',
        id: 'num_steps',
        type: 'SLIDER' as FilterType,
        props: {
          domain: [1, 5],
          step: 1,
        },
      },
      {
        name: 'Max Voltage Step',
        id: 'max_voltage_step',
        type: 'SLIDER' as FilterType,
        props: {
          domain: [0, 2],
          step: 0.01,
        },
      },
    ],
  },
];

export const batteriesColumns: Column[] = [
  {
    name: 'Battery Id',
    selector: 'battery_id',
    format: 'LINK' as ColumnFormat,
    formatArg: '/batteries/',
    minWidth: '150px',
  },
  {
    name: 'Working Ion',
    selector: 'working_ion',
  },
  {
    name: 'Formula Charge',
    selector: 'formula_charge',
  },
  {
    name: 'Formula Discharge',
    selector: 'formula_discharge',
  },
  {
    name: 'Last Updated',
    selector: 'last_updated',
  },
  {
    name: 'Max Delta Volume',
    selector: 'max_delta_volume',
    format: 'FIXED_DECIMAL' as ColumnFormat,
    formatArg: 3,
    // units: '%',
    right: true,
  },
  {
    name: 'Average Voltage',
    selector: 'average_voltage',
    format: 'FIXED_DECIMAL' as ColumnFormat,
    formatArg: 3,
    units: 'V',
    right: true,
  },
  {
    name: 'Minimum Voltage',
    selector: 'min_voltage',
    format: 'FIXED_DECIMAL' as ColumnFormat,
    formatArg: 3,
    units: 'V',
    right: true,
  },
  {
    name: 'Gravimetric Capacity',
    selector: 'capacity_grav',
    format: 'FIXED_DECIMAL' as ColumnFormat,
    formatArg: 3,
    units: 'mAh/g',
    right: true,
  },
  {
    name: 'Volumetric Capacity',
    selector: 'capacity_vol',
    format: 'FIXED_DECIMAL' as ColumnFormat,
    formatArg: 3,
    units: 'mAh/cc',
    right: true,
  },
  {
    name: 'Gravimetric Energy',
    selector: 'energy_grav',
    format: 'FIXED_DECIMAL' as ColumnFormat,
    formatArg: 3,
    units: 'Wh/kg',
    right: true,
  },
  {
    name: 'Volumetric Energy',
    selector: 'energy_vol',
    format: 'FIXED_DECIMAL' as ColumnFormat,
    formatArg: 3,
    units: 'Wh/l',
    right: true,
  },
  {
    name: 'Fraca Charge',
    selector: 'fracA_charge',
    format: 'FIXED_DECIMAL' as ColumnFormat,
    formatArg: 3,
    right: true,
  },
  {
    name: 'Fraca Discharge',
    selector: 'fracA_discharge',
    format: 'FIXED_DECIMAL' as ColumnFormat,
    formatArg: 3,
    right: true,
  },
  {
    name: 'Stability Charge',
    selector: 'stability_charge',
    format: 'FIXED_DECIMAL' as ColumnFormat,
    formatArg: 2,
    units: 'meV/atom',
    conversionFactor: 1000,
    abbreviateNearZero: true,
    right: true,
  },
  {
    name: 'Stability Discharge',
    selector: 'stability_discharge',
    format: 'FIXED_DECIMAL' as ColumnFormat,
    formatArg: 2,
    units: 'meV/atom',
    conversionFactor: 1000,
    abbreviateNearZero: true,
    right: true,
  },
  {
    name: 'Steps',
    selector: 'num_steps',
    right: true,
  },
  {
    name: 'Max Voltage Step',
    selector: 'max_voltage_step',
    format: 'FIXED_DECIMAL' as ColumnFormat,
    formatArg: 3,
    right: true,
  },
];
