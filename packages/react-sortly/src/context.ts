import React from 'react';

import Context from './types/Context';

const warn = () => {
  throw new Error('Expected react-sortly context');
};

const context = React.createContext<Context>({
  setDragMonitor: () => {
    warn();
  },
  setConnectedDragSource: () => {
    warn();
  },
  setInitialDepth: () => {
    warn();
  },
});

export default context;
