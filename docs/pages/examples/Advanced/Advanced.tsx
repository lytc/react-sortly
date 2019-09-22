import React from 'react';
import { Flipper } from 'react-flip-toolkit';
import { Box, Button } from '@material-ui/core';
import update from 'immutability-helper';
import faker from 'faker/locale/en';

import Sortly, { ItemDataType, add, remove } from '../../../../src';
import ItemRenderer from './ItemRenderer';

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

const Advanced = () => {
  const [items, setItems] = React.useState(ITEMS);
  const handleChange = (newItems: Item[]) => {
    setItems(newItems);
  };
  const handleChangeName = React.useCallback((id: ID, name: string) => {
    const index = items.findIndex((item) => item.id === id);
    setItems(update(items, {
      [index]: { name: { $set: name } }
    }));
  }, [items]);
  const handleDelete = React.useCallback((id: ID) => {
    const index = items.findIndex((item) => item.id === id);
    setItems(remove(items, index));
  }, [items]);
  const handleClickAdd = React.useCallback(() => {
    setItems(add(items, {
      id: Date.now(),
      name: faker.name.findName(),
    }));
  }, [items]);

  return (
    <Box width={600}>
      <Flipper
        flipKey={items.map(({ id }) => id).join('.')}
      >
        <Sortly<Item>
          items={items}
          onChange={handleChange}
        >
          {(props) => <ItemRenderer {...props} onChangeName={handleChangeName} onDelete={handleDelete} />}
        </Sortly>
      </Flipper>
      <Box mt={4}>
        <Button variant="outlined" onClick={handleClickAdd}>Add New Item</Button>
      </Box>
    </Box>
  );
};

export default Advanced;
