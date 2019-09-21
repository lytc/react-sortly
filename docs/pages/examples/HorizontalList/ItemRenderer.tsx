import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Theme, Box } from '@material-ui/core';
import { Flipped } from 'react-flip-toolkit';

import { RendererProps } from '../../../../src';

type ItemRendererProps = RendererProps<{
  name: string;
  color: string;
}>;

const useStyles = makeStyles((theme: Theme) => ({
  root: (props: ItemRendererProps) => ({
    width: 150,
    height: 150,
    position: 'relative',
    cursor: 'move',
    padding: theme.spacing(0),
    margin: theme.spacing(1),
    boxShadow: props.isDragging ? '0px 0px 8px #666' : '0px 0px 2px #666',
    border: props.isDragging ? '1px dashed #1976d2' : '1px solid transparent',
    zIndex: props.isDragging ? 1 : 0,
    float: 'left',
    color: '#fff',
  }),
}));

const ItemRenderer = React.memo((props: ItemRendererProps) => {
  const { id, data: { name, color }, drag, drop, preview } = props;
  const ref = React.useRef<any>(null);
  const classes = useStyles(props);
  
  drag(drop(preview(ref)));

  return (
    <Flipped 
      flipId={id} 
    >
      <Box 
        ref={ref} 
        className={classes.root} 
        display="inline-flex" 
        alignItems="center" 
        justifyContent="center"
        p={1}
        bgcolor={color}
      >
        <span>{name}</span>
      </Box>
    </Flipped>
  );
});

export default ItemRenderer;
