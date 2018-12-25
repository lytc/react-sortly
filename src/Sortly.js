import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { DropTarget } from 'react-dnd';

import { decreaseTreeItem, increaseTreeItem, moveTreeItem, findDescendants } from './utils';
import Item from './Item';

const DEFAULT_TYPE = 'REACT_SORTLY';
let reduceOffset = 0;
const noop = () => {};
class Sortly extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    items: PropTypes.arrayOf(PropTypes.shape({
      path: PropTypes.array.isRequired,
    })).isRequired,
    itemRenderer: PropTypes.func.isRequired,
    threshold: PropTypes.number,
    maxDepth: PropTypes.number,
    cancelOnDragOutside: PropTypes.bool,
    cancelOnDropOutside: PropTypes.bool,
    onMove: PropTypes.func,
    onDragStart: PropTypes.func,
    onDragEnd: PropTypes.func,
    onDrop: PropTypes.func,
    monitor: PropTypes.shape({
      getItem: PropTypes.func.isRequired,
    }).isRequired,
    isOver: PropTypes.bool.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    component: 'div',
    threshold: 20,
    maxDepth: Infinity,
    cancelOnDragOutside: false,
    cancelOnDropOutside: false,
    onMove: null,
    onDragStart: noop,
    onDragEnd: noop,
    onDrop: noop,
  }

  state = { items: this.props.items, draggingDescendants: {} }

  componentWillReceiveProps(nextProps) {
    if (nextProps.items !== this.props.items) {
      this.setState({ items: nextProps.items });
    }

    if (nextProps.isOver !== this.props.isOver) {
      if (nextProps.isOver) {
        this.handleEnter();
      } else {
        this.handleLeave();
      }
    }
  }

  handleDragStart = (dragIndex: number) => {
    this.props.onDragStart(dragIndex);
    // Don't allow to drop to it descendants
    const { items } = this.state;
    this.originalItems = items;

    const descendants = findDescendants(items, dragIndex);

    if (descendants.length > 0) {
      const draggingDescendants = {};
      descendants.forEach(({ id }) => {
        draggingDescendants[id] = true;
      });

      this.setState({ draggingDescendants });
    }
  }

  handleDragEnd = (dragIndex: number, didDrop: boolean) => {
    const { cancelOnDropOutside, onDragEnd, monitor } = this.props;

    onDragEnd(dragIndex, didDrop);

    reduceOffset = 0;
    this.setState({ draggingDescendants: {} });
    if (cancelOnDropOutside) {
      if (!monitor.didDrop()) {
        // restore
        this.setState({ items: this.originalItems });
        this.originalItems = null;
      } else {
        this.change();
      }
    } else {
      this.change();
    }
  }

  handleMove = (dragIndex: number, hoverIndex: number, offsetX: number): number|null => {
    const { items } = this.state;
    let updateFn;
    let newIndex;

    if (dragIndex === hoverIndex) {
      const { threshold, maxDepth } = this.props;

      // Check that if it move horizontally
      if (Math.abs(offsetX + reduceOffset) < threshold) {
        return null;
      }

      // Move to the right, meaning decrease horizontal level
      // It now is a child of it previous sibling
      if (offsetX > 0) {
        // maxDepth check
        if (
          maxDepth < Infinity
          && [items[dragIndex], ...findDescendants(items, dragIndex)].some(({ path }) => path.length >= maxDepth)
        ) {
          return null;
        }

        updateFn = decreaseTreeItem(items, dragIndex);
        if (!updateFn) {
          return null;
        }
        reduceOffset -= threshold;
      } else { // Move to the left, meaning increase horizontal level
        updateFn = increaseTreeItem(items, dragIndex);
        if (!updateFn) {
          return null;
        }
        reduceOffset += threshold;
      }

      newIndex = hoverIndex;
    } else {
      const result = moveTreeItem(items, dragIndex, hoverIndex);
      updateFn = result.updateFn; // eslint-disable-line prefer-destructuring
      newIndex = result.newIndex; // eslint-disable-line prefer-destructuring
    }

    const newState = update(this.state, {
      items: updateFn,
    });

    if (this.props.onMove) {
      const result = this.props.onMove(newState.items, dragIndex, newIndex);

      if (!result) {
        return null;
      }

      if (result !== true) {
        newState.items = result;
      }
    }

    this.setState(newState);

    return newIndex;
  }

  handleEnter = () => {

  }

  handleLeave = () => {
    const { cancelOnDragOutside, monitor } = this.props;

    if (cancelOnDragOutside && !monitor.didDrop()) {
      const dragData = monitor.getItem();
      dragData.index = dragData.originalIndex;
      this.setState({ items: this.originalItems });
    }
  }

  handleDrop = (dragIndex: number, dropIndex: number) => {
    this.props.onDrop(dragIndex, dropIndex);
  }

  change = () => {
    this.props.onChange(this.state.items);
  }

  render() {
    const { type, component: Comp, itemRenderer, connectDropTarget } = this.props;
    const { items, draggingDescendants } = this.state;

    return connectDropTarget(
      <Comp>
        {items.map((item, index) => (
          <Item
            {...item}
            key={item.id}
            __dndType={type}
            index={index}
            renderer={itemRenderer}
            isClosestDragging={draggingDescendants[item.id] === true}
            onDragStart={this.handleDragStart}
            onDragEnd={this.handleDragEnd}
            onMove={this.handleMove}
            onDrop={this.handleDrop}
          />
        ))}
      </Comp>,
    );
  }
}

const spec = {

};

const collect = (connect, monitor) => ({
  monitor,
  isOver: monitor.isOver(),
  connectDropTarget: connect.dropTarget(),
});

const WithDropTarget = DropTarget(props => props.type, spec, collect)(Sortly);
WithDropTarget.defaultProps = {
  type: DEFAULT_TYPE,
};

export default WithDropTarget;
