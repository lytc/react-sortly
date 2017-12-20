import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import style from './ItemRenderer.scss';

const ItemRenderer = (
  { connectDragSource, connectDragPreview, connectDropTarget, isDragging, isClosestDragging, name, color },
) => {
  const className = classNames(style.container, { [style.mute]: isDragging || isClosestDragging });
  return connectDragSource(connectDragPreview(connectDropTarget(
    <div className={className} style={{ background: color }}>
      <div className={style.body}>{name}</div>
    </div>,
  )));
};

ItemRenderer.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
};

export default ItemRenderer;
