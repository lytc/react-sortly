import React from 'react';
import { Flipper } from 'react-flip-toolkit';
import { Box, Paper } from '@material-ui/core';
import { random, system } from 'faker/locale/en';
import update from 'immutability-helper';

import Sortly, { ID, ItemData, findDescendants } from 'react-sortly/src';
import ItemRenderer from './ItemRenderer';

type Item = {
  name: string;
  type: 'folder' | 'file';
  collapsed?: boolean;
};
const ITEMS: ItemData<Item>[] = [
  { id: 1, name: random.word(), type: 'folder', depth: 0 },
  { id: 2, name: system.fileName(), type: 'file', depth: 1, canParent: false },
  { id: 3, name: system.fileName(), type: 'file', depth: 1, canParent: false },
  { id: 4, name: system.fileName(), type: 'file', depth: 1, canParent: false },
  { id: 5, name: random.word(), type: 'folder', depth: 0 },
  { id: 6, name: system.fileName(), type: 'file', depth: 1, canParent: false },
  { id: 7, name: system.fileName(), type: 'file', depth: 1, canParent: false },
  { id: 8, name: system.fileName(), type: 'file', depth: 1, canParent: false },
  { id: 9, name: random.word(), type: 'folder', collapsed: true, depth: 0 },
  { id: 10, name: system.fileName(), type: 'file', collapsed: true, depth: 1, canParent: false },
  { id: 11, name: system.fileName(), type: 'file', collapsed: true, depth: 1, canParent: false },
  { id: 12, name: system.fileName(), type: 'file', collapsed: true, depth: 1, canParent: false },
  { id: 13, name: random.word(), type: 'folder', depth: 0 },
  { id: 14, name: system.fileName(), type: 'file', depth: 1, canParent: false },
  { id: 15, name: system.fileName(), type: 'file', depth: 1, canParent: false },
  { id: 16, name: system.fileName(), type: 'file', depth: 1, canParent: false },
];
const FileTree = () => {
  const [items, setItems] = React.useState(ITEMS);
  const handleChange = (newItems: ItemData<Item>[]) => {
    setItems(newItems);
  };
  const handleToggleCollapse = (id: ID) => {
    const index = items.findIndex((item) => item.id === id);
    const item = items[index];
    const { collapsed } = item;
    const descendants = findDescendants(items, index);
    const updateFn: any = {
      [index]: { collapsed: { $set: !collapsed } },
    };

    descendants.forEach((descendant) => {
      const descendantIndex = items.indexOf(descendant);
      updateFn[descendantIndex] = { collapsed: { $set: !collapsed } };
    });

    setItems(update(items, updateFn));
  };

  return (
    <Box width={{ md: 600 }}>
      <Paper>
        <Box p={2}>
          <Flipper
            flipKey={items.map(({ id }) => id).join('.')}
          >
            <Sortly<Item>
              items={items}
              onChange={handleChange}
            >
              {(props) => <ItemRenderer {...props} onToggleCollapse={handleToggleCollapse} />}
            </Sortly>
          </Flipper>
        </Box>
      </Paper>
    </Box>
  );
};

export default FileTree;
