import React from 'react';
import { DragSourceMonitor } from 'react-dnd';

import context from './context';
import Connectable from './types/Connectable';
import Context from './types/Context';

type ContextProviderProps = {
  children: React.ReactElement | React.ReactElement[];
};

const ContextProvider = (props: ContextProviderProps) => {
  const { children } = props;
  const [dragMonitor, setDragMonitor] = React.useState<DragSourceMonitor>();
  const [connectedDragSource, setConnectedDragSource] = React.useState<React.RefObject<Connectable | undefined>>();
  const [initialDepth, setInitialDepth] = React.useState<number>();

  const value: Context = {
    dragMonitor,
    connectedDragSource,
    setDragMonitor,
    setConnectedDragSource,
    initialDepth,
    setInitialDepth,
  };

  return (
    <context.Provider value={value}>
      {children}
    </context.Provider>
  );
};

export default ContextProvider;
