import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Theme, Box } from '@material-ui/core';
import FolderIcon from '@material-ui/icons/Folder';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import FileIcon from '@material-ui/icons/InsertDriveFile';
import { Flipped } from 'react-flip-toolkit';

import { ID, ItemRendererProps } from 'react-sortly/src';

type ItemItemRendererProps = ItemRendererProps<{
  name: string;
  type: 'folder' | 'file';
  collapsed?: boolean;
}> & {
  onToggleCollapse: (id: ID) => void;
};

const useStyles = makeStyles((theme: Theme) => ({
  root: (props: ItemItemRendererProps) => ({
    display: 'flex',
    alignItems: 'center',
    fontSize: props.data.type === 'folder' ? 20 : 18,
    position: 'relative',
    cursor: 'move',
    padding: props.data.collapsed && props.data.type === 'file' ? 0 : theme.spacing(0.5, 0),
    margin: theme.spacing(0.5),
    marginLeft: theme.spacing(props.data.depth * 2),
    color: props.isDragging || props.isClosestDragging() ? theme.palette.primary.dark : 'inherit',
    zIndex: props.isDragging || props.isClosestDragging() ? 1 : 0,
    fontWeight: props.data.type === 'folder' ? 600 : 500,
    height: props.data.collapsed && props.data.type === 'file' ? 0 : 'auto',
    overflow: 'hidden',
  }),
}));

const ItemRenderer = React.memo((props: ItemItemRendererProps) => {
  const { id, data: { type, collapsed, name }, drag, drop, preview, onToggleCollapse } = props;
  const ref = React.useRef<any>(null);
  const classes = useStyles(props);
  
  drag(drop(preview(ref)));

  const handleClick = () => {
    if (type === 'file') {
      return;
    }

    onToggleCollapse(id);
  };

  return (
    <Flipped flipId={id}>
      <div ref={ref} className={classes.root}>
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
