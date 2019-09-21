import ItemDataType from '../../src/types/ItemDataType';
import { findDescendants } from '../../src/utils';

describe('findDescendants', () => {
  const dataProviders: [ItemDataType[], number, ItemDataType[]][] = [
    [
      [{ id: 1, depth: 0 }, { id: 2, depth: 0 }, { id: 3, depth: 0 }],
      1,
      [],
    ],
    [
      [
        { id: 1, depth: 0 },
        { id: 2, depth: 0 },
        { id: 3, depth: 1 },
        { id: 4, depth: 2 },
        { id: 5, depth: 3 },
        { id: 6, depth: 0 }
      ],
      1,
      [{ id: 3, depth: 1 }, { id: 4, depth: 2 }, { id: 5, depth: 3 }]
    ],
    [
      [{ id: 1, depth: 0 }, { id: 2, depth: 1 }, { id: 3, depth: 0 }],
      2,
      []
    ],
    [
      [
        { id: 1, depth: 0 }, 
        { id: 2, depth: 0 }, 
        { id: 3, depth: 1 },
        { id: 4, depth: 2 },
        { id: 5, depth: 0 },
      ],
      3,
      []
    ]
  ];
  dataProviders.forEach((data, i) => {
    test(`with dataset #${i}`, () => {
      const [items, index, expected] = data;
      expect(findDescendants(items, index)).toEqual(expected);
    });
  });
});
