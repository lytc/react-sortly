import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import style from './ItemRenderer.scss';

const Folder = ({ name, collapsed, index, onToggleCollapse }) => {
  const handleClick = () => {
    onToggleCollapse(index);
  };
  return (
    <div className={classNames(style.body, style.folder)}>
      <button className={style.toggleCollapseHandle} onClick={handleClick}>
        <i className={classNames(style.icon, 'fa', { 'fa-folder-o': collapsed, 'fa-folder-open-o': !collapsed })} />
      </button>
      {name}
    </div>
  );
};
Folder.propTypes = {
  name: PropTypes.string.isRequired,
  collapsed: PropTypes.bool,
  index: PropTypes.number.isRequired,
  onToggleCollapse: PropTypes.func.isRequired,
};
Folder.defaultProps = {
  collapsed: false,
};

const File = ({ name, collapsed }) => (
  <div className={classNames(style.body, style.file, { [style.collapsed]: collapsed })}>
    <i className={classNames(style.icon, 'fa fa-file-o')} />
    {name}
  </div>
);
File.propTypes = {
  name: PropTypes.string.isRequired,
  collapsed: PropTypes.bool,
};

File.defaultProps = {
  collapsed: false,
};

const ItemRenderer = (props) => {
  const { connectDragSource, connectDragPreview, connectDropTarget, isDragging, isClosestDragging, type, path }
  = props;
  const className = classNames(style.container, { [style.mute]: isDragging || isClosestDragging });
  return connectDragSource(connectDragPreview(connectDropTarget(
    <div className={className} style={{ paddingLeft: path.length * 20 }}>
      {type === 'folder' && <Folder {...props} />}
      {type === 'file' && <File {...props} />}
    </div>,
  )));
};

ItemRenderer.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['folder', 'file']).isRequired,
  collapsed: PropTypes.bool,
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
};

export default ItemRenderer;
