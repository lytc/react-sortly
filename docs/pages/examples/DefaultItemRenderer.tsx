import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import { Flipped } from 'react-flip-toolkit';

import { RendererProps } from '../../../src';

type ItemRendererProps = RendererProps<{
  name: string;
}>;

const useStyles = makeStyles((theme: Theme) => ({
  root: (props: ItemRendererProps) => ({
    position: 'relative',
    marginBottom: theme.spacing(1.5),
    zIndex: props.isDragging || props.isClosetDragging ? 1 : 0,
  }),
  body: (props: ItemRendererProps) => ({
    background: '#fff',
    cursor: 'move',
    padding: theme.spacing(2),
    marginLeft: theme.spacing(props.data.depth * 2),
    boxShadow: props.isDragging || props.isClosetDragging ? '0px 0px 8px #666' : '0px 0px 2px #666',
    border: props.isDragging || props.isClosetDragging ? '1px dashed #1976d2' : '1px solid transparent',
  }),
}));

const DefaultItemRenderer = React.memo((props: ItemRendererProps) => {
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
});

export default DefaultItemRenderer;
