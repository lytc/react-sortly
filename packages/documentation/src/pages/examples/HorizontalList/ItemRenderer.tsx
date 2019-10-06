import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import { Flipped } from 'react-flip-toolkit';

import { ItemRendererProps } from 'react-sortly/src';

type ItemItemRendererProps = ItemRendererProps<{
  name: string;
  color: string;
}>;

const useStyles = makeStyles((theme: Theme) => ({
  root: (props: ItemItemRendererProps) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 150,
    position: 'relative',
    cursor: 'move',
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    boxShadow: props.isDragging ? '0px 0px 8px #666' : '0px 0px 2px #666',
    border: props.isDragging ? '1px dashed #1976d2' : '1px solid transparent',
    zIndex: props.isDragging ? 1 : 0,
    float: 'left',
    color: '#fff',
    backgroundColor: props.data.color,
  }),
}));

const ItemRenderer = React.memo((props: ItemItemRendererProps) => {
  const { id, data: { name }, drag, drop, preview } = props;
  const ref = React.useRef<any>(null);
  const classes = useStyles(props);
  
  drag(drop(preview(ref)));

  return (
    <Flipped flipId={id}>
      <div ref={ref} className={classes.root}>
        <span>{name}</span>
      </div>
    </Flipped>
  );
});

export default ItemRenderer;
