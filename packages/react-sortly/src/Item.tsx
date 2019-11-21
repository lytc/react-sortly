import React from 'react';

import ID from './types/ID';
import ItemData from './types/ItemData';
import ItemRendererProps from './types/ItemRendererProps';

export type ItemProps<D extends ItemData> = {
  id: ID;
  depth: number;
  index: number;
  data: ItemData<D>;
  children: (props: ItemRendererProps<D>) => React.ReactElement;
};

function Item<D extends ItemData>(props: ItemProps<D>) {
  const { children, ...rest } = props;
  return children(rest);
}

export default Item;
