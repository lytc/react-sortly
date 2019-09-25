import React from 'react';
import { Flipper } from 'react-flip-toolkit';
import { Box, Table, TableBody, Paper } from '@material-ui/core';

import Sortly, { ItemData } from '../../../../src';
import ItemRenderer from './ItemRenderer';

type Item = ItemData<{
  name: string;
}>;
const ITEMS: Item[] = [
  { id: 1, name: 'Priscilla Cormier', depth: 0 },
  { id: 2, name: 'Miss Erich Bartoletti', depth: 0 },
  { id: 3, name: 'Alison Friesen', depth: 0 },
  { id: 4, name: 'Bernita Mayert', depth: 0 },
  { id: 5, name: 'Garfield Berge', depth: 0 },
];

const TableSortable = () => {
  const [items, setItems] = React.useState(ITEMS);
  const handleChange = (newItems: Item[]) => {
    setItems(newItems);
  };

  return (
    <Box width={{ md: 600 }}>
      <Paper>
        <Flipper
          flipKey={items.map(({ id }) => id).join('.')}
        >
          <Table size="small">
            <TableBody>
              <Sortly<Item>
                maxDepth={0}
                items={items}
                onChange={handleChange}
              >
                {ItemRenderer}
              </Sortly>
            </TableBody>
          </Table>
        </Flipper>
      </Paper>
    </Box>
  );
};

export default TableSortable;
