import React from 'react';

import Context from './types/Context';

const warn = () => {
  console.warn('Please wrap with Provider');
};

const context = React.createContext<Context>({
  setDragMonitor: () => {
    warn();
  },
  setConnectedDragSource: () => {
    warn();
  },
});

export default context;
