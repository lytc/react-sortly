import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Theme, IconButton, Box, InputBase } from '@material-ui/core';
import ReorderIcon from '@material-ui/icons/Reorder';
import CloseIcon from '@material-ui/icons/Close';
import { Flipped } from 'react-flip-toolkit';
import { useDebouncedCallback } from 'use-debounce';

import { RendererProps } from '../../../../src';

const useStyles = makeStyles((theme: Theme) => ({
  root: (props: ItemRendererProps) => ({
    position: 'relative',
    marginBottom: theme.spacing(1.5),
    zIndex: props.isDragging || props.isClosetDragging ? 1 : 0,
  }),
  body: (props: ItemRendererProps) => ({
    display: 'flex',
    background: '#fff',
    cursor: 'move',
    marginLeft: theme.spacing(props.data.depth * 2),
    boxShadow: props.isDragging || props.isClosetDragging ? '0px 0px 8px #666' : '0px 0px 2px #666',
    border: props.isDragging || props.isClosetDragging ? '1px dashed #1976d2' : '1px solid transparent',
  })
}));

type ItemRendererProps = RendererProps<{
  name: string;
}> & {
  onChangeName: (id: ID, name: string) => void;
  onDelete: (id: ID) => void;
};

const ItemRenderer = React.memo((props: ItemRendererProps) => {
  const { id, data: { name }, drag, drop, preview, onChangeName, onDelete } = props;
  const dropRef = React.useRef<any>(null);
  const moveHandlerRef = React.useRef<HTMLButtonElement | null>(null);
  const classes = useStyles(props);
  const [handleChangeName] = useDebouncedCallback(onChangeName, 500);
  const handleChange = React.useCallback((e) => {
    handleChangeName(id, e.target.value);
  }, []);
  const handleClickDelete = React.useCallback(() => {
    onDelete(id);
  }, []);

  drag(moveHandlerRef);
  drop(preview(dropRef));

  return (
    <Flipped flipId={id}>
      <div ref={dropRef} className={classes.root}>
        <div className={classes.body}>
          <IconButton ref={moveHandlerRef}><ReorderIcon /></IconButton>
          <Box display="flex" flex={1} px={1}>
            <InputBase fullWidth defaultValue={name} onChange={handleChange} />
          </Box>
          <IconButton onClick={handleClickDelete}><CloseIcon /></IconButton>
        </div>
      </div>
    </Flipped>
  );
});

export default ItemRenderer;
