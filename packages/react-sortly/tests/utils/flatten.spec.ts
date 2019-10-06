import { flatten } from '../../src/utils';

describe('flatten', () => {
  test('', () => {
    const items = [
      { id: 1, depth: 0 },
      { id: 3, depth: 1 },
      { id: 5, depth: 2 },
      { id: 4, depth: 1 },
      { id: 2, depth: 0 }
    ];

    const expected = [
      { id: 1, parentId: 0, index: 0 },
      { id: 3, parentId: 1, index: 0 },
      { id: 5, parentId: 3, index: 0 },
      { id: 4, parentId: 1, index: 1 },
      { id: 2, parentId: 0, index: 1 }
    ];

    expect(flatten(items)).toEqual(expected);
  });
});
