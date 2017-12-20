import update from 'immutability-helper';

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

export function buildTree(
  items: Array<{ id: number|string,
  path: Array<number|string> }>,
): Array<{ id: number|string, children: Array<{ id: number|string }> }> {
  const buildItem = (item) => {
    const { path, ...data } = item;
    return {
      ...data,
      children: items
        .filter(child => child.path.includes(item.id))
        .map(child => buildItem(child)),
    };
  };
  const tree = items
    .filter(item => item.path.length === 0)
    .map(item => buildItem(item));

  return tree;
}

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
  const descendants = items.filter(({ path }) => path.includes(id));
  descendants.forEach((descendantItem) => {
    updateFn[items.indexOf(descendantItem)] = {
      path: { $splice: [[0, descendantItem.path.indexOf(id), ...newPath]] },
    };
  });
  return updateFn;
}

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
  const descendants = items.filter(({ path }) => path.includes(id));
  descendants.forEach((descendantItem) => {
    updateFn[items.indexOf(descendantItem)] = {
      path: { $splice: [[0, descendantItem.path.indexOf(id), ...newPath]] },
    };
  });
  return updateFn;
}

export function moveTreeItem(
  items: Array<{ path: Array<number|string> }>, sourceIndex: number, targetIndex: number,
): Object|null {
  let sourceItem = items[sourceIndex];
  const targetItem = items[targetIndex];
  const { id: dragId } = sourceItem;
  let descendants = items.filter(({ path }) => path.includes(dragId));

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
    const hoverDescendants = items.filter(item => item.path.includes(targetItem.id));
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

export function insert(items: Array<{ path: Array<number|string> }>, targetIndex: number, itemData: Object): Object {
  const currentItemAtIndex = items[targetIndex];
  const currentItemDescendants = items.filter(({ path }) => path.includes(currentItemAtIndex.id));
  const path = [...currentItemAtIndex.path];
  const newItem = { ...itemData, path };

  return { $splice: [[targetIndex + currentItemDescendants.length + 1, 0, newItem]] };
}
