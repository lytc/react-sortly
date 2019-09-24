import React from 'react';
import { DragSourceMonitor } from 'react-dnd';

import context from './context';

type ContextProviderProps = {
  children: React.ReactElement | React.ReactElement[];
};

const ContextProvider = (props: ContextProviderProps) => {
  const { children } = props;
  const [dragMonitor, setDragMonitor] = React.useState<DragSourceMonitor>();

  const value = {
    dragMonitor,
    setDragMonitor: (monitor: DragSourceMonitor) => {
      setDragMonitor(monitor);
    }
  };

  return (
    <context.Provider value={value}>
      {children}
    </context.Provider>
  );
};

export default ContextProvider;
