export const bezierScene = {
  name: '_ct_StructureMoleculeComponent_1',
  contents: [
    {
      name: 'atoms',
      clickable: true,
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
          color: '#4444ff',
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
          controlPoints: [
            [
              [4.2, 4.2, 0],
              [3.4, 4, 0],
              [1.4, 1, 0]
            ],
            [
              [0, 4.2, 4.2],
              [3.2, 2.2, 8.1],
              [1.4, 1, 1]
            ],
            [
              [0, 4.2, 0],
              [1, 4.2, -0.4],
              [1.3, 2, 1.3]
            ],
            [
              [4.2, 0, 4.2],
              [3.2, 2, -2],
              [1.2, 2.2, 1.2]
            ],
            [
              [4.2, 4.2, 4.2],
              [3.2, 2, 3.2],
              [1.2, 3.2, 1.2]
            ],
            [
              [0, 0, 0],
              [3.2, -2, 3.2],
              [1.2, 4.2, 1.2]
            ],
            [
              [0, 0, 4.2],
              [3.2, 2, -1.2],
              [1.2, 5.2, 1.2]
            ],
            [
              [4.2, 0, 0],
              [3.2, 2, -2.2],
              [1.2, 6.2, 1.2]
            ]
          ],
          color: ['#f9dc3c', '#a121f6'],
          radius: [0.08, 0.34, 0.13],
          type: 'bezier',
          clickable: true
        },
        {
          positionPairs: [],
          color: '#a121f6',
          radius: 0.1,
          type: 'cylinders',
          tooltip: 'label',
          clickable: true
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
          type: 'convex'
        }
      ],
      origin: [-2.1, -2.1, -2.1],
      tooltip: 'label',
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
              type: 'lines'
            }
          ],
          visible: false
        }
      ],
      origin: [-2.1, -2.1, -2.1],
      visible: false
    },
    {
      name: 'axes',
      contents: [
        {
          positionPairs: [
            [
              [-2.1, -2.1, -2.1],
              [-1.4, -1.4, -3.1]
            ]
          ],
          color: 'red',
          radius: 0.07, // / 0.37302772291498865) * 2,
          headLength: 0.24,
          headWidth: 0.14,
          type: 'arrows',
          clickable: false
        },
        {
          positionPairs: [
            [
              [-2.1, -2.1, -2.1],
              [-0.1, -2.5, -1.1]
            ]
          ],
          color: 'green',
          radius: 0.07, // / 0.37302772291498865) * 2,
          headLength: 0.24, // / 0.37302772291498865,
          headWidth: 0.14, // 0.37302772291498865,
          type: 'arrows',
          clickable: false
        },
        {
          positionPairs: [
            [
              [-2.1, -2.1, -2.1],
              [-1.1, -1.1, -1.1]
            ]
          ],
          color: 'blue',
          radius: 0.07, // 0.37302772291498865) * 2,
          headLength: 0.24, // / 0.37302772291498865) * 2,
          headWidth: 0.14, // / 0.37302772291498865) * 2,
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
