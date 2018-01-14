import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';
import { throttle } from './utils';

class Item extends PureComponent {
  static propTypes = {
    renderer: PropTypes.func.isRequired,
    onDragStart: PropTypes.func.isRequired,
    onDragEnd: PropTypes.func.isRequired,
    onMove: PropTypes.func.isRequired,
    onDrop: PropTypes.func.isRequired,
  }

  render() {
    const { renderer: Renderer, onDragStart, onDragEnd, onMove, onDrop, ...props } = this.props;
    return <Renderer {...props} />;
  }
}

const itemTarget = {
  hover: throttle((props, monitor, component) => {
    if (!component) {
      return;
    }

    if (props.isClosestDragging) {
      return;
    }

    const dragItem = monitor.getItem();

    if (!dragItem) {
      return;
    }

    const { index: dragIndex } = dragItem;
    const { index: hoverIndex } = props;

    if (props.maxDepth === 0 && dragIndex === hoverIndex) {
      return;
    }

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    if (!clientOffset) {
      return;
    }

    const initialOffset = monitor.getDifferenceFromInitialOffset();

    // Time to actually perform the action
    const dragNewIndex = props.onMove(dragIndex, hoverIndex, initialOffset.x);
    // dragItem.originalIndex = dragItem.index;
    // dragItem.index = dragNewIndex;

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    if (dragNewIndex !== null) {
      const item = monitor.getItem();
      item.index = dragNewIndex;
    }
  }, 17),

  drop(props, monitor) {
    if (!monitor.didDrop()) {
      const dragItem = monitor.getItem();
      const { index: dragIndex } = dragItem;
      const { index: dropIndex } = props;

      props.onDrop(dragIndex, dropIndex);
    }
  },
};

const dropCollect = connect => ({
  connectDropTarget: connect.dropTarget(),
});

const itemSource = {
  beginDrag(props) {
    const { index } = props;
    props.onDragStart(index);

    return { index };
  },

  endDrag(props, monitor) {
    const { index } = props;
    const didDrop = monitor.didDrop();
    props.onDragEnd(index, didDrop);
  },
};

const dragCollect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging(),
});

export default DropTarget('TREE_ITEM', itemTarget, dropCollect)(DragSource('TREE_ITEM', itemSource, dragCollect)(Item));
