import ItemData from '../../src/types/ItemData';
import { indent } from '../../src/utils';

describe('indent', () => {
  const dataProviders: [ItemData[], number, ItemData[]][] = [
    [
      [{ id: 1, depth: 0 }, { id: 2, depth: 0 }, { id: 3, depth: 0 }],
      0,
      [{ id: 1, depth: 0 }, { id: 2, depth: 0 }, { id: 3, depth: 0 }]
    ]
  ];

  dataProviders.forEach((data, i) => {
    test(`with dataset #${i}`, () => {
      const [items, index, expected] = data;
      expect(indent(items, index, 1)).toEqual(expected);
    });
  });
});
