import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Theme, IconButton, TableRow, TableCell } from '@material-ui/core';
import ReorderIcon from '@material-ui/icons/Reorder';
import { Flipped } from 'react-flip-toolkit';

import { RendererProps } from '../../../../src';

type ItemRendererProps = RendererProps<{
  name: string;
}>;

const useStyles = makeStyles({
  root: (props: ItemRendererProps) => ({
    boxShadow: props.isDragging ? '0px 0px 8px #666' : 'none',
  }),
});

const ItemRenderer = React.memo((props: ItemRendererProps) => {
  const { id, data: { name }, drag, drop, preview } = props;
  const dropRef = React.useRef<any>(null);
  const moveHandlerRef = React.useRef<HTMLButtonElement | null>(null);
  const classes = useStyles(props);
  
  drag(moveHandlerRef);
  drop(preview(dropRef));

  return (
    <Flipped flipId={id}>
      <TableRow ref={dropRef} className={classes.root}>
        <TableCell style={{ width: 40 }}>
          <IconButton ref={moveHandlerRef}><ReorderIcon /></IconButton>
        </TableCell>
        <TableCell>
          {name}
        </TableCell>
      </TableRow>
    </Flipped>
  );
});

export default ItemRenderer;
