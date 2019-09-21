import React from 'react';
import { name } from 'faker/locale/en';
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
  { id: 3, name: 'Alison Friesen', depth: 0 },
  { id: 4, name: 'Bernita Mayert', depth: 0 },
  { id: 5, name: 'Garfield Berge', depth: 0 },
];

const generate = (numItems: number) =>
  Array
    .from(Array(numItems).keys())
    .map(index => ({ id: index + 1, name: name.findName(), depth: 0 }));


const Advanced = () => {
  const [items, setItems] = React.useState(generate(10));
  // const [items, setItems] = React.useState(ITEMS);
  const handleChange = (newItems: Item[]) => {
    setItems(newItems);
  }
  return (
    <Box width={400}>
      <Flipper
        flipKey={items.map(({ id, depth }) => `${id}.${depth}`).join('.')}
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

export default Advanced;
