import React from 'react';
import { 
  useDrag, useDrop, XYCoord, DragElementWrapper, DragSourceOptions, DragPreviewOptions, ConnectableElement
} from 'react-dnd';

import ItemDataType from './types/ItemDataType';
import useAnimationFrame from './useAnimationFrame';

export type ChildrenProps<D = ObjectLiteral> = {
  index: number;
  id: ID;
  data: ItemDataType<D>;
  drag: DragElementWrapper<DragSourceOptions>;
  preview: DragElementWrapper<DragPreviewOptions>;
  drop: DragElementWrapper<any>;
  isDragging: boolean;
  isClosetDragging: boolean;
};

export type ItemProps<D = ObjectLiteral> = {
  id: ID;
  index: number;
  data: ItemDataType<D>;
  onDragBegin: (id: ID) => void;
  onDragEnd: (id: ID) => void;
  onMove: (sourceId: ID, targetId: ID, pointerOffset: XYCoord, hoverMiddleY: ClientRect) => void;
  onIndent: (sourceId: ID, movementX: number) => void;
  isClosetDragging: boolean;
  children: (props: ChildrenProps<D>) => React.ReactElement;
};

function Item<D = ObjectLiteral>(props: ItemProps<D>) {
  let dropRef: ConnectableElement = null;
  const { index, id, data, children, onDragBegin, onDragEnd, onMove, onIndent, isClosetDragging } = props;
  const [{ isDragging }, drag, preview] = useDrag({
    item: { id, type: 'ITEM' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    isDragging: (monitor) => id === monitor.getItem().id,
    begin: () => {
      onDragBegin(id);
    },
    end: () => {
      onDragEnd(id);
    },
  });
  const [collectedDrop, dndDrop] = useDrop({
    accept: 'ITEM',
    collect: (monitor) => ({
      dropMonitor: monitor,
      hovered: monitor.isOver({ shallow: true }),
    })
  });
  const { hovered } = collectedDrop;
  const detectMove = React.useCallback(() => {
    if (!dropRef) {
      return;
    }

    let dropEl: Element | null = null;

    if (dropRef instanceof Element) {
      dropEl = dropRef;
    } else {
      dropEl = (dropRef as React.RefObject<Element>).current;
    }

    if (!dropEl) {
      return;
    }

    const { dropMonitor } = collectedDrop;
    const pointerOffset = dropMonitor.getClientOffset();
    
    if (pointerOffset) {
      const targetBoundingRect = dropEl.getBoundingClientRect();
      const dragItem = dropMonitor.getItem();
      const { id: dragId } = dragItem;
      onMove(dragId, id, pointerOffset, targetBoundingRect);
    }
  }, [data, collectedDrop]);
  const detectIndent = React.useCallback(() => {
    const { dropMonitor } = collectedDrop;
    const diffOffset = dropMonitor.getDifferenceFromInitialOffset();
    const initialSourceOffset = dropMonitor.getInitialSourceClientOffset();

    if (diffOffset && initialSourceOffset) {
      const movementX = diffOffset.x;
      const dragItem = dropMonitor.getItem();
      const { id: dragId } = dragItem;
      onIndent(dragId, movementX);
    }
  }, [data, collectedDrop]);
  const detect = React.useCallback(() => {
    const { dropMonitor } = collectedDrop;

    if (!dropMonitor.isOver()) {
      return null;
    }

    const dragItem = dropMonitor.getItem();
    
    if (!dragItem) {
      return null;
    }

    const { id: dragId } = dragItem;
    
    if (dragId === id) {
      return detectIndent();
    }

    return detectMove();
  }, [data, collectedDrop]);

  const [animate, cancel] = useAnimationFrame(detect);

  React.useEffect(() => {
    if (hovered) {
      animate();
    } else {
      cancel();
    }
  }, [hovered]);
  
  const drop = (ref: ConnectableElement) => {
    const result = dndDrop(ref);
    dropRef = result;
    return result;
  };

  return children({
    index,
    id,
    data,
    drag,
    preview,
    drop,
    isDragging,
    isClosetDragging,
  });
}

export default React.memo(Item) as typeof Item;
