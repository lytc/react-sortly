import u from 'immutability-helper';
import memoizeOne from 'memoize-one';

import ItemDataType from './types/ItemDataType';

const update = memoizeOne(u);

export const findDescendants = memoizeOne((items: ItemDataType[], index: number) => {
  const item = items[index];
  const descendants: ItemDataType[] = [];

  for (let i = index + 1; i < items.length; i += 1) {
    const next = items[i];
    
    if (next.depth <= item.depth) {
      break;
    }

    descendants.push(next);
  }

  return descendants;
});

export const findDeepestDescendant = memoizeOne((items: ItemDataType[], index: number) => {
  const descendants = findDescendants(items, index);

  if (descendants.length === 0) {
    return null;
  }

  return descendants.reduce(
    (accumulator, currentValue) => accumulator.id > currentValue.id ? accumulator : currentValue,
    descendants[0],
  );
});

export const findParent = memoizeOne((items: ItemDataType[], index: number) => {
  if (index === 0) {
    return null;
  }

  const item = items[index];

  for (let i = index - 1; i >= 0; i -= 1) {
    const prev = items[i];
    if (prev.depth === item.depth - 1) {
      return prev;
    }
  }
  
  return null;
});

export const findPrevSibling = memoizeOne((items: ItemDataType[], index: number) => {
  const item = items[index];

  for (let i = index - 1; i >= 0; i -= 1) {
    const prev = items[i];
    if (prev.depth === item.depth) {
      return prev;
    }
  }

  return null;
});

export const isClosestOf = memoizeOne((items: ItemDataType[], index: number, descendantIndex: number) => {
  if (index >= descendantIndex) {
    return false;
  }

  return findDescendants(items, index).includes(items[descendantIndex]);
});

export const isDescendantOf = memoizeOne((items: ItemDataType[], index: number, closestIndex: number) => {
  if (index <= closestIndex) {
    return false;
  }

  return findDescendants(items, closestIndex).includes(items[index]);
});

export const move = memoizeOne((items: ItemDataType[], sourceIndex: number, targetIndex: number) => {
  const sourceItem = items[sourceIndex];
  const targetItem = items[targetIndex];
  
  if (isClosestOf(items, sourceIndex, targetIndex)) {
    return items;
  }
  const diffDepth = targetItem.depth - sourceItem.depth;
  const descendants = findDescendants(items, sourceIndex);
  let movingItems = [sourceItem, ...descendants];
  const updateDepthFn: any = {};
  movingItems.forEach((item, index) => {
    updateDepthFn[index] = { depth: { $set: item.depth + diffDepth } };
  });
  movingItems = update(movingItems, updateDepthFn);

  const updateFn: any = {};
  let newIndex = targetIndex;
  
  if (sourceIndex < targetIndex) {
    const targetDescendants = findDescendants(items, targetIndex);
    newIndex = targetIndex + targetDescendants.length - descendants.length;
  }

  updateFn.$splice = [
    [sourceIndex, movingItems.length],
    [newIndex, 0, ...movingItems]
  ];

  return update(items, updateFn);
});

export const increaseIndent = memoizeOne((
  items: ItemDataType[], index: number, maxDepth?: number
) => {
  // Don't allow to increase if it's the first item
  if (index === 0) {
    return items;
  }

  // Can't increase if it don't have prev sibling
  const prevSibling = findPrevSibling(items, index);

  if (!prevSibling) {
    return items;
  }

  const item = items[index];
  const descendants = findDescendants(items, index);
  const prevItem = items[index - 1];
  const newDepth = Math.min(item.depth + 1, prevItem.depth + 1);
  let offsetDepth = newDepth - item.depth;  

  if (maxDepth !== undefined && maxDepth < Infinity) {
    const itemToCheckMaxDepth = findDeepestDescendant(items, index) || item;

    if (itemToCheckMaxDepth.depth + offsetDepth > maxDepth) {
      offsetDepth = maxDepth - itemToCheckMaxDepth.depth;
    }
  }

  const updateFn: any = {
    [index]: { depth: { $set: item.depth + offsetDepth } }
  };

  descendants.forEach((descendant, i) => {
    updateFn[i + index + 1] = { depth: { $set: descendant.depth + offsetDepth } };
  });

  return update(items, updateFn);
});

export const decreaseIndent = memoizeOne((items: ItemDataType[], index: number) => {
  const item = items[index];
  
  if (item.depth === 0) {
    return items;
  }

  const newDepth = Math.max(item.depth - 1, 0);
  const offsetDepth = item.depth - newDepth; 
  const descendants = findDescendants(items, index);

  const updateFn: any = {
    [index]: { depth: { $set: item.depth - offsetDepth } }
  };

  descendants.forEach((descendant, i) => {
    updateFn[i + index + 1] = { depth: { $set: descendant.depth - offsetDepth } };
  });

  return update(items, updateFn);
});

export const add = (items: ItemDataType[], item: Omit<ItemDataType, 'depth'>) => (
  update(items, { $push: [{ ...item, depth: 0 }] })
);

export const remove = (items: ItemDataType[], index: number) => {
  const descendants = findDescendants(items, index);
  return update(items, {
    $splice: [[index, descendants.length + 1]]
  });
};
