import React from 'react';

import ID from './types/ID';
import context from './context';
import useItems from './useItems';

export default function useDraggingItem() {
  const { dragMonitor } = React.useContext(context);
  const items = useItems();

  if (!dragMonitor) {
    return null;
  }

  const dragData: { id: ID } = dragMonitor.getItem();

  if (!dragData) {
    return null;
  }

  return items.find(({ id }) => id === dragData.id);
}
