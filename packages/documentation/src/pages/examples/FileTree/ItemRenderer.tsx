import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Theme, Box } from '@material-ui/core';
import FolderIcon from '@material-ui/icons/Folder';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import FileIcon from '@material-ui/icons/InsertDriveFile';
import { Flipped } from 'react-flip-toolkit';

import { ID, ItemRendererProps, useDrag, useDrop, useIsClosestDragging } from 'react-sortly/src';

type ItemItemRendererProps = ItemRendererProps<{
  name: string;
  type: 'folder' | 'file';
  collapsed?: boolean;
}> & {
  onToggleCollapse: (id: ID) => void;
};

const useStyles = makeStyles<
Theme, ItemItemRendererProps & { muted: boolean }>((theme: Theme) => ({
  root: (props) => ({
    display: 'flex',
    alignItems: 'center',
    fontSize: props.data.type === 'folder' ? 20 : 18,
    position: 'relative',
    cursor: 'move',
    padding: props.data.collapsed && props.data.type === 'file' ? 0 : theme.spacing(0.5, 0),
    margin: theme.spacing(0.5),
    marginLeft: theme.spacing(props.depth * 2),
    color: props.muted ? theme.palette.primary.dark : 'inherit',
    zIndex: props.muted ? 1 : 0,
    fontWeight: props.data.type === 'folder' ? 600 : 500,
    height: props.data.collapsed && props.data.type === 'file' ? 0 : 'auto',
    overflow: 'hidden',
  }),
}));

const ItemRenderer = React.memo((props: ItemItemRendererProps) => {
  const { id, depth, data: { type, collapsed, name }, onToggleCollapse } = props;
  const [{ isDragging }, drag] = useDrag({
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const [, drop] = useDrop();

  const handleClick = () => {
    if (type === 'file') {
      return;
    }

    onToggleCollapse(id);
  };

  const classes = useStyles({
    ...props,
    depth,
    muted: useIsClosestDragging() || isDragging,
  });

  return (
    <Flipped flipId={id}>
      <div ref={(ref) => drag(drop(ref))} className={classes.root}>
        <Box onClick={handleClick}>
          {type === 'folder' && !collapsed && <FolderOpenIcon />}
          {type === 'folder' && collapsed && <FolderIcon />}
          {type === 'file' && <FileIcon />}
        </Box>
        <Box display="flex" flex={1} px={1}>
          {name}
        </Box>
      </div>
    </Flipped>
  );
});

export default ItemRenderer;
