import u from 'immutability-helper';
import memoizeOne from 'memoize-one';

import Optional from './types/Optional';
import ItemData from './types/ItemData';
import ObjectLiteral from './types/ObjectLiteral';
import ID from './types/ID';

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

const getSiblings = <T extends ItemData>(items: T[], index: number) => {
  const item = items[index];
  const parent = findParent(items, index);

  if (!parent) {
    return items.filter(({ depth }) => depth === item.depth);
  }

  const descendants = findDescendants(items, items.indexOf(parent));
  return descendants.filter(({ depth }) => depth === item.depth);
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

const updateDepth = <T extends ItemData>(
  items: T[],
  index: number,
  depth: number,
  maxDepth = Infinity
) => {
  depth = Math.max(depth, 0); // eslint-disable-line no-param-reassign
  const item = items[index];

  if (depth === item.depth) {
    return items;
  }

  if (depth > item.depth) {
    if (index === 0) {
      return items;
    }
    const prev = items[index - 1];
    depth = Math.min(depth, prev.depth + 1); // eslint-disable-line no-param-reassign
  } else if (findNextSibling(items, index)) {
    return items;
  }

  let offsetDepth = depth - item.depth;
  if (maxDepth < Infinity) {
    const itemToCheckMaxDepth = findDeepestDescendant(items, index) || item;

    if (itemToCheckMaxDepth.depth + offsetDepth > maxDepth) {
      offsetDepth = maxDepth - itemToCheckMaxDepth.depth;
    }
  }

  const descendants = findDescendants(items, index);
  const updateFn: any = {
    [index]: { depth: { $set: depth } }
  };

  descendants.forEach((descendant, i) => {
    updateFn[i + index + 1] = {
      depth: { $set: descendant.depth + offsetDepth }
    };
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

const insert = <T extends ItemData>(items: T[], data: Optional<T, 'depth'> | Optional<T, 'depth'>[], targetIndex: number) => {
  const currentItemAtIndex = items[targetIndex];
  const currentItemDescendants = findDescendants(items, targetIndex);
  const { depth } = currentItemAtIndex;
  const newItem = { ...data, depth } as T;

  return update(items, {
    $splice: [[targetIndex + currentItemDescendants.length + 1, 0, newItem]]
  });
};

const remove = <T extends ItemData>(items: T[], index: number) => {
  const descendants = findDescendants(items, index);

  return update(items, {
    $splice: [[index, descendants.length + 1]]
  });
};

const convert = <T extends ObjectLiteral & { id: ID; parentId?: null | ID; index: number }>(
  items: T[],
  parentId?: null | ID,
  depth?: number,
): ItemData<T>[] => {
  const result = items
    .filter((item) => {
      if (parentId === undefined) {
        return !item.parentId;
      }
      return item.parentId === parentId;
    })
    .sort((a, b) => a.index - b.index)
    .map((item) => {
      const { index, parentId: parent, ...data } = item;
      return { ...data, depth: depth || 0 } as ItemData<T>;
    });

  [...result].forEach((item) => {
    const children = convert(items, item.id, item.depth + 1);
    result.splice(result.indexOf(item) + 1, 0, ...children);
  });

  return result;
};

const buildTree = <T extends ObjectLiteral>(
  items: ItemData<T>[],
  depth = 0
): (T & { children: T[] })[] => {
  const buildChildren = (item: ItemData<T>) => {
    const descendants = findDescendants(items, items.indexOf(item));
    return buildTree(descendants, depth + 1);
  };
  const tree = items.filter((item) => item.depth === depth)
    .map((item) => {
      const { depth: d, ...data } = item;
      return {
        ...data,
        children: buildChildren(item)
      } as (T & { children: T[] });
    });

  return tree;
};

const flatten = <T extends ItemData>(items: T[]) => (
  items.map((item, index) => {
    const { depth, ...data } = item;
    const parent = findParent(items, index);
    const siblings = getSiblings(items, index);

    return {
      ...data,
      index: siblings.indexOf(item),
      parentId: parent ? parent.id : 0
    };
  })
);

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
const memoizedUpdateDepth = memoize(updateDepth) as typeof updateDepth;

/**
 * @hidden
 */
const memoizedConvert = memoize(convert) as typeof convert;

/**
 * @hidden
 */
const memoizedBuildTree = memoize(buildTree) as typeof buildTree;

/**
 * @hidden
 */
const memoizedFlatten = memoize(flatten) as typeof flatten;

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
  memoizedUpdateDepth as updateDepth,
  add,
  insert,
  remove,
  memoizedConvert as convert,
  memoizedBuildTree as buildTree,
  memoizedFlatten as flatten,
};
