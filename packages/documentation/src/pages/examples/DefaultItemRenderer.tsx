import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import { Flipped } from 'react-flip-toolkit';

import { ItemRendererProps, useDrag, useDrop, useIsClosestDragging } from 'react-sortly/src';

type ItemItemRendererProps = ItemRendererProps<{
  name: string;
}>;
const useStyles = makeStyles<
Theme, { muted: boolean; depth: number }>((theme: Theme) => ({
  root: (props) => ({
    position: 'relative',
    marginBottom: theme.spacing(1.5),
    zIndex: props.muted ? 1 : 0,
  }),
  body: (props) => ({
    background: '#fff',
    cursor: 'move',
    padding: theme.spacing(2),
    marginLeft: theme.spacing(props.depth * 2),
    boxShadow: props.muted ? '0px 0px 8px #666' : '0px 0px 2px #666',
    border: props.muted ? '1px dashed #1976d2' : '1px solid transparent',
  }),
}));

const DefaultItemRenderer = (props: ItemItemRendererProps) => {
  const { id, depth, data: { name } } = props;
  const [{ isDragging }, drag] = useDrag({
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const [, drop] = useDrop();
  const classes = useStyles({
    muted: useIsClosestDragging() || isDragging,
    depth,
  });

  return (
    <Flipped flipId={id}>
      <div ref={(ref) => drop(ref)} className={classes.root}>
        <div ref={drag} className={classes.body}>{name}</div>
      </div>
    </Flipped>
  );
};

export default DefaultItemRenderer;
