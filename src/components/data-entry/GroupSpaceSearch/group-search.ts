const crystal = [
  { number: 1, shortName: 'P1', fedorov: '1s' },
  { number: 2, shortName: 'P1-', fedorov: '2s' },

  { number: 3, shortName: 'P2', fedorov: '3s' },
  { number: 4, shortName: 'P21', fedorov: '1a' },
  { number: 5, shortName: 'C2', fedorov: ' 4s' },

  { number: 16, shortName: 'P222', fedorov: '9s' },
  { number: 17, shortName: 'P212121', fedorov: '4a' },
  { number: 18, shortName: 'P21212', fedorov: '7a' },

  { number: 75, shortName: 'P1', fedorov: '22s' },
  { number: 76, shortName: 'P41', fedorov: '30a' },
  { number: 77, shortName: 'P42', fedorov: '33a' }
];

let c = crystal;

export const options = [
  {
    label: 'Triclinic',
    options: [c[0], c[1]]
  },
  {
    label: 'Monoclinic',
    options: [c[2], c[3], c[4]]
  },
  {
    label: 'Orthorombic',
    options: [c[5], c[6], c[7]]
  },
  {
    label: 'Tetragonal',
    options: [c[8], c[9], c[10]]
  }
];

export const options2 = [
  {
    label: '2m',
    options: [c[5], c[7]]
  },
  {
    label: '2mm',
    options: [c[1], c[2], c[3]]
  },
  {
    label: '2mm/2',
    options: [c[4], c[0], c[6]]
  },
  {
    label: '2mm/3',
    options: [c[8]]
  }
];
