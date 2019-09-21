import React from 'react';
import { Flipper } from 'react-flip-toolkit';
import { Box } from '@material-ui/core';
import { name, internet } from 'faker/locale/en';

import Sortly, { ItemDataType } from '../../../../src';
import ItemRenderer from './ItemRenderer';

type Item = ItemDataType<{
  name: string;
  color: string;
}>;
const generate = (numItems: number): Item[] => (
  Array
    .from(Array(numItems).keys())
    .map((index) => ({ 
      id: index + 1, 
      name: name.findName(), 
      color: internet.color(),
      depth: 0,
    }))
);

const HorizontalList = () => {
  const [items, setItems] = React.useState(generate(6));
  const handleChange = (newItems: Item[]) => {
    setItems(newItems);
  };

  return (
    <Box>
      <Flipper
        flipKey={items.map(({ id }) => id).join('.')}
      >
        <Box>
          <Sortly<Item>
            maxDepth={0}
            horizontal
            items={items}
            itemRenderer={ItemRenderer}
            onChange={handleChange}
          />
        </Box>
      </Flipper>
    </Box>
  );
};

export default HorizontalList;
