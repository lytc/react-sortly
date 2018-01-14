import update from 'immutability-helper';

export function throttle(callback: Function, wait: number) {
  let timeout = null;
  let callbackArgs = null;

  const later = () => {
    callback(...callbackArgs);
    timeout = null;
  };

  return function run(...args) {
    if (!timeout) {
      callbackArgs = args;
      timeout = setTimeout(later, wait);
    }
  };
}

/**
 * Convert the raw item list to the Sortly item list
 * @param {Array} items The raw item list
 * @param {String} parentId The parent id property. Default to "parentId"
 * @param {Array} path The parent path
 * @return {Array}
 */
export function convert(
  items: Array<{ id: number|string, parentId: number|string, index: number }>,
  parentId: number|string = 0,
  path: Array<number|string> = [],
): Array<{ id: number|string, path: Array<number|string> }> {
  const result = items
    .filter(item => item.parentId === parentId)
    .sort((a, b) => a.index - b.index)
    .map((item) => {
      const { index, parentId: parent, ...data } = item;
      return { ...data, path: [...path] };
    });

  [...result].forEach((item) => {
    const children = convert(items, item.id, [...path, item.id]);
    result.splice(result.indexOf(item) + 1, 0, ...children);
  });


  return result;
}

/**
 * Convert the Sortly item list to the tree struct
 * @param {Array} items The Sortly item list
 * @return {Array}
 */
export function buildTree(
  items: Array<{ id: number|string,
  path: Array<number|string> }>,
): Array<{ id: number|string, children: Array<{ id: number|string }> }> {
  const buildItem = (item) => {
    const { path, ...data } = item;
    return {
      ...data,
      children: items
        .filter(child => child.path[child.path.length - 1] === item.id)
        .map(child => buildItem(child)),
    };
  };
  const tree = items
    .filter(item => item.path.length === 0)
    .map(item => buildItem(item));

  return tree;
}

/**
 * Convert the Sortly item list to the raw item list
 * Useful when you want to convert the item list to store into database
 * @param {Array} items The Sortly item list
 * @param {String} parentIdPropName The parent id property name. Default to "parentId"
 * @param {String} indexPropName The index property name. Default to "index"
 * @return {Array}
 */
export function flatten(
  items: Array<{ path: Array<number|string> }>,
  parentIdPropName: string = 'parentId',
  indexPropName: string = 'index',
): Array {
  const indexSeq = {};
  return items.map((item) => {
    const { path, ...data } = item;
    const pathAsString = path.join('.');
    if (indexSeq[pathAsString] === undefined) {
      indexSeq[pathAsString] = 0;
    } else {
      indexSeq[pathAsString] += 1;
    }
    return {
      ...data, [parentIdPropName]: [...path].pop() || 0, [indexPropName]: indexSeq[pathAsString],
    };
  });
}

/**
 * Find item descendants
 * @param {Array} items The item list
 * @param {Number} index The item position
 * @return {Array.<{path: Array.<number|string>}>}
 */
export function findDescendants(items: Array<{ path: Array<number|string> }>, index: number): Array {
  const { id } = items[index];
  return items.filter(({ path }) => path.includes(id));
}

/**
 * Increase the tree item to 1 level depth
 * @param {Array} items The item list
 * @param {Number} itemIndex The position of the item to increase
 * @return {null|Object}
 */
export function increaseTreeItem(items: Array<{ path: Array<number|string> }>, itemIndex: number): Object|null {
  const updateFn = {};
  const item = items[itemIndex];
  const { id } = item;

  // Don't allow to increase if it's root
  if (item.path.length === 0) {
    return null;
  }

  // Can't increase if it have next siblings
  const nextSiblingItem = items.find((siblingItem, index) =>
    index > itemIndex && siblingItem.path.join('.') === item.path.join('.'),
  );

  if (nextSiblingItem) {
    return null;
  }

  // It should have the path same as it parent
  const newPath = item.path.slice(0, -1);

  // update drag item path
  updateFn[itemIndex] = { path: { $set: newPath } };

  // also needs to update it descendants path
  const descendants = findDescendants(items, itemIndex);
  descendants.forEach((descendantItem) => {
    updateFn[items.indexOf(descendantItem)] = {
      path: { $splice: [[0, descendantItem.path.indexOf(id), ...newPath]] },
    };
  });
  return updateFn;
}

/**
 * Decrease the tree item to 1 level depth
 * @param {Array} items The item list
 * @param {Number} itemIndex The position of the item to decrease
 * @return {null|Object}
 */
export function decreaseTreeItem(items: Array<{ path: Array<number|string> }>, itemIndex: number): Object|null {
  const updateFn = {};
  const item = items[itemIndex];
  const { id } = item;

  // Can't decrease if it don't have prev sibling
  const prevSiblingItem = items
    .filter((siblingItem, index) =>
      index < itemIndex && siblingItem.path.join('.') === item.path.join('.'),
    )
    .pop();

  if (!prevSiblingItem) {
    return null;
  }

  const newPath = [...prevSiblingItem.path, prevSiblingItem.id];

  // update drag item path
  updateFn[itemIndex] = { path: { $set: newPath } };

  // also needs to update it descendants path
  const descendants = findDescendants(items, itemIndex);
  descendants.forEach((descendantItem) => {
    updateFn[items.indexOf(descendantItem)] = {
      path: { $splice: [[0, descendantItem.path.indexOf(id), ...newPath]] },
    };
  });
  return updateFn;
}

/**
 * Move an item to a new position
 * @param {Array} items The item list
 * @param {Number} sourceIndex The current position of the item to move
 * @param {Number} targetIndex The new position of the item to move
 * @return {{updateFn: {}, newIndex: number}}
 */
export function moveTreeItem(
  items: Array<{ path: Array<number|string> }>, sourceIndex: number, targetIndex: number,
): Object|null {
  let sourceItem = items[sourceIndex];
  const targetItem = items[targetIndex];
  const { id: dragId } = sourceItem;
  let descendants = findDescendants(items, sourceIndex);

  const updateFn = {};

  // update drag item path
  const newPath = [...targetItem.path];
  sourceItem = update(sourceItem, { path: { $set: newPath } });

  // update descendants path
  descendants = descendants.map(descendantItem =>
    update(descendantItem, {
      path: {
        $set: update(descendantItem.path, {
          $splice: [[0, descendantItem.path.indexOf(dragId), ...newPath]],
        }),
      },
    }),
  );

  let newIndex = targetIndex;
  // move up
  if (sourceIndex > targetIndex) {
    updateFn.$splice = [
      // remove it and descendants from the list
      [sourceIndex, 1 + descendants.length],
      // insert drag item and it descendants to the new position
      [targetIndex, 0, sourceItem, ...descendants],
    ];
  } else { // move down
    const hoverDescendants = findDescendants(items, targetIndex);
    newIndex = (targetIndex + hoverDescendants.length) - descendants.length;
    updateFn.$splice = [
      // remove it and descendants from the list
      [sourceIndex, 1 + descendants.length],
      // insert drag item and it descendants to the new position
      [newIndex, 0, sourceItem, ...descendants],
    ];
  }

  return { updateFn, newIndex };
}

/**
 * Add a new item to the bottom of the list
 * @param {Array} items The item list
 * @param {Object} itemData The item data
 * @return {Array}
 */
export function add(items: Array<{ path: Array<number|string> }>, itemData: { id: number|string }): Array {
  const item = { ...itemData, path: [] };
  return update(items, { $push: [item] });
}

/**
 * Insert a new item to the list
 * @param {Array} items The item list
 * @param {Number} targetIndex The position to insert into
 * @param {Object} itemData The item data
 * @return {Array}
 */
export function insert(items: Array<{ path: Array<number|string> }>,
  targetIndex: number, itemData: { id: number|string }): Object {
  const currentItemAtIndex = items[targetIndex];
  const currentItemDescendants = findDescendants(items, targetIndex);
  const path = [...currentItemAtIndex.path];
  const newItem = { ...itemData, path };

  return update(items, { $splice: [[targetIndex + currentItemDescendants.length + 1, 0, newItem]] });
}

/**
 * Remove an item and it descendants from the list
 * @param {Array} items The item list
 * @param {Number} index The item index
 * @return {Array}
 */
export function remove(items: Array<{ path: Array<number|string> }>, index: number): Array {
  const descendants = findDescendants(items, index);

  return update(items, { $splice: [[index, 1 + descendants.length]] });
}
