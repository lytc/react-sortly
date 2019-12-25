import React from 'react';

import sortlyContext from './sortlyContext';
import ItemData from './types/ItemData';

export default function useItems<D extends ItemData>() {
  const { items } = React.useContext<{ items: D[] }>(sortlyContext);
  return items;
}
