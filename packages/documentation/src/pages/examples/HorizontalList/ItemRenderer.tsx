import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import { Flipped } from 'react-flip-toolkit';

import { ItemRendererProps, useDrag, useDrop, useIsClosestDragging } from 'react-sortly/src';

type ItemItemRendererProps = ItemRendererProps<{
  name: string;
  color: string;
}>;

const useStyles = makeStyles<
Theme, { muted: boolean; depth: number; color: string }>((theme: Theme) => ({
  root: (props) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 150,
    position: 'relative',
    cursor: 'move',
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    boxShadow: props.muted ? '0px 0px 8px #666' : '0px 0px 2px #666',
    border: props.muted ? '1px dashed #1976d2' : '1px solid transparent',
    zIndex: props.muted ? 1 : 0,
    float: 'left',
    color: '#fff',
    backgroundColor: props.color,
  }),
}));

const ItemRenderer = React.memo((props: ItemItemRendererProps) => {
  const { id, depth, data: { name, color } } = props;
  const [{ isDragging }, drag] = useDrag({
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const [, drop] = useDrop();

  const classes = useStyles({
    muted: useIsClosestDragging() || isDragging,
    depth,
    color,
  });
  

  return (
    <Flipped flipId={id}>
      <div ref={(ref) => drag(drop(ref))} className={classes.root}>
        <span>{name}</span>
      </div>
    </Flipped>
  );
});

export default ItemRenderer;
