import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import { Flipped } from 'react-flip-toolkit';

import { ItemRendererProps } from '../../../src';

type ItemItemRendererProps = ItemRendererProps<{
  name: string;
}>;

const useStyles = makeStyles((theme: Theme) => ({
  root: (props: ItemItemRendererProps) => ({
    position: 'relative',
    marginBottom: theme.spacing(1.5),
    zIndex: props.isDragging || props.isClosestDragging() ? 1 : 0,
    // pointerEvents: props.isDragging || props.isClosestDragging() ? 'none' : 'initial',
  }),
  body: (props: ItemItemRendererProps) => ({
    background: '#fff',
    cursor: 'move',
    padding: theme.spacing(2),
    marginLeft: theme.spacing(props.data.depth * 2),
    boxShadow: props.isDragging || props.isClosestDragging() ? '0px 0px 8px #666' : '0px 0px 2px #666',
    border: props.isDragging || props.isClosestDragging() ? '1px dashed #1976d2' : '1px solid transparent',
  }),
}));

const DefaultItemRenderer = (props: ItemItemRendererProps) => {
  const { data: { id, name }, drag, drop } = props;
  const ref = React.useRef< HTMLDivElement>(null);
  const classes = useStyles(props);
  drag(drop(ref));

  return (
    <Flipped flipId={id}>
      <div ref={ref} className={classes.root}>
        <div className={classes.body}>{name}</div>
      </div>
    </Flipped>
  );
};

export default DefaultItemRenderer;
