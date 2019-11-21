import React from 'react';

import itemContext from './itemContext';
import ItemRendererProps from './types/ItemRendererProps';

export default function useItem<D>() {
  const data = React.useContext<ItemRendererProps<D>>(itemContext);
  return data;
}
