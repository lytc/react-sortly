import ItemData from '../../src/types/ItemData';
import { move } from '../../src/utils';

describe('move', () => {
  const dataProviders: [ItemData[], number, number, ItemData[]][] = [
    [
      [{ id: 1, depth: 0 }, { id: 2, depth: 0 }],
      0,
      1,
      [{ id: 2, depth: 0 }, { id: 1, depth: 0 }]
    ],
    [
      [{ id: 1, depth: 0 }, { id: 2, depth: 0 }],
      1,
      0,
      [{ id: 2, depth: 0 }, { id: 1, depth: 0 }]
    ],
    [
      [{ id: 1, depth: 0 }, { id: 2, depth: 0 }, { id: 3, depth: 0 }],
      1,
      2,
      [{ id: 1, depth: 0 }, { id: 3, depth: 0 }, { id: 2, depth: 0 }]
    ],
    [
      [
        { id: 1, depth: 0 },
        { id: 2, depth: 0 },
        { id: 3, depth: 0 },
        { id: 4, depth: 0 },
        { id: 5, depth: 0 }
      ],
      1,
      3,
      [
        { id: 1, depth: 0 },
        { id: 3, depth: 0 },
        { id: 4, depth: 0 },
        { id: 2, depth: 0 },
        { id: 5, depth: 0 }
      ]
    ],
    [
      [
        { id: 1, depth: 0 },
        { id: 2, depth: 0 },
        { id: 3, depth: 1 },
        { id: 4, depth: 2 },
        { id: 5, depth: 0 },
        { id: 6, depth: 0 }
      ],
      1,
      4,
      [
        { id: 1, depth: 0 },
        { id: 5, depth: 0 },
        { id: 2, depth: 0 },
        { id: 3, depth: 1 },
        { id: 4, depth: 2 },
        { id: 6, depth: 0 }
      ]
    ],
    [
      [
        { id: 1, depth: 0 },
        { id: 2, depth: 0 },
        { id: 3, depth: 1 },
        { id: 4, depth: 2 },
        { id: 5, depth: 0 }
      ],
      2,
      1,
      [
        { id: 1, depth: 0 },
        { id: 3, depth: 0 },
        { id: 4, depth: 1 },
        { id: 2, depth: 0 },
        { id: 5, depth: 0 }
      ]
    ]
  ];
  dataProviders.forEach((data, i) => {
    test(`with dataset #${i}`, () => {
      const [items, sourceIndex, targetIndex, expected] = data;
      expect(move(items, sourceIndex, targetIndex)).toEqual(expected);
    });
  });
});
