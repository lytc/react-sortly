import ItemData from '../../src/types/ItemData';
import { findPrevSibling } from '../../src/utils';

describe('findPrevSibling', () => {
  const dataProviders: [ItemData[], number, ItemData | null][] = [
    [
      [{ id: 1, depth: 0 }, { id: 2, depth: 0 }, { id: 3, depth: 0 }],
      0,
      null,
    ],
    [
      [{ id: 1, depth: 0 }, { id: 2, depth: 1 }],
      1,
      null,
    ],
    [
      [{ id: 1, depth: 0 }, { id: 2, depth: 0 }, { id: 3, depth: 0 }],
      1,
      { id: 1, depth: 0 },
    ],
    [
      [{ id: 1, depth: 0 }, { id: 2, depth: 1 }, { id: 3, depth: 2 }, { id: 4, depth: 1 }],
      3,
      { id: 2, depth: 1 },
    ],
  ];

  dataProviders.forEach((data, i) => {
    test(`with dataset #${i}`, () => {
      const [items, index, expected] = data;
      expect(findPrevSibling(items, index)).toEqual(expected);
    });
  });
});
