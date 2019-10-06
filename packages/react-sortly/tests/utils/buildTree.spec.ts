import { buildTree } from '../../src/utils';

describe('buildTree', () => {
  test('', () => {
    const items = [
      { id: 1, depth: 0, name: 'item 1' },
      { id: 3, depth: 1, name: 'item 3' },
      { id: 5, depth: 2, name: 'item 5' },
      { id: 4, depth: 1, name: 'item 4' },
      { id: 2, depth: 0, name: 'item 2' }
    ];

    const expected = [
      {
        id: 1,
        name: 'item 1',
        children: [
          {
            id: 3,
            name: 'item 3',
            children: [
              {
                id: 5,
                name: 'item 5',
                children: []
              }
            ]
          },
          { id: 4, name: 'item 4', children: [] }
        ]
      },
      { id: 2, name: 'item 2', children: [] }
    ];

    expect(buildTree(items)).toEqual(expected);
  });
});
