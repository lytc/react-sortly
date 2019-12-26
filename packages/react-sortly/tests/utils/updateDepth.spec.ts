import ItemData from '../../src/types/ItemData';
import { updateDepth } from '../../src/utils';

describe('updateDepth', () => {
  describe('w/o maxDepth', () => {
    const dataProviders: [ItemData[], number, number, ItemData[]][] = [
      [
        [{ id: 1, depth: 0 }, { id: 2, depth: 0 }, { id: 3, depth: 0 }],
        0,
        1,
        [{ id: 1, depth: 0 }, { id: 2, depth: 0 }, { id: 3, depth: 0 }]
      ],
      [
        [{ id: 1, depth: 0 }, { id: 2, depth: 0 }, { id: 3, depth: 0 }],
        1,
        1,
        [{ id: 1, depth: 0 }, { id: 2, depth: 1 }, { id: 3, depth: 0 }]
      ],
      [
        [{ id: 1, depth: 0 }, { id: 2, depth: 0 }, { id: 3, depth: 0 }],
        2,
        1,
        [{ id: 1, depth: 0 }, { id: 2, depth: 0 }, { id: 3, depth: 1 }]
      ],
      [
        [{ id: 1, depth: 0 }, { id: 2, depth: 0 }, { id: 3, depth: 1 }],
        1,
        1,
        [{ id: 1, depth: 0 }, { id: 2, depth: 1 }, { id: 3, depth: 2 }]
      ],
    ];

    dataProviders.forEach((data, i) => {
      test(`with dataset #${i}`, () => {
        const [items, index, depth, expected] = data;
        expect(updateDepth(items, index, depth)).toEqual(expected);
      });
    });
  });

  describe('with maxDepth', () => {
    const dataProviders: [ItemData[], number, number, number, ItemData[]][] = [
      [
        [{ id: 1, depth: 0 }, { id: 2, depth: 0 }, { id: 3, depth: 1 }],
        1,
        1,
        1,
        [{ id: 1, depth: 0 }, { id: 2, depth: 0 }, { id: 3, depth: 1 }]
      ],
      [
        [{ id: 1, depth: 0 }, { id: 2, depth: 1 }, { id: 3, depth: 1 }],
        2,
        2,
        1,
        [{ id: 1, depth: 0 }, { id: 2, depth: 1 }, { id: 3, depth: 1 }]
      ],
      [
        [{ id: 1, depth: 0 }, { id: 2, depth: 1 }, { id: 3, depth: 2 }, { id: 4, depth: 0 }],
        3,
        3,
        2,
        [{ id: 1, depth: 0 }, { id: 2, depth: 1 }, { id: 3, depth: 2 }, { id: 4, depth: 2 }]
      ]
    ];

    dataProviders.forEach((data, i) => {
      test(`with dataset #${i}`, () => {
        const [items, index, depth, maxDepth, expected] = data;
        expect(updateDepth(items, index, depth, maxDepth)).toEqual(expected);
      });
    });
  });
});
