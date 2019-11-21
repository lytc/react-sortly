import React from 'react';
import { Flipper } from 'react-flip-toolkit';
import { Box, makeStyles, Theme } from '@material-ui/core';
import { useDrop } from 'react-dnd';
import clsx from 'clsx';

import Sortly, { ItemData } from 'react-sortly/src';
import DefaultItemRenderer from './DefaultItemRenderer';

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
  const [pause, setPause] = React.useState(false);
  const handleChange = (newItems: ItemData<Item>[]) => {
    if (!pause) {
      setItems(newItems);
    }
  };
  const type = 'revert-on-drag-outside';
  const [{ hovered, didDrop }, drop] = useDrop({
    accept: type,
    collect: (monitor) => ({ 
      hovered: monitor.isOver(),
      didDrop: monitor.didDrop(),
    })
  });

  React.useEffect(() => {
    if (!hovered && !didDrop) {
      setPause(true);
      setItems(ITEMS);
    } else {
      setPause(false);
    }
  }, [hovered, didDrop]);

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
            {(itemProps) => <DefaultItemRenderer {...itemProps} />}
          </Sortly>
        </Flipper>
      </div>
    </Box>
  );
};

export default RevertOnDragOutside;
