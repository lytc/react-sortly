import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Theme, IconButton, Box, InputBase } from '@material-ui/core';
import ReorderIcon from '@material-ui/icons/Reorder';
import CloseIcon from '@material-ui/icons/Close';
import { Flipped } from 'react-flip-toolkit';
import { useDebouncedCallback } from 'use-debounce';

import { ID, ItemRendererProps, useDrag, useDrop, useIsClosestDragging } from 'react-sortly/src';

const useStyles = makeStyles<
Theme, { muted: boolean; depth: number }>((theme: Theme) => ({
  root: (props) => ({
    position: 'relative',
    marginBottom: theme.spacing(1.5),
    zIndex: props.muted ? 1 : 0,
  }),
  body: (props) => ({
    display: 'flex',
    background: '#fff',
    cursor: 'move',
    marginLeft: theme.spacing(props.depth * 2),
    boxShadow: props.muted ? '0px 0px 8px #666' : '0px 0px 2px #666',
    border: props.muted ? '1px dashed #1976d2' : '1px solid transparent',
  })
}));

type ItemItemRendererProps = ItemRendererProps<{
  name: string;
  isNew?: boolean;
}> & {
  onChangeName: (id: ID, name: string) => void;
  onDelete: (id: ID) => void;
  onReturn: (id: ID) => void;
};

const ItemRenderer = React.memo((props: ItemItemRendererProps) => {
  const { id, depth, data: { name, isNew }, onChangeName, onDelete, onReturn } = props;
  const [handleChangeName] = useDebouncedCallback(onChangeName, 500);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    handleChangeName(id, e.target.value);
  };
  const handleClickDelete = () => {
    onDelete(id);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onReturn(id);
    }
  };
  const [{ isDragging }, drag, preview] = useDrag({
    collect: (monitor) => ({ isDragging: monitor.isDragging() })
  });
  const [, drop] = useDrop();

  const classes = useStyles({
    muted: useIsClosestDragging() || isDragging,
    depth,
  });

  return (
    <Flipped flipId={id}>
      <div ref={(ref) => drop(preview(ref))} className={classes.root}>
        <div className={classes.body}>
          <IconButton ref={drag}><ReorderIcon /></IconButton>
          <Box display="flex" flex={1} px={1}>
            <InputBase
              fullWidth
              defaultValue={name}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              autoFocus={isNew}
            />
          </Box>
          <IconButton onClick={handleClickDelete}><CloseIcon /></IconButton>
        </div>
      </div>
    </Flipped>
  );
});

export default ItemRenderer;
