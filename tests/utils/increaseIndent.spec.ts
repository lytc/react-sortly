import ItemDataType from '../../src/types/ItemDataType';
import { increaseIndent } from '../../src/utils';

describe('increaseIndent', () => {
  const dataProviders: [ItemDataType[], number, ItemDataType[]][] = [
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
