import ItemDataType from '../../src/types/ItemDataType';
import { isDescendantOf } from '../../src/utils';

describe('isDescendantOf', () => {
  const dataProviders: [ItemDataType[], number, number, boolean][] = [
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
      2,
      0,
      false
    ],
    [
      [{ id: 1, depth: 0 }, { id: 2, depth: 0 }, { id: 3, depth: 1 }],
      2,
      1,
      true
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
      true
    ]
  ];

  dataProviders.forEach((data, i) => {
    test(`with dataset #${i}`, () => {
      const [items, index, closestIndex] = data;
      expect(isDescendantOf(items, index, closestIndex));
    });
  });
});
