import React from 'react';

import Context from './types/Context';

const warn = () => {
  console.warn('Please wrap with Provider'); // eslint-disable-line no-console
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
