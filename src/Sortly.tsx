import React from 'react';
import { DragSourceMonitor } from 'react-dnd';
import update from 'immutability-helper';
import { useDebouncedCallback } from 'use-debounce';

import ID from './types/ID';
import ObjectLiteral from './types/ObjectLiteral';
import ItemData from './types/ItemData';
import DragObject from './types/DragObject';
import HoverRef from './types/HoverRef';
import { move, indent, outdent, isClosestOf, isNextSibling, isPrevSibling } from './utils';
import Item, { ItemProps } from './Item';
import useAnimationFrame from './useAnimationFrame';
import context from './context';

export type SortlyProps<D = ObjectLiteral> = {
  type?: ItemProps<D>['type'];
  items: ItemData<D>[];
  threshold?: number;
  maxDepth?: number;
  horizontal?: boolean;
  onChange: (items: ItemData<D>[]) => void;
  children: ItemProps<D>['children'];
};

/**
 * @hidden
 */
type DndData = { 
  dragMonitor?: DragSourceMonitor; 
  hoverId?: ID; 
  hoverRef?: HoverRef;
};

/**
 * @hidden
 */
const isRef = (obj: any) => (
  // eslint-disable-next-line no-prototype-builtins
  obj !== null && typeof obj === 'object' && obj.hasOwnProperty('current')
);

/**
 * @hidden
 */
const getElConnectableElement = (hoverRef: HoverRef) => {
  if (!hoverRef.current) {
    return null;
  }
  
  const { current } = hoverRef;
  const el = isRef(current) 
    ? (current as React.RefObject<Element>).current : (current as Element);
  
  return el;
};

/**
 * @hidden
 */
const detectMove = <T extends ItemData>(
  items: T[],
  dragMonitor: DragSourceMonitor,
  dragId: ID, 
  targetId: ID, 
  dropEl: Element,
  horizontal?: boolean
) => {
  const pointerOffset = dragMonitor.getClientOffset();

  if (!pointerOffset) {
    return items;
  }

  const targetBoundingRect = dropEl.getBoundingClientRect();
  const sourceIndex = items.findIndex(({ id }) => id === dragId);
  const targetIndex = items.findIndex(({ id }) => id === targetId);

  if (sourceIndex === -1 || targetIndex === -1) {
    return items;
  }

  if (!horizontal) {
    const hoverMiddleY = (targetBoundingRect.bottom - targetBoundingRect.top) / 2;
    const hoverClientY = pointerOffset.y - targetBoundingRect.top;
    if (
      (hoverClientY < hoverMiddleY && isNextSibling(items, sourceIndex, targetIndex)) // Dragging downwards
      || (hoverClientY > hoverMiddleY && isPrevSibling(items, sourceIndex, targetIndex)) // Dragging upwards
    ) {
      return items;
    }
  } else {
    const hoverMiddleX = (targetBoundingRect.right - targetBoundingRect.left) / 2;
    const hoverClientX = pointerOffset.x - targetBoundingRect.left;

    if (
      (hoverClientX < hoverMiddleX && isNextSibling(items, sourceIndex, targetIndex)) // Dragging forwards
      || (hoverClientX > hoverMiddleX && isPrevSibling(items, sourceIndex, targetIndex)) // Dragging backwards
    ) {
      return items;
    }
  }

  return move(items, sourceIndex, targetIndex);
};

/**
 * @hidden
 */
const detectIndent = <T extends ItemData>(
  items: T[], 
  dragMonitor: DragSourceMonitor, 
  dragId: ID,
  dropEl: Element,
  threshold: number,
  maxDepth: number,
) => {
  if (maxDepth === 0) {
    return items;
  }

  const sourceOffset = dragMonitor.getSourceClientOffset();
  const targetBoundingRect = dropEl.getBoundingClientRect();

  if (!sourceOffset) {
    return items;
  }
  
  const movementX = sourceOffset.x - targetBoundingRect.left;

  if (Math.abs(movementX) < threshold) {
    return items;
  }

  const index = items.findIndex(({ id }) => id === dragId);
  
  if (index === -1) {
    return items;
  }

  return movementX > 0 ? indent(items, index, maxDepth) : outdent(items, index);
};

/**
 * @hidden
 */
const typeSeq = (() => {
  let seq = 0;
  return () => {
    seq += 1;
    return `SORTLY-${seq}`;
  };
})();

function Sortly<D extends ItemData>(props: SortlyProps<D>) {
  const { 
    type = typeSeq(), items, children, threshold = 20, maxDepth = Infinity, horizontal, onChange 
  } = props;
  const { dragMonitor } = React.useContext(context);
  const dndData = React.useRef<DndData>({});
  const [requestAnim, cancelAnim] = useAnimationFrame(useDebouncedCallback(() => {
    const { hoverId, hoverRef } = dndData.current;
    if (!dragMonitor || !hoverId || !hoverRef) {
      return;
    }

    const dragItem: DragObject = dragMonitor.getItem();

    if (!dragItem) {
      return;
    }

    const dropElement = getElConnectableElement(hoverRef);
    if (!dropElement) {
      return;
    }

    const { id: dragId } = dragItem;
    let newItems;
    if (dragId === hoverId) {
      newItems = detectIndent(items, dragMonitor, dragId, dropElement, threshold, maxDepth);
    } else {
      newItems = detectMove(items, dragMonitor, dragId, hoverId, dropElement, horizontal);
    }

    if (newItems !== items) {
      onChange(newItems);
    }
  }, 10)[0]);

  const handleHoverBegin = React.useCallback((id: ID, hoverRef: HoverRef) => {
    dndData.current = update(dndData.current, { hoverId: { $set: id }, hoverRef: { $set: hoverRef } });
  }, [items]);

  const handleHoverEnd = React.useCallback((id: ID) => {
    if (dndData.current.hoverId === id) {
      dndData.current = update(dndData.current, { hoverId: { $set: undefined }, hoverRef: { $set: undefined } });
    }
  }, [items]);

  React.useEffect(() => {
    if (dragMonitor) {
      requestAnim();
    } else {
      cancelAnim();
    }

    return () => {
      cancelAnim();
    };
  }, [dragMonitor]);

  const isClosestDragging = React.useCallback((index: number) => () => {
    if (!dragMonitor) {
      return false;
    }

    const dragData: DragObject = dragMonitor.getItem();

    if (!dragData) {
      return false;
    }

    const dragIndex = items.findIndex(({ id }) => id === dragData.id);
    
    if (dragIndex === -1) {
      return false;
    }

    return isClosestOf(items, dragIndex, index);
  }, [items]);

  return (
    <>
      {items.map((data, index) => (
        <Item<D>
          key={data.id} 
          type={type}
          index={index}
          id={data.id}
          data={data}
          onHoverBegin={handleHoverBegin}
          onHoverEnd={handleHoverEnd}
          isClosestDragging={isClosestDragging(index)}
        >
          {children}
        </Item>
      ))}
    </>
  );
}

export default Sortly;
