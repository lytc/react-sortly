import React from 'react';
import { XYCoord } from 'react-dnd';
import { useDebouncedCallback } from 'use-debounce';

import { move, increaseIndent, decreaseIndent, findDescendants } from './utils';
import ItemDataType from './types/ItemDataType';
import Item, { ItemProps } from './Item';

export type SortlyProps<D = ObjectLiteral> = {
  items: ItemDataType<D>[];
  threshold?: number;
  maxDepth?: number;
  horizontal?: boolean;
  onChange: (items: ItemDataType<D>[]) => void;
  children: ItemProps<D>['children'];
};

function Sortly<D = ObjectLiteral>(props: SortlyProps<D>) {
  const { items, children, threshold = 20, maxDepth = Infinity, horizontal, onChange } = props;
  const [draggingId, setDraggingId] = React.useState<ID | null>(null);
  const handleDragBegin = React.useCallback((id: ID) => {
    setDraggingId(id);
  }, []);
  const handleDragEnd = React.useCallback(() => {
    setDraggingId(null);
  }, []);
  const [handleMove] = useDebouncedCallback((
    sourceId: ID, targetId: ID, pointerOffset: XYCoord, targetBoundingRect: ClientRect
  ) => {
    const sourceIndex = items.findIndex(({ id }) => id === sourceId);
    const targetIndex = items.findIndex(({ id }) => id === targetId);
    

    if (!horizontal) {
      const hoverMiddleY = (targetBoundingRect.bottom - targetBoundingRect.top) / 2;
      const hoverClientY = pointerOffset.y - targetBoundingRect.top;
      // Dragging downwards
      if (
        (sourceIndex < targetIndex && hoverClientY < hoverMiddleY) // Dragging downwards
        || (sourceIndex > targetIndex && hoverClientY > hoverMiddleY) // Dragging upwards
      ) {
        return;
      }
    } else {
      const hoverMiddleX = (targetBoundingRect.right - targetBoundingRect.left) / 2;
      const hoverClientX = pointerOffset.x - targetBoundingRect.left;

      if (
        (sourceIndex < targetIndex && hoverClientX < hoverMiddleX) // Dragging forwards
        || (sourceIndex > targetIndex && hoverClientX > hoverMiddleX) // Dragging backwards
      ) {
        return;
      }
    }
      
    const newItems = move(items, sourceIndex, targetIndex);
    
    if (newItems !== items) {
      onChange(newItems);
    }
  }, 1);

  const [handleIndent] = useDebouncedCallback((sourceId: ID, movementX: number) => {
    if (Math.abs(movementX) < threshold) {
      return;
    }

    // const depth = Math.round(movementX / threshold);
    const index = items.findIndex(({ id }) => id === sourceId);
    const newItems = movementX > 0 ? increaseIndent(items, index, maxDepth) 
      : decreaseIndent(items, index);
    if (newItems !== items) {
      onChange(newItems);
    }
  }, 0);

  const draggingDescendants = draggingId ? findDescendants(items, items.findIndex(({ id }) => id === draggingId)) : [];

  return (
    <>
      {items.map((data, index) => (
        <Item<D>
          key={data.id} 
          index={index}
          id={data.id}
          data={data}
          onDragBegin={handleDragBegin}
          onDragEnd={handleDragEnd}
          onMove={handleMove}
          onIndent={handleIndent}
          isClosetDragging={draggingDescendants.includes(data)}
        >
          {children}
        </Item>
      ))}
    </>
  );
}

export default Sortly;
