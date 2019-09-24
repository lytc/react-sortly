import u from 'immutability-helper';
import memoizeOne from 'memoize-one';

import Optional from './types/Optional';
import ItemData from './types/ItemData';

/**
 * @hidden
 */
type Fn<TArgs extends unknown[], TResult> = (...args: TArgs) => TResult;

/**
 * @hidden
 */
function memoize<TArgs extends unknown[], TResult>(fn: Fn<TArgs, TResult>): Fn<TArgs, TResult> {
  // @ts-ignore
  return memoizeOne(fn);
}

/**
 * @hidden
 */
// @ts-ignore
const update = memoizeOne(u);

const findDescendants = <T extends ItemData>(items: T[], index: number) => {
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
};

// export const findDescendants: typeof findDescendantsa = memoize(findDescendantsa);

const findDeepestDescendant = <T extends ItemData>(items: T[], index: number) => {
  const descendants = findDescendants(items, index);

  if (descendants.length === 0) {
    return null;
  }

  return descendants.reduce(
    (accumulator, currentValue) => accumulator.id > currentValue.id ? accumulator : currentValue,
    descendants[0],
  );
};

const findParent = <T extends ItemData>(items: T[], index: number) => {
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
};

const findNextSibling = <T extends ItemData>(items: T[], index: number) => {
  const item = items[index];

  for (let i = index + 1; i < items.length; i += 1) {
    const prev = items[i];
    if (prev.depth === item.depth) {
      return prev;
    }
  }

  return null;
};

const findPrevSibling = <T extends ItemData>(items: T[], index: number) => {
  const item = items[index];

  for (let i = index - 1; i >= 0; i -= 1) {
    const prev = items[i];
    if (prev.depth === item.depth) {
      return prev;
    }
  }

  return null;
};

const isNextSibling = <T extends ItemData>(items: T[], index: number, siblingIndex: number) => {
  const nextSibling = findNextSibling(items, index);
  return nextSibling !== null && items.indexOf(nextSibling) === siblingIndex;
};

const isPrevSibling = <T extends ItemData>(items: T[], index: number, siblingIndex: number) => {
  const prevSibling = findPrevSibling(items, index);
  return prevSibling !== null && items.indexOf(prevSibling) === siblingIndex;
};

const isClosestOf = <T extends ItemData>(items: T[], index: number, descendantIndex: number) => {
  if (index >= descendantIndex) {
    return false;
  }

  return findDescendants(items, index).includes(items[descendantIndex]);
};

const isDescendantOf = <T extends ItemData>(items: T[], index: number, closestIndex: number) => {
  if (index <= closestIndex) {
    return false;
  }

  return findDescendants(items, closestIndex).includes(items[index]);
};

const move = <T extends ItemData>(items: T[], sourceIndex: number, targetIndex: number) => {
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
};

const indent = <T extends ItemData>(
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
};

const outdent = <T extends ItemData>(items: T[], index: number) => {
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
};

const add = <T extends ItemData>(items: T[], data: Optional<T, 'depth'> | Optional<T, 'depth'>[]) => {
  let newItems = (Array.isArray(data) ? data : [data]) // eslint-disable-line no-param-reassign
    .map((item) => ({ ...item, depth: item.depth || 0 })) as T[];
  const first = newItems[0];
  const reduceDepth = first.depth;
  
  if (reduceDepth > 0) {
    newItems = newItems.map((item) => ({ ...item, depth: item.depth - reduceDepth }));
  }

  return update(items, { $push: newItems });
};

const remove = <T extends ItemData>(items: T[], index: number) => {
  const descendants = findDescendants(items, index);

  return update(items, {
    $splice: [[index, descendants.length + 1]]
  });
};

/**
 * @hidden
 */
const memoizedFindDescendants = memoize(findDescendants) as typeof findDescendants;
/**
 * @hidden
 */
const memoizedFindDeepestDescendant = memoize(findDeepestDescendant) as typeof findDeepestDescendant;
/**
 * @hidden
 */
const memoizedFindParent = memoize(findParent) as typeof findParent;
/**
 * @hidden
 */
const memoizedFindNextSibling = memoize(findNextSibling) as typeof findNextSibling;
/**
 * @hidden
 */
const memoizedFindPrevSibling = memoize(findPrevSibling) as typeof findPrevSibling;
/**
 * @hidden
 */
const memoizedIsNextSibling = memoize(isNextSibling) as typeof isNextSibling;
/**
 * @hidden
 */
const memoizedIsPrevSibling = memoize(isPrevSibling) as typeof isPrevSibling;
/**
 * @hidden
 */
const memoizedIsClosestOf = memoize(isClosestOf) as typeof isClosestOf;
/**
 * @hidden
 */
const memoizedIsDescendantOf = memoize(isDescendantOf) as typeof isDescendantOf;
/**
 * @hidden
 */
const memoizedMove = memoize(move) as typeof move;
/**
 * @hidden
 */
const memoizedindent = memoize(indent) as typeof indent;
/**
 * @hidden
 */
const memoizedoutdent = memoize(outdent) as typeof outdent;

export {
  memoizedFindDescendants as findDescendants,
  memoizedFindDeepestDescendant as findDeepestDescendant,
  memoizedFindParent as findParent,
  memoizedFindNextSibling as findNextSibling,
  memoizedFindPrevSibling as findPrevSibling,
  memoizedIsNextSibling as isNextSibling,
  memoizedIsPrevSibling as isPrevSibling,
  memoizedIsClosestOf as isClosestOf,
  memoizedIsDescendantOf as isDescendantOf,
  memoizedMove as move,
  memoizedindent as indent,
  memoizedoutdent as outdent,
  add,
  remove,
};
