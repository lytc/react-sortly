import ItemDataType from '../../src/types/ItemDataType';
import { findParent } from '../../src/utils';

describe('findParent', () => {
  const dataProviders: [ItemDataType[], number, ItemDataType | null][] = [
    [
      [{ id: 1, depth: 0 }, { id: 2, depth: 0 }, { id: 3, depth: 0 }],
      0,
      null,
    ],
    [
      [{ id: 1, depth: 0 }, { id: 2, depth: 0 }, { id: 3, depth: 0 }],
      1,
      null,
    ],
    [
      [{ id: 1, depth: 0 }, { id: 2, depth: 1 }, { id: 3, depth: 0 }],
      1,
      { id: 1, depth: 0 },
    ],
    [
      [{ id: 1, depth: 0 }, { id: 2, depth: 1 }, { id: 3, depth: 2 }],
      2,
      { id: 2, depth: 1 },
    ],
    [
      [{ id: 1, depth: 0 }, { id: 2, depth: 1 }, { id: 3, depth: 2 }, { id: 4, depth: 1 }],
      3,
      { id: 1, depth: 0 },
    ]
  ];

  dataProviders.forEach((data, i) => {
    test(`with dataset #${i}`, () => {
      const [items, index, expected] = data;
      expect(findParent(items, index)).toEqual(expected);
    });
  });
});
