import { MaterialsInputField } from '../components/search/MaterialsInput';
import { Column, ColumnFormat, FilterGroup, FilterType } from '../components/search/SearchUI/types';

/**
 * Materials Explorer Test Configuration
 */
export const materialsGroups: FilterGroup[] = [
  {
    name: 'Composition',
    expanded: false,
    filters: [
      {
        name: 'ID',
        id: 'task_ids',
        type: 'MATERIALS_INPUT' as FilterType,
        props: {
          field: 'task_ids',
          periodicTableMode: null,
        },
      },
      {
        name: 'Include Elements',
        id: 'elements',
        type: 'MATERIALS_INPUT' as FilterType,
        props: {
          field: 'elements',
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
    name: 'Basic Properties',
    expanded: false,
    filters: [
      {
        name: 'Volume',
        id: 'volume',
        type: 'SLIDER' as FilterType,
        props: {
          domain: [5, 19407],
          step: 1,
        },
      },
      {
        name: 'Density',
        id: 'density',
        type: 'SLIDER' as FilterType,
        props: {
          domain: [0, 25],
          step: 0.1,
        },
      },
      {
        name: 'Number of Sites',
        id: 'nsites',
        type: 'SLIDER' as FilterType,
        props: {
          domain: [1, 360],
          step: 1,
        },
      },
    ],
  },
  {
    name: 'Thermodynamics',
    expanded: false,
    filters: [
      {
        name: 'Energy Above Hull',
        id: 'e_above_hull',
        type: 'SLIDER' as FilterType,
        units: 'meV/atom',
        conversionFactor: 0.001,
        props: {
          domain: [0, 1000],
          step: 0.01,
        },
      },
      {
        name: 'Formation Energy',
        id: 'formation_energy_per_atom',
        type: 'SLIDER' as FilterType,
        units: 'eV/atom',
        props: {
          domain: [-10, 6],
          step: 0.1,
        },
      },
      {
        name: 'Stability',
        id: 'is_stable',
        type: 'THREE_STATE_BOOLEAN_SELECT' as FilterType,
        props: {
          options: [
            {
              label: 'Is stable',
              value: true,
            },
            {
              label: 'Is not stable',
              value: false,
            },
          ],
        },
      },
    ],
  },
  {
    name: 'Symmetry',
    expanded: false,
    filters: [
      {
        name: 'Spacegroup Symbol',
        id: 'spacegroup_symbol',
        type: 'SELECT_SPACEGROUP_SYMBOL' as FilterType,
      },
      {
        name: 'Spacegroup Number',
        id: 'spacegroup_number',
        type: 'SELECT_SPACEGROUP_NUMBER' as FilterType,
      },
      {
        name: 'Crystal System',
        id: 'crystal_system',
        type: 'SELECT_CRYSTAL_SYSTEM' as FilterType,
      },
    ],
  },
  {
    name: 'Electronic Structure',
    expanded: false,
    filters: [
      {
        name: 'Band Gap',
        id: 'sc_band_gap',
        type: 'SLIDER' as FilterType,
        props: {
          domain: [0, 100],
          step: 1,
        },
      },
      {
        name: 'Direct Band Gap',
        id: 'sc_direct',
        type: 'THREE_STATE_BOOLEAN_SELECT' as FilterType,
        props: {
          options: [
            {
              label: 'Is direct',
              value: true,
            },
            {
              label: 'Is not direct',
              value: false,
            },
          ],
        },
      },
    ],
  },
  {
    name: 'Magnetism',
    expanded: false,
    filters: [
      {
        name: 'Magnetic Ordering',
        id: 'ordering',
        type: 'SELECT' as FilterType,
        props: {
          options: [
            {
              label: 'Ferromagnetic',
              value: 'FM',
            },
            {
              label: 'Non-magnetic',
              value: 'NM',
            },
            {
              label: 'Ferrimagnetic',
              value: 'FiM',
            },
            {
              label: 'Antiferromagnetic',
              value: 'AFM',
            },
            {
              label: 'Unknown',
              value: 'Unknown',
            },
          ],
        },
      },
      {
        name: 'Max Magnetic Moment',
        id: 'total_magnetization',
        type: 'SLIDER' as FilterType,
        props: {
          domain: [0, 325],
          step: 1,
        },
      },
      // {
      //   name: 'Type of Normalization',
      //   id: 'sc_band_gap',
      //   type: 'THREE_STATE_BOOLEAN_SELECT' as FilterType,
      //   props: {
      //     options: [
      //       {
      //         label: 'Is direct',
      //         value: true,
      //       },
      //       {
      //         label: 'Is not direct',
      //         value: false,
      //       },
      //     ],
      //   },
      // },
    ],
  },
  {
    name: 'Elasticity',
    expanded: false,
    filters: [
      {
        name: 'Bulk Modulus, Voigt',
        id: 'k_voigt',
        units: 'GPa',
        type: 'SLIDER' as FilterType,
        props: {
          domain: [0, 1000],
          step: 1,
        },
      },
      {
        name: 'Bulk Modulus, Reuss',
        id: 'k_reuss',
        units: 'GPa',
        type: 'SLIDER' as FilterType,
        props: {
          domain: [0, 1000],
          step: 1,
        },
      },
      {
        name: 'Bulk Modulus, Voigt-Reuss-Hill',
        id: 'k_vrh',
        units: 'GPa',
        type: 'SLIDER' as FilterType,
        props: {
          domain: [0, 1000],
          step: 1,
        },
      },
      {
        name: 'Shear Modulus, Voigt',
        id: 'g_voigt',
        units: 'GPa',
        type: 'SLIDER' as FilterType,
        props: {
          domain: [0, 1000],
          step: 1,
        },
      },
      {
        name: 'Shear Modulus, Reuss',
        id: 'g_reuss',
        units: 'GPa',
        type: 'SLIDER' as FilterType,
        props: {
          domain: [0, 1000],
          step: 1,
        },
      },
      {
        name: 'Shear Modulus, Voigt-Reuss-Hill',
        id: 'g_vrh',
        units: 'GPa',
        type: 'SLIDER' as FilterType,
        props: {
          domain: [0, 1000],
          step: 1,
        },
      },
      {
        name: 'Elastic Anisotropy',
        id: 'elastic_anisotropy',
        type: 'SLIDER' as FilterType,
        props: {
          domain: [-2000, 25],
          step: 1,
        },
      },
    ],
  },
  {
    name: 'Surfaces',
    expanded: false,
    filters: [
      {
        name: 'Weighted Surface Energy',
        id: 'weighted_surface_energy',
        units: 'J/m²',
        type: 'SLIDER' as FilterType,
        props: {
          domain: [0, 5],
          step: 0.01,
        },
      },
      {
        name: 'Surface Anisotropy',
        id: 'surface_anisotropy',
        type: 'SLIDER' as FilterType,
        props: {
          domain: [0, 25],
          step: 1,
        },
      },
      {
        name: 'Shape Factor',
        id: 'shape_factor',
        type: 'SLIDER' as FilterType,
        props: {
          domain: [0, 100],
          step: 0.1,
        },
      },
    ],
  },
  {
    name: 'Piezoelectric',
    expanded: false,
    filters: [
      {
        name: 'Piezo Modulus',
        id: 'piezo_modulus',
        units: 'Cm²',
        type: 'SLIDER' as FilterType,
        props: {
          domain: [0, 100],
          step: 0.01,
        },
      },
    ],
  },
  {
    name: 'Dielectric',
    expanded: false,
    filters: [
      {
        name: 'Total Dielectric Constant',
        id: 'e_total',
        units: '',
        type: 'SLIDER' as FilterType,
        props: {
          domain: [0, 100],
          step: 0.01,
        },
      },
      {
        name: 'Ionic Dielectric Constant',
        id: 'e_ionic',
        units: '',
        type: 'SLIDER' as FilterType,
        props: {
          domain: [0, 100],
          step: 0.01,
        },
      },
      {
        name: 'Static Dielectric Constant',
        id: 'e_static',
        units: '',
        type: 'SLIDER' as FilterType,
        props: {
          domain: [0, 100],
          step: 0.01,
        },
      },
    ],
  },
];

export const materialsColumns: Column[] = [
  {
    name: 'Is Stable',
    selector: 'is_stable',
    format: 'BOOLEAN_CLASS',
    formatArg: 'is-stable',
    width: '50px',
  },
  {
    name: 'Material Id',
    selector: 'task_id',
    format: 'LINK',
    formatArg: '/materials/',
    minWidth: '110px',
  },
  {
    name: 'Formula',
    selector: 'formula_pretty',
    format: 'FORMULA' as ColumnFormat,
    minWidth: '130px',
  },
  {
    name: 'Space Group Symbol',
    selector: 'symmetry.symbol',
    format: 'SPACEGROUP_SYMBOL' as ColumnFormat,
  },
  {
    name: 'Space Group Number',
    selector: 'symmetry.number',
    omit: true,
  },
  {
    name: 'Crystal System',
    selector: 'symmetry.crystal_system',
  },
  {
    name: 'Volume',
    selector: 'volume',
    format: 'FIXED_DECIMAL' as ColumnFormat,
    formatArg: 3,
    omit: true,
    right: true,
  },
  {
    name: 'Density',
    selector: 'density',
    format: 'SIGNIFICANT_FIGURES' as ColumnFormat,
    formatArg: 4,
    omit: true,
    right: true,
  },
  {
    name: 'Sites',
    selector: 'nsites',
    right: true,
  },
  {
    name: 'Energy Above Hull',
    selector: 'e_above_hull',
    format: 'FIXED_DECIMAL' as ColumnFormat,
    formatArg: 2,
    units: 'meV/atom',
    conversionFactor: 1000,
    abbreviateNearZero: true,
    right: true,
    wrap: false,
  },
  {
    name: 'Formation Energy',
    selector: 'formation_energy_per_atom',
    format: 'FIXED_DECIMAL' as ColumnFormat,
    formatArg: 2,
    units: 'eV/atom',
    omit: true,
    right: true,
  },
  {
    name: 'Is Stable',
    selector: 'is_stable',
    format: 'BOOLEAN' as ColumnFormat,
    formatArg: ['yes', 'no'],
    omit: true,
  },
  {
    name: 'Magnetic Ordering',
    selector: 'ordering',
    omit: true,
  },
  {
    name: 'Max Magnetic Moment',
    selector: 'total_magnetization',
    format: 'FIXED_DECIMAL' as ColumnFormat,
    formatArg: 2,
    omit: true,
  },
  {
    name: 'Bulk Modulus, Voigt',
    selector: 'k_voigt',
    format: 'FIXED_DECIMAL' as ColumnFormat,
    formatArg: 2,
    units: 'GPa',
    omit: true,
    right: true,
  },
  {
    name: 'Bulk Modulus, Reuss',
    selector: 'k_reuss',
    format: 'FIXED_DECIMAL' as ColumnFormat,
    formatArg: 2,
    units: 'GPa',
    omit: true,
    right: true,
  },
  {
    name: 'Bulk Modulus, VRH',
    selector: 'k_vrh',
    format: 'FIXED_DECIMAL' as ColumnFormat,
    formatArg: 2,
    units: 'GPa',
    omit: true,
    right: true,
  },
  {
    name: 'Shear Modulus, Voigt',
    selector: 'g_voigt',
    format: 'FIXED_DECIMAL' as ColumnFormat,
    formatArg: 2,
    units: 'GPa',
    omit: true,
    right: true,
  },
  {
    name: 'Shear Modulus, Reuss',
    selector: 'g_reuss',
    format: 'FIXED_DECIMAL' as ColumnFormat,
    formatArg: 2,
    units: 'GPa',
    omit: true,
    right: true,
  },
  {
    name: 'Shear Modulus, VRH',
    selector: 'g_vrh',
    format: 'FIXED_DECIMAL' as ColumnFormat,
    formatArg: 2,
    units: 'GPa',
    omit: true,
    right: true,
  },
  {
    name: 'Elastic Anisotropy',
    selector: 'universal_anisotropy',
    format: 'FIXED_DECIMAL' as ColumnFormat,
    formatArg: 2,
    omit: true,
    right: true,
  },
  {
    name: 'Weighted Surface Energy',
    selector: 'weighted_surface_energy',
    format: 'FIXED_DECIMAL' as ColumnFormat,
    formatArg: 2,
    units: 'J/m²',
    omit: true,
    right: true,
  },
  {
    name: 'Surface Anisotropy',
    selector: 'surface_anisotropy',
    format: 'FIXED_DECIMAL' as ColumnFormat,
    formatArg: 2,
    omit: true,
    right: true,
  },
  {
    name: 'Shape Factor',
    selector: 'shape_factor',
    format: 'FIXED_DECIMAL' as ColumnFormat,
    formatArg: 2,
    omit: true,
    right: true,
  },
  {
    name: 'Work Function',
    selector: 'weighted_work_function',
    format: 'FIXED_DECIMAL' as ColumnFormat,
    formatArg: 2,
    omit: true,
    right: true,
  },
  {
    name: 'Piezoelectric Modulus',
    selector: 'e_ij_max',
    format: 'FIXED_DECIMAL' as ColumnFormat,
    formatArg: 2,
    units: 'C/m²',
    omit: true,
    right: true,
  },
  {
    name: 'Total Dielectric Constant',
    selector: 'e_total',
    format: 'FIXED_DECIMAL' as ColumnFormat,
    formatArg: 2,
    omit: true,
    right: true,
  },
  {
    name: 'Ionic Dielectric Constant',
    selector: 'e_ionic',
    format: 'FIXED_DECIMAL' as ColumnFormat,
    formatArg: 2,
    omit: true,
    right: true,
  },
  {
    name: 'Static Dielectric Constant',
    selector: 'e_static',
    format: 'FIXED_DECIMAL' as ColumnFormat,
    formatArg: 2,
    omit: true,
    right: true,
  },
];
