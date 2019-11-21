import React from 'react';
import { 
  useDrag as dndUseDrag, DragObjectWithType, DragSourceHookSpec, ConnectDragSource, ConnectDragPreview 
} from 'react-dnd';

import context from './context';
import itemContext from './itemContext';
import Connectable from './types/Connectable';
import ID from './types/ID';

export default function useDrag<DragObject extends DragObjectWithType, DropResult, CollectedProps>(
  spec?: Partial<DragSourceHookSpec<DragObject, DropResult, CollectedProps>>
): [CollectedProps, ConnectDragSource, ConnectDragPreview] {
  const connectedDragRef = React.useRef<Connectable>();
  const { setDragMonitor, setConnectedDragSource, setInitialDepth } = React.useContext(context);
  const { id, type, depth } = React.useContext(itemContext);
  const [
    collectedProps,
    originalDonnectDragSource,
    connectDragPreview
  ] = dndUseDrag<DragObjectWithType & { id: ID }, DropResult, CollectedProps>({
    ...spec,
    item: {
      type,
      ...(spec && spec.item ? spec.item : {}),
      id,
    },
    begin(monitor) {
      setInitialDepth(depth);
      setDragMonitor(monitor);
      setConnectedDragSource(connectedDragRef);

      if (spec && spec.begin) {
        const result = spec.begin(monitor);
        if (typeof result === 'object') {
          return {
            type,
            ...result,
            id
          };
        }
      }
      return undefined;
    },
    end(...args) {
      setInitialDepth(undefined);
      setDragMonitor(undefined);

      if (spec && spec.end) {
        spec.end(...args);
      }
    }
  });

  const connectDragSource = (...args: Parameters<typeof originalDonnectDragSource>) => {
    const result = originalDonnectDragSource(...args);
    // @ts-ignore
    connectedDragRef.current = result;
    return result;
  };

  return [
    collectedProps, 
    connectDragSource, 
    connectDragPreview,
  ];
}
