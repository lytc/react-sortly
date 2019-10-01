import React from 'react';
import { useDrag, useDrop, ConnectableElement, DragObjectWithType } from 'react-dnd';

import ID from './types/ID';
import ObjectLiteral from './types/ObjectLiteral';
import ItemData from './types/ItemData';
import ItemRendererProps from './types/ItemRendererProps';
import context from './context';
import Connectable from './types/Connectable';

export type ItemProps<D = ObjectLiteral> = {
  type: DragObjectWithType['type'] | (() => DragObjectWithType['type']);
  id: ID;
  index: number;
  data: ItemData<D>;
  isClosestDragging: () => boolean;
  children: (props: ItemRendererProps<D>) => React.ReactElement;
  onHoverBegin: (id: ID, connectedDrop?: React.MutableRefObject<Connectable | undefined>) => void;
  onHoverEnd: (id: ID) => void;
};

function Item<D = ObjectLiteral>(props: ItemProps<D>) {
  const { setDragMonitor, setConnectedDragSource } = React.useContext(context);
  const wasHoveredRef = React.useRef(false);
  const connectedDragRef = React.useRef<Connectable>();
  const connectedDropRef = React.useRef<Connectable>();
  const { 
    type, index, id, data, children, onHoverEnd, onHoverBegin, isClosestDragging 
  } = props;
  const t = typeof type === 'function' ? type() : type;
  const [{ isDragging }, dndDrag, preview] = useDrag({
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
      setConnectedDragSource(connectedDragRef);
    },
    end: () => {
      setDragMonitor(undefined);
    },
  });
  const [{ hovered }, dndDrop] = useDrop({
    accept: t,
    collect: (monitor) => ({
      hovered: monitor.isOver({ shallow: true }),
    }),
  });

  React.useEffect(() => {
    if (hovered) {
      onHoverBegin(id, connectedDropRef);
      wasHoveredRef.current = true;
    } else if (wasHoveredRef.current === true) {
      onHoverEnd(id);
    }
  }, [hovered]);

  const drag = (connectable: ConnectableElement) => {
    const result = dndDrag(connectable);
    // @ts-ignore
    connectedDragRef.current = result;
    return result;
  };

  const drop = (connectable: ConnectableElement) => {
    const result = dndDrop(connectable);
    // @ts-ignore
    connectedDropRef.current = result;
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
