import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Theme, IconButton, TableRow, TableCell } from '@material-ui/core';
import ReorderIcon from '@material-ui/icons/Reorder';
import { Flipped } from 'react-flip-toolkit';

import { ItemRendererProps, useDrag, useDrop } from 'react-sortly/src';

type ItemItemRendererProps = ItemRendererProps<{
  name: string;
}>;

const useStyles = makeStyles<
Theme, { muted: boolean; depth: number }>({
  root: (props) => ({
    boxShadow: props.muted ? '0px 0px 8px #666' : 'none',
    pointerEvents: props.muted ? 'none' : 'initial',
  }),
});

const ItemRenderer = (props: ItemItemRendererProps) => {
  const { id, depth, data: { name } } = props;
  const [{ isDragging }, drag, preview] = useDrag({
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const [, drop] = useDrop();

  const classes = useStyles({
    muted: isDragging,
    depth,
  });
  return (
    <Flipped flipId={id}>
      <TableRow ref={(ref: HTMLTableRowElement) => drop(preview(ref))} className={classes.root}>
        <TableCell style={{ width: 40 }}>
          <IconButton ref={drag}><ReorderIcon /></IconButton>
        </TableCell>
        <TableCell>
          {name}
        </TableCell>
      </TableRow>
    </Flipped>
  );
};

export default ItemRenderer;
