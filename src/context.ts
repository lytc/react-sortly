import React from 'react';

import Context from './types/Context';

// @ts-ignore
const context = React.createContext<Context>({
  setDragMonitor: () => {},
});

export default context;
