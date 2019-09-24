import ItemData from '../../src/types/ItemData';
import { increaseIndent } from '../../src/utils';

describe('increaseIndent', () => {
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
      expect(increaseIndent(items, index, 1)).toEqual(expected);
    });
  });
});
