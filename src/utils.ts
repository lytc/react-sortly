import u from 'immutability-helper';
import memoizeOne from 'memoize-one';

import ItemDataType from './types/ItemDataType';

type Fn<TArgs extends unknown[], TResult> = (...args: TArgs) => TResult; // along with this.

function memoize<TArgs extends unknown[], TResult>(fn: Fn<TArgs, TResult>): Fn<TArgs, TResult> {
  return memoizeOne(fn);
}

const update = memoizeOne(u);


export const findDescendants = memoize(<T extends ItemDataType>(items: T[], index: number) => {
  const item = items[index];
  const descendants: typeof items = [];

  for (let i = index + 1; i < items.length; i += 1) {
    const next = items[i];
    
    if (next.depth <= item.depth) {
      break;
    }

    descendants.push(next);
  }

  return descendants;
});

export const findDeepestDescendant = memoize(<T extends ItemDataType>(items: T[], index: number) => {
  const descendants = findDescendants(items, index);

  if (descendants.length === 0) {
    return null;
  }

  return descendants.reduce(
    (accumulator, currentValue) => accumulator.id > currentValue.id ? accumulator : currentValue,
    descendants[0],
  );
});

export const findParent = memoize(<T extends ItemDataType>(items: T[], index: number) => {
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

export const findPrevSibling = memoize(<T extends ItemDataType>(items: T[], index: number) => {
  const item = items[index];

  for (let i = index - 1; i >= 0; i -= 1) {
    const prev = items[i];
    if (prev.depth === item.depth) {
      return prev;
    }
  }

  return null;
});

export const isClosestOf = memoize(<T extends ItemDataType>(items: T[], index: number, descendantIndex: number) => {
  if (index >= descendantIndex) {
    return false;
  }

  return findDescendants(items, index).includes(items[descendantIndex]);
});

export const isDescendantOf = memoize(<T extends ItemDataType>(items: T[], index: number, closestIndex: number) => {
  if (index <= closestIndex) {
    return false;
  }

  return findDescendants(items, closestIndex).includes(items[index]);
});

export const move = memoize(<T extends ItemDataType>(items: T[], sourceIndex: number, targetIndex: number) => {
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

export const increaseIndent = memoize(<T extends ItemDataType>(
  items: T[], index: number, maxDepth?: number
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

export const decreaseIndent = memoize(<T extends ItemDataType>(items: T[], index: number) => {
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

export const add = <T extends ItemDataType>(items: T[], item: Omit<T, 'depth'>) => (
  update(items, { $push: [{ ...item, depth: 0 }] })
);

export const remove = <T extends ItemDataType>(items: T[], index: number) => {
  const descendants = findDescendants(items, index);
  return update(items, {
    $splice: [[index, descendants.length + 1]]
  });
};
