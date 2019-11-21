import React from 'react';

type ItemContext<D> = {
  items: D[];
};

// @ts-ignore
const context = React.createContext<ItemContext>({});

export default context;
