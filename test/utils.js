import { expect } from 'chai';
import update from 'immutability-helper';

import {
  convert, buildTree, flatten, findDescendants, increaseTreeItem, decreaseTreeItem, moveTreeItem, add, insert, remove,
} from '../src/utils';

describe('utils', () => {
  it('#convert should work correctly if parentId prop is omit in the first level items', () => {
    const items = [
      { id: 1, index: 0 },
      { id: 2, index: 1 },
      { id: 3, parentId: 1, index: 0 },
      { id: 4, parentId: 1, index: 1 },
      { id: 5, parentId: 3, index: 0 },
    ];

    const expected = [
      { id: 1, path: [] },
      { id: 3, path: [1] },
      { id: 5, path: [1, 3] },
      { id: 4, path: [1] },
      { id: 2, path: [] },
    ];

    expect(convert(items)).to.deep.equal(expected);
  });

  [{ name: 'null', value: null }, { name: 'zero', value: 0 }, { name: 'an empty string', value: '' }]
    .forEach(({ name, value }) => {
      it(`#convert should work correctly if parentId of the first level items is ${name}`, () => {
        const items = [
          { id: 1, parentId: value, index: 0 },
          { id: 2, parentId: value, index: 1 },
          { id: 3, parentId: 1, index: 0 },
          { id: 4, parentId: 1, index: 1 },
          { id: 5, parentId: 3, index: 0 },
        ];

        const expected = [
          { id: 1, path: [] },
          { id: 3, path: [1] },
          { id: 5, path: [1, 3] },
          { id: 4, path: [1] },
          { id: 2, path: [] },
        ];

        expect(convert(items)).to.deep.equal(expected);
      });
    });

  it('#buildTree should work correctly', () => {
    const items = [
      { id: 1, path: [] },
      { id: 3, path: [1] },
      { id: 5, path: [1, 3] },
      { id: 4, path: [1] },
      { id: 2, path: [] },
    ];

    const expected = [
      {
        id: 1,
        children: [
          {
            id: 3,
            children: [{
              id: 5, children: [],
            }],
          },
          { id: 4, children: [] },
        ],
      },
      { id: 2, children: [] },
    ];

    expect(buildTree(items)).to.deep.equal(expected);
  });

  it('#flatten should work correctly', () => {
    const items = [
      { id: 1, path: [] },
      { id: 3, path: [1] },
      { id: 5, path: [1, 3] },
      { id: 4, path: [1] },
      { id: 2, path: [] },
    ];

    const expected = [
      { id: 1, parentId: 0, index: 0 },
      { id: 3, parentId: 1, index: 0 },
      { id: 5, parentId: 3, index: 0 },
      { id: 4, parentId: 1, index: 1 },
      { id: 2, parentId: 0, index: 1 },
    ];

    expect(flatten(items)).to.deep.equal(expected);
  });

  it('#findDescendants should work correctly', () => {
    const items = [
      { id: 1, path: [] },
      { id: 2, path: [1] },
      { id: 3, path: [1, 2] },
    ];

    const expected = [
      { id: 2, path: [1] },
      { id: 3, path: [1, 2] },
    ];

    expect(findDescendants(items, 0)).to.deep.equal(expected);
  });

  describe('#increaseTreeItem', () => {
    it('should work correctly', () => {
      const items = [
        { id: 1, path: [] },
        { id: 2, path: [1] },
        { id: 3, path: [1, 2] },
      ];

      const expected = [
        { id: 1, path: [] },
        { id: 2, path: [] },
        { id: 3, path: [2] },
      ];

      expect(update(items, increaseTreeItem(items, 1))).to.deep.equal(expected);
    });

    it('should returns null if it\'s the root level item', () => {
      const items = [
        { id: 1, path: [] },
        { id: 2, path: [] },
      ];
      expect(increaseTreeItem(items, 1)).to.equal(null);
    });

    it('should returns null if it have next siblings', () => {
      const items = [
        { id: 1, path: [] },
        { id: 2, path: [1] },
        { id: 3, path: [1] },
      ];
      expect(increaseTreeItem(items, 1)).to.equal(null);
    });
  });

  describe('#decreaseTreeItem', () => {
    it('should work correctly', () => {
      const items = [
        { id: 1, path: [] },
        { id: 2, path: [] },
        { id: 3, path: [2] },
      ];

      const expected = [
        { id: 1, path: [] },
        { id: 2, path: [1] },
        { id: 3, path: [1, 2] },
      ];

      expect(update(items, decreaseTreeItem(items, 1))).to.deep.equal(expected);
    });

    it('should returns null if it don\' have prev sibling', () => {
      const items = [
        { id: 1, path: [] },
        { id: 2, path: [1] },
      ];

      expect(decreaseTreeItem(items, 1)).to.equal(null);
    });
  });

  describe('#moveTreeItem', () => {
    it('move up should work correctly', () => {
      const items = [
        { id: 1, path: [] },
        { id: 2, path: [] },
        { id: 3, path: [2] },
      ];
      const expected = [
        { id: 2, path: [] },
        { id: 3, path: [2] },
        { id: 1, path: [] },
      ];
      const { updateFn, newIndex } = moveTreeItem(items, 1, 0);
      expect(update(items, updateFn)).to.deep.equal(expected);
      expect(newIndex).to.equal(0);
    });

    it('move down should work correctly', () => {
      const items = [
        { id: 2, path: [] },
        { id: 3, path: [2] },
        { id: 1, path: [] },
      ];
      const expected = [
        { id: 1, path: [] },
        { id: 2, path: [] },
        { id: 3, path: [2] },
      ];
      const { updateFn, newIndex } = moveTreeItem(items, 0, 2);
      expect(update(items, updateFn)).to.deep.equal(expected);
      expect(newIndex).to.equal(1);
    });
  });

  it('#add should work correctly', () => {
    const items = [
      { id: 1, path: [] },
      { id: 2, path: [1] },
    ];
    const expected = [
      { id: 1, path: [] },
      { id: 2, path: [1] },
      { id: 3, path: [], name: 'foo' },
    ];

    expect(add(items, { id: 3, name: 'foo' })).to.deep.equal(expected);
  });

  it('#insert should work correctly', () => {
    const items = [
      { id: 1, path: [] },
      { id: 2, path: [] },
      { id: 3, path: [2] },
      { id: 4, path: [2] },
    ];

    const itemData = { id: 5, name: 'item 5' };

    const expected = [
      { id: 1, path: [] },
      { id: 2, path: [] },
      { id: 3, path: [2] },
      { id: 5, path: [2], name: 'item 5' },
      { id: 4, path: [2] },
    ];

    expect(insert(items, 2, itemData)).to.deep.equal(expected);
  });

  it('#remove should work correctly', () => {
    const items = [
      { id: 1, path: [] },
      { id: 2, path: [] },
      { id: 3, path: [2] },
      { id: 4, path: [2, 3] },
    ];

    const expected = [
      { id: 1, path: [] },
    ];

    expect(remove(items, 1)).to.deep.equal(expected);
  });
});
