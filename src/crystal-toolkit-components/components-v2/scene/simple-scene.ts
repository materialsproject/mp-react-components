export const s2 = {
  name: '_ct_StructureMoleculeComponent_1',
  contents: [
    {
      name: 'atoms',
      contents: [
        {
          positions: [
            [4.2, 4.2, 0],
            [0, 4.2, 4.2],
            [0, 4.2, 0],
            [4.2, 0, 4.2],
            [4.2, 4.2, 4.2],
            [0, 0, 0],
            [0, 0, 4.2],
            [4.2, 0, 0]
          ],
          color: '#f9dc3c',
          radius: 0.5,
          tooltip: 'label',
          type: 'spheres',
          clickable: true
        },
        {
          positions: [[2.1, 2.1, 2.1]],
          color: '#a121f6',
          radius: 0.5,
          type: 'spheres',
          clickable: true
        }
      ],
      origin: [-2.1, -2.1, -2.1],
      visible: true
    },
    {
      name: 'bonds',
      contents: [
        {
          positionPairs: [
            [
              [4.2, 4.2, 0],
              [3.1500000000000004, 3.1500000000000004, 1.05]
            ],
            [
              [0, 4.2, 4.2],
              [1.05, 3.1500000000000004, 3.1500000000000004]
            ],
            [
              [0, 4.2, 0],
              [1.05, 3.1500000000000004, 1.05]
            ],
            [
              [4.2, 0, 4.2],
              [3.1500000000000004, 1.05, 3.1500000000000004]
            ],
            [
              [4.2, 4.2, 4.2],
              [3.1500000000000004, 3.1500000000000004, 3.1500000000000004]
            ],
            [
              [0, 0, 0],
              [1.05, 1.05, 1.05]
            ],
            [
              [0, 0, 4.2],
              [1.05, 1.05, 3.1500000000000004]
            ],
            [
              [4.2, 0, 0],
              [3.1500000000000004, 1.05, 1.05]
            ]
          ],
          color: '#f9dc3c',
          radius: 0.1,
          type: 'cylinders',
          clickable: false
        },
        {
          positionPairs: [
            [
              [2.1, 2.1, 2.1],
              [1.05, 1.05, 1.05]
            ],
            [
              [2.1, 2.1, 2.1],
              [3.1500000000000004, 1.05, 1.05]
            ],
            [
              [2.1, 2.1, 2.1],
              [3.1500000000000004, 3.1500000000000004, 3.1500000000000004]
            ],
            [
              [2.1, 2.1, 2.1],
              [3.1500000000000004, 1.05, 3.1500000000000004]
            ],
            [
              [2.1, 2.1, 2.1],
              [1.05, 3.1500000000000004, 1.05]
            ],
            [
              [2.1, 2.1, 2.1],
              [3.1500000000000004, 3.1500000000000004, 1.05]
            ],
            [
              [2.1, 2.1, 2.1],
              [1.05, 1.05, 3.1500000000000004]
            ],
            [
              [2.1, 2.1, 2.1],
              [1.05, 3.1500000000000004, 3.1500000000000004]
            ]
          ],
          color: '#a121f6',
          radius: 0.1,
          type: 'cylinders',
          clickable: false
        }
      ],
      origin: [-2.1, -2.1, -2.1],
      visible: true
    },
    {
      name: 'polyhedra',
      contents: [
        {
          positions: [
            [2.1, 2.1, 2.1],
            [0, 0, 0],
            [4.2, 0, 0],
            [4.2, 4.2, 4.2],
            [4.2, 0, 4.2],
            [0, 4.2, 0],
            [4.2, 4.2, 0],
            [0, 0, 4.2],
            [0, 4.2, 4.2]
          ],
          color: '#a121f6',
          type: 'convex',
          clickable: false
        }
      ],
      origin: [-2.1, -2.1, -2.1],
      visible: true
    },
    {
      name: 'unit_cell',
      contents: [
        {
          name: 'a=4.2, b=4.2, c=4.2, alpha=90.0, beta=90.0, gamma=90.0',
          contents: [
            {
              positions: [
                [0, 0, 0],
                [4.2, 0, 0],
                [0, 0, 0],
                [0, 4.2, 0],
                [0, 0, 0],
                [0, 0, 4.2],
                [4.2, 0, 0],
                [4.2, 4.2, 0],
                [4.2, 0, 0],
                [4.2, 0, 4.2],
                [0, 4.2, 0],
                [4.2, 4.2, 0],
                [0, 4.2, 0],
                [0, 4.2, 4.2],
                [0, 0, 4.2],
                [4.2, 0, 4.2],
                [0, 0, 4.2],
                [0, 4.2, 4.2],
                [4.2, 4.2, 0],
                [4.2, 4.2, 4.2],
                [4.2, 0, 4.2],
                [4.2, 4.2, 4.2],
                [0, 4.2, 4.2],
                [4.2, 4.2, 4.2]
              ],
              type: 'lines',
              clickable: false
            }
          ],
          visible: true
        }
      ],
      origin: [-2.1, -2.1, -2.1],
      visible: true
    },
    {
      name: 'axes',
      contents: [
        {
          positionPairs: [
            [
              [-2.1, -2.1, -2.1],
              [-1.4, -1.4, -5.1]
            ]
          ],
          color: 'red',
          radius: (0.07 / 0.37302772291498865) * 2,
          headLength: 0.24,
          headWidth: 0.14,
          type: 'arrows',
          clickable: false
        },
        {
          positionPairs: [
            [
              [-2.1, -2.1, -2.1],
              [-0.1, -5.5, -7.1]
            ]
          ],
          color: 'green',
          radius: (0.07 / 0.37302772291498865) * 2,
          headLength: 0.24 / 0.37302772291498865,
          headWidth: 0.14 / 0.37302772291498865,
          type: 'arrows',
          clickable: false
        },
        {
          positionPairs: [
            [
              [-2.1, -2.1, -2.1],
              [-7.1, -7.1, -7.1]
            ]
          ],
          color: 'blue',
          radius: (0.07 / 0.37302772291498865) * 2,
          headLength: (0.24 / 0.37302772291498865) * 2,
          headWidth: (0.14 / 0.37302772291498865) * 2,
          type: 'arrows',
          clickable: false
        },
        {
          positions: [[-2.1, -2.1, -2.1]],
          color: 'black',
          radius: 0.0175,
          type: 'spheres',
          clickable: false
        }
      ],
      visible: false
    }
  ],
  origin: [-2.1, -2.1, -2.1],
  visible: true
};

export const scene = {
  name: 'StructureMoleculeComponent',
  contents: [
    {
      name: 'axes',
      contents: [
        {
          positionPairs: [
            [
              [-2.13336842, -1.2940969500000001, -7.74158491],
              [-1.618063699237322, -1.2962610988334031, -6.884580615250245]
            ]
          ],
          color: 'red',
          radius: 0.7,
          headLength: 2.3,
          headWidth: 1.4,
          type: 'arrows',
          clickable: true
        },
        {
          positionPairs: [
            [
              [-2.13336842, -1.2940969500000001, -7.74158491],
              [-1.8972015468796977, -0.8360916583284603, -6.884580615470827]
            ]
          ],
          color: 'green',
          radius: 0.7,
          headLength: 2.3,
          headWidth: 1.4,
          type: 'arrows',
          clickable: true
        },
        {
          positionPairs: [
            [
              [-2.13336842, -1.2940969500000001, -7.74158491],
              [-2.1369361013796637, -1.296261098833144, -6.741593615983197]
            ]
          ],
          color: 'blue',
          radius: 0.7,
          headLength: 2.3,
          headWidth: 1.4,
          type: 'arrows',
          clickable: true
        },
        {
          positions: [[-2.13336842, -1.2940969500000001, -7.74158491]],
          color: 'white',
          radius: 0.175,
          type: 'spheres',
          clickable: true
        }
      ],
      origin: [0, 0, 0]
    }
  ],
  origin: [2.13336842, 1.2940969500000001, 7.74158491]
};
