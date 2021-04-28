export const filterGroups = [
  {
    name: 'Composition',
    expanded: false,
    filters: [
      {
        name: 'ID',
        id: 'task_ids',
        type: 'MATERIALS_INPUT',
        props: {
          field: 'task_ids',
          periodicTableMode: null,
        },
      },
      {
        name: 'Required Elements',
        id: 'elements',
        type: 'MATERIALS_INPUT',
        props: {
          field: 'elements',
        },
      },
      {
        name: 'Number of Elements',
        id: 'nelements',
        type: 'SLIDER',
        props: {
          domain: [0, 20],
          step: 1,
        },
      },
      {
        name: 'Formula',
        id: 'formula',
        type: 'MATERIALS_INPUT',
        props: {
          field: 'formula',
        },
      },
      {
        name: 'SMILES',
        id: 'smiles',
        type: 'TEXT_INPUT',
      },
    ],
  },
  {
    name: 'Basic Properties',
    expanded: false,
    filters: [
      {
        name: 'Electron Affinity',
        id: 'EA',
        units: 'eV',
        type: 'SLIDER',
        props: {
          domain: [-6098, 4858],
          step: 0.1,
        },
      },
      {
        name: 'Ionization Energy',
        id: 'IE',
        units: 'eV',
        type: 'SLIDER',
        props: {
          domain: [-8000, 6886],
          step: 0.1,
        },
      },
      {
        name: 'Charge',
        id: 'charge',
        units: '+e',
        type: 'SLIDER',
        props: {
          domain: [-1, 1],
          step: 1,
        },
      },
      {
        name: 'Point Group',
        id: 'pointgroup',
        type: 'SELECT_POINTGROUP',
      },
    ],
  },
];
