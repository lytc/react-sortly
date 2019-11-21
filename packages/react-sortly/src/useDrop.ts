import React from 'react';
import { useDrop as dndUseDrop, DragObjectWithType, DropTargetHookSpec, ConnectDropTarget } from 'react-dnd';

import itemContext from './itemContext';
import Connectable from './types/Connectable';

export default function useDrop<DragObject extends DragObjectWithType, DropResult, CollectedProps>(
  spec?: Partial<DropTargetHookSpec<DragObject, DropResult, CollectedProps>>,
): [CollectedProps, ConnectDropTarget] {
  const connectedDropRef = React.useRef<Connectable>();
  const wasHoveredRef = React.useRef(false);
  const { id, type, onHoverBegin, onHoverEnd } = React.useContext(itemContext);
  const { ...rest } = spec || {};
  const [collectedProps, originalConnectDropTarget] = dndUseDrop({
    ...rest,
    accept: type,
    collect: (monitor) => {
      const hovered = monitor.isOver({ shallow: true });
      return {
        hovered,
        ...(spec && spec.collect ? spec.collect(monitor) : {})
      };
    },
  });

  React.useEffect(() => {
    if (collectedProps.hovered) {
      onHoverBegin(id, connectedDropRef);
      wasHoveredRef.current = true;
    } else if (wasHoveredRef.current === true) {
      onHoverEnd(id);
    }
  }, [id, collectedProps.hovered, onHoverBegin, onHoverEnd]);

  const connectDropTarget = (...args: Parameters<typeof originalConnectDropTarget>) => {
    const result = originalConnectDropTarget(...args);
    // @ts-ignore
    connectedDropRef.current = result;
    return result;
  };

  // @ts-ignore
  return [collectedProps, connectDropTarget];
}
