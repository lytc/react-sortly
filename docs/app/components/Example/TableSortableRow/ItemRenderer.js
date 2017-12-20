import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import style from './ItemRenderer.scss';

const ItemRenderer = (
  { connectDragSource, connectDragPreview, connectDropTarget, isDragging, isClosestDragging, id, name, email },
) => {
  const className = classNames(style.container, { [style.mute]: isDragging || isClosestDragging });
  return connectDragSource(connectDragPreview(connectDropTarget(
    <tr className={className}>
      <td>{id}</td>
      <td>{name}</td>
      <td>{email}</td>
    </tr>,
  )));
};

ItemRenderer.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
};

export default ItemRenderer;
