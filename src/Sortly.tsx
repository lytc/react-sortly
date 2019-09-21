import React from 'react';
import { XYCoord } from 'react-dnd';
import { useDebouncedCallback } from 'use-debounce';

import { move, increaseIndent, decreaseIndent, findDescendants } from './utils';
import ItemDataType from './types/ItemDataType';
import Item, { ItemProps } from './Item';

const stats = new global.Stats();
stats.showPanel(0);
stats.dom.style.opacity = 0.3;
stats.dom.style.transition = 'opacity 0.5s';
stats.dom.style.top = '10px';
stats.dom.style.right = '10px';
stats.dom.style.left = 'auto';
document.body.appendChild(stats.dom);

export type SortlyProps<D = ObjectLiteral> = {
  items: ItemDataType<D>[];
  itemRenderer: ItemProps<D>['renderer'];
  rendererProps: ObjectLiteral;
  threshold?: number;
  maxDepth?: number;
  horizontal?: boolean;
  onChange: (items: ItemDataType<D>[]) => void;
};

function Sortly<D = ObjectLiteral>(props: SortlyProps<D>) {
  const { items, itemRenderer, rendererProps, threshold = 20, maxDepth = Infinity, horizontal, onChange } = props;
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
    stats.update();
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
        <Item 
          key={data.id} 
          index={index}
          id={data.id}
          data={data}
          renderer={itemRenderer}
          rendererProps={rendererProps}
          onDragBegin={handleDragBegin}
          onDragEnd={handleDragEnd}
          onMove={handleMove}
          onIndent={handleIndent}
          isClosetDragging={draggingDescendants.includes(data)}
        />
      ))}
    </>
  );
}

export default Sortly;
