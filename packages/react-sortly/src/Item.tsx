import React from 'react';

import ItemRendererProps from './types/ItemRendererProps';
import ID from './types/ID';

export type ItemProps<D = { id: ID }> = ItemRendererProps<D> & {
  children: (props: ItemRendererProps<D>) => React.ReactElement;
};

function Item<D = { id: ID }>(props: ItemProps<D>) {
  const { children, ...rest } = props;
  return children(rest);
}

export default Item;
