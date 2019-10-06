import { convert } from '../../src/utils';

describe('convert', () => {
  const dataProviders: { name: string; value: null | number | string }[] = [

    { name: 'null', value: null },
    { name: 'zero', value: 0 },
    { name: 'an empty string', value: '' }
  ];

  dataProviders.forEach(({ name, value }) => {
    test(`with parentId is ${name}`, () => {
      const items = [
        { id: 1, parentId: value, name: 'item 1', index: 0 },
        { id: 2, parentId: value, name: 'item 2', index: 1 },
        { id: 3, parentId: 1, name: 'item 3', index: 0 },
        { id: 4, parentId: 1, name: 'item 4', index: 1 },
        { id: 5, parentId: 3, name: 'item 5', index: 0 }
      ];

      const expected = [
        { id: 1, depth: 0, name: 'item 1' },
        { id: 3, depth: 1, name: 'item 3' },
        { id: 5, depth: 2, name: 'item 5' },
        { id: 4, depth: 1, name: 'item 4' },
        { id: 2, depth: 0, name: 'item 2' }
      ];

      const result = convert(items);
      expect(result).toEqual(expected);
    });
  });
});
