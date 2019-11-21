import React from 'react';
import { DragSourceMonitor, DragObjectWithType } from 'react-dnd';
import update from 'immutability-helper';
import { useDebouncedCallback } from 'use-debounce';

import ID from './types/ID';
import ItemData from './types/ItemData';
import DragObject from './types/DragObject';
import { move, updateDepth, isNextSibling, isPrevSibling } from './utils';
import useAnimationFrame from './useAnimationFrame';
import context from './context';
import sortlyContext from './sortlyContext';
import Connectable from './types/Connectable';
import itemContext from './itemContext';
import Item, { ItemProps } from './Item';

export type SortlyProps<D extends ItemData> = {
  type?: DragObjectWithType['type'] | (() => DragObjectWithType['type']);
  items: ItemData<D>[];
  threshold?: number;
  maxDepth?: number;
  horizontal?: boolean;
  onChange: (items: D[]) => void;
  children: ItemProps<D>['children'];
};

/**
 * @hidden
 */
type DndData = { 
  dropTargetId?: ID; 
  connectedDropTarget?: React.RefObject<Connectable | undefined>;
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
const getElConnectableElement = (connectedDropTarget?: React.RefObject<Connectable | undefined>) => {
  if (!connectedDropTarget) {
    return null;
  }

  const { current } = connectedDropTarget;
  
  if (!current) {
    return null;
  }

  const el = isRef(current) 
    ? ((current as React.RefObject<Element>).current) : (current as Element);
  
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
  initialDepth: number,
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

  const depth = initialDepth + Math.round(movementX / threshold);
  
  return updateDepth(items, index, depth, maxDepth);
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
  const { dragMonitor, connectedDragSource, initialDepth } = React.useContext(context);
  const dndData = React.useRef<DndData>({});
  const [requestAnim, cancelAnim] = useAnimationFrame(useDebouncedCallback(() => {
    const { dropTargetId, connectedDropTarget } = dndData.current;
    if (!dragMonitor) {
      return;
    }

    const dragItem: DragObject = dragMonitor.getItem();

    if (!dragItem) {
      return;
    }

    const { id: dragId } = dragItem;
    let newItems;

    if (!dropTargetId || dragId === dropTargetId) {
      const el = getElConnectableElement(connectedDropTarget) || getElConnectableElement(connectedDragSource);
      if (initialDepth !== undefined && el) {
        newItems = detectIndent(items, dragMonitor, dragId, el, threshold, initialDepth, maxDepth);
      }
    } else if (connectedDropTarget) {
      const dropElement = getElConnectableElement(connectedDropTarget);
      if (dropElement) {
        newItems = detectMove(items, dragMonitor, dragId, dropTargetId, dropElement, horizontal);
      }
    }

    if (newItems && newItems !== items) {
      onChange(newItems);
    }
  }, 10)[0]);

  const handleHoverBegin = React.useCallback(
    (id: ID, connectedDropTarget?: React.MutableRefObject<Connectable | undefined>) => {
      dndData.current = update(dndData.current, { 
        dropTargetId: { $set: id }, connectedDropTarget: { $set: connectedDropTarget } 
      });
    }, [items]
  );

  const handleHoverEnd = React.useCallback((id: ID) => {
    if (dndData.current.dropTargetId === id) {
      dndData.current = update(dndData.current, { 
        dropTargetId: { $set: undefined }, connectedDropTarget: { $set: undefined }
      });
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

  return (
    <sortlyContext.Provider value={{ items }}>
      {items.map((data, index) => (
        <itemContext.Provider 
          key={data.id} 
          value={{
            index,
            id: data.id, 
            type, 
            depth: data.depth,
            data,
            onHoverBegin: handleHoverBegin,
            onHoverEnd: handleHoverEnd,
          }}
        >
          <Item<D>
            index={index}
            id={data.id}
            depth={data.depth}
            data={data}
          >
            {children}
          </Item>
        </itemContext.Provider>
      ))}
    </sortlyContext.Provider>
  );
}

export default Sortly;
