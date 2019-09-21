import React from 'react';
import { Flipper } from 'react-flip-toolkit';
import { Box } from '@material-ui/core';

import Sortly, { ItemDataType } from '../../../src';
import DefaultItemRenderer from './DefaultItemRenderer';

type Item = ItemDataType<{
  name: string;
}>;
const ITEMS: Item[] = [
  { id: 1, name: 'Priscilla Cormier', depth: 0 },
  { id: 2, name: 'Miss Erich Bartoletti', depth: 0 },
  { id: 3, name: 'Alison Friesen', depth: 1 },
  { id: 4, name: 'Bernita Mayert', depth: 2 },
  { id: 5, name: 'Garfield Berge', depth: 0 },
];

const Simple = () => {
  const [items, setItems] = React.useState(ITEMS);
  const handleChange = (newItems: Item[]) => {
    setItems(newItems);
  };

  return (
    <Box width={400}>
      <Flipper
        flipKey={items.map(({ id }) => id).join('.')}
      // staggerConfig={{ default: { speed: 0.5 } }}
      >
        <Sortly<{ name: string }>
          items={items}
          itemRenderer={DefaultItemRenderer}
          onChange={handleChange}
        />
      </Flipper>
    </Box>
  );
};

export default Simple;
