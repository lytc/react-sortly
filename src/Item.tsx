import React from 'react';
import { useDrag, useDrop, ConnectableElement, DragObjectWithType } from 'react-dnd';

import ItemDataType from './types/ItemDataType';
import HoverRef from './types/HoverRef';
import ItemRendererProps from './types/ItemRendererProps';
import context from './context';

export type ItemProps<D = ObjectLiteral> = {
  type: DragObjectWithType['type'] | (() => DragObjectWithType['type']);
  id: ID;
  index: number;
  data: ItemDataType<D>;
  isClosestDragging: () => boolean;
  children: (props: ItemRendererProps<D>) => React.ReactElement;
  onHoverBegin: (id: ID, ref: HoverRef) => void;
  onHoverEnd: (id: ID) => void;
};

function Item<D = ObjectLiteral>(props: ItemProps<D>) {
  const { setDragMonitor } = React.useContext(context);
  const dropRef = React.useRef<React.RefObject<Element | undefined> | Element>();
  const { 
    type, index, id, data, children, onHoverEnd, onHoverBegin, isClosestDragging 
  } = props;
  const t = typeof type === 'function' ? type() : type;
  const [{ isDragging }, drag, preview] = useDrag({
    item: { 
      id, 
      type: t,
      data 
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    isDragging: (monitor) => id === monitor.getItem().id,
    begin: (monitor) => {
      setDragMonitor(monitor);
    },
    end: () => {
      setDragMonitor(undefined);
    },
  });
  const [{ hovered }, dndDrop] = useDrop({
    accept: t,
    collect: React.useCallback((monitor) => ({
      hovered: monitor.isOver(),
    }), []),
  });

  React.useEffect(() => {
    if (hovered) {
      onHoverBegin(id, dropRef);
    } else {
      onHoverEnd(id);
    }
  }, [hovered]);

  const drop = (ref: ConnectableElement) => {
    const result = dndDrop(ref);
    dropRef.current = result;
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
    isClosestDragging,
  });
}

export default Item;
