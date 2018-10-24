import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';

class Item extends Component {
  static propTypes = {
    renderer: PropTypes.func.isRequired,
    onDragStart: PropTypes.func.isRequired,
    onDragEnd: PropTypes.func.isRequired,
    onMove: PropTypes.func.isRequired,
    onDrop: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    dropTargetMonitor: PropTypes.shape({
      getItem: PropTypes.func.isRequired,
      getDifferenceFromInitialOffset: PropTypes.func.isRequired,
    }).isRequired,
  };

  componentWillReceiveProps(nextProps) {
    const { isOver } = this.props;
    if (nextProps.isOver !== isOver) {
      if (nextProps.isOver) {
        this.reqAnimationFrameId = window.requestAnimationFrame(this.handleHover);
      } else {
        window.cancelAnimationFrame(this.reqAnimationFrameId);
        this.reqAnimationFrameId = null;
      }
    }
  }

  componentWillUnmount() {
    if (this.reqAnimationFrameId) {
      window.cancelAnimationFrame(this.reqAnimationFrameId);
      this.reqAnimationFrameId = null;
    }
  }

  handleHover = () => {
    const {
      index: hoverIndex, maxDepth, isClosestDragging, onMove,
      dropTargetMonitor,
    } = this.props;

    if (!isClosestDragging) {
      const dragItem = dropTargetMonitor.getItem();
      const { index: dragIndex } = dragItem;

      if (maxDepth !== 0 || dragIndex !== hoverIndex) {
        // Determine mouse position
        const initialOffset = dropTargetMonitor.getDifferenceFromInitialOffset();

        // Time to actually perform the action
        const dragNewIndex = onMove(dragIndex, hoverIndex, initialOffset.x);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        if (dragNewIndex !== null) {
          const item = dropTargetMonitor.getItem();
          item.index = dragNewIndex;
        }
      }
    }

    this.reqAnimationFrameId = window.requestAnimationFrame(this.handleHover);
  }

  render() {
    const {
      renderer: Renderer, onDragStart, onDragEnd, onMove, onDrop, dropTargetMonitor, isOver, isClosestDragging, ...props
    } = this.props;
    return <Renderer {...props} />;
  }
}

const itemTarget = {
  drop(props, monitor) {
    if (!monitor.didDrop()) {
      const dragItem = monitor.getItem();
      const { index: dragIndex } = dragItem;
      const { index: dropIndex } = props;

      props.onDrop(dragIndex, dropIndex);
    }
  },
};

const dropCollect = (connect, monitor) => ({
  dropTargetMonitor: monitor,
  isOver: monitor.isOver(),
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
