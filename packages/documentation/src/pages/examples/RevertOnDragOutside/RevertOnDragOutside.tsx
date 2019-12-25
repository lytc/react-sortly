import React from 'react';
import { Flipper } from 'react-flip-toolkit';
import { Box, makeStyles, Theme } from '@material-ui/core';
import { useDrop } from 'react-dnd';
import clsx from 'clsx';
import { useDebouncedCallback } from 'use-debounce';
import Sortly, { ItemData } from 'react-sortly/src';

import ItemRenderer from './ItemRenderer';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    padding: theme.spacing(4),
    backgroundColor: 'transparent',
    transition: 'background-color .5s',
  },
  hovered: {
    backgroundColor: '#1976d250',
  },
}));

type Item = {
  name: string;
};
const ITEMS: ItemData<Item>[] = [
  { id: 1, name: 'Priscilla Cormier', depth: 0 },
  { id: 2, name: 'Miss Erich Bartoletti', depth: 0 },
  { id: 3, name: 'Alison Friesen', depth: 1 },
  { id: 4, name: 'Bernita Mayert', depth: 2 },
  { id: 5, name: 'Garfield Berge', depth: 0 },
];

const RevertOnDragOutside = () => {
  const [items, setItems] = React.useState(ITEMS);
  const prevItems = React.useRef<ItemData<Item>[]>();
  const handleDragBegin = () => {
    prevItems.current = items;
  };
  const [revert, cancelRevert] = useDebouncedCallback(() => {
    if (prevItems.current) {
      setItems(prevItems.current);
    }
  }, 10);
  const type = 'revert-on-drag-outside';
  const [{ hovered }, drop] = useDrop({
    accept: type,
    collect: (monitor) => ({ 
      hovered: monitor.isOver(),
    }),
    drop() {
      prevItems.current = undefined;
      cancelRevert();
    }
  });

  const handleChange = (newItems: ItemData<Item>[]) => {
    if (hovered) {
      setItems(newItems);
    }
  };

  React.useEffect(() => {
    if (!hovered) {
      revert();
    }
  }, [hovered]);

  const classes = useStyles();
  return (
    <Box width={{ md: 600 }}>
      <div ref={drop} className={clsx(classes.container, { [classes.hovered]: hovered })}>
        <Flipper flipKey={items.map(({ id }) => id).join('.')}>
          <Sortly
            type={type}
            items={items}
            onChange={handleChange}
          >
            {(itemProps) => (
              <ItemRenderer 
                {...itemProps} 
                onBegin={handleDragBegin} 
              />
            )}
          </Sortly>
        </Flipper>
      </div>
    </Box>
  );
};

export default RevertOnDragOutside;
