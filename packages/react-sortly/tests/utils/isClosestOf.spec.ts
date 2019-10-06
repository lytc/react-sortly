import ItemData from '../../src/types/ItemData';
import { isClosestOf } from '../../src/utils';

describe('isClosestOf', () => {
  const dataProviders: [ItemData[], number, number, boolean][] = [
    [
      [{ id: 1, depth: 0 }, { id: 2, depth: 0 }, { id: 3, depth: 0 }],
      1,
      0,
      false
    ],
    [
      [{ id: 1, depth: 0 }, { id: 2, depth: 0 }, { id: 3, depth: 0 }],
      0,
      1,
      false
    ],
    [
      [{ id: 1, depth: 0 }, { id: 2, depth: 0 }, { id: 3, depth: 1 }],
      0,
      2,
      false
    ],
    [
      [{ id: 1, depth: 0 }, { id: 2, depth: 0 }, { id: 3, depth: 1 }],
      1,
      2,
      true
    ],
    [
      [
        { id: 1, depth: 0 },
        { id: 2, depth: 0 },
        { id: 3, depth: 1 },
        { id: 3, depth: 2 }
      ],
      1,
      3,
      true
    ]
  ];

  dataProviders.forEach((data, i) => {
    test(`with dataset #${i}`, () => {
      const [items, index, descendantIndex] = data;
      expect(isClosestOf(items, index, descendantIndex));
    });
  });
});
