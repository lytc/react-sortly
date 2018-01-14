import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

import { decreaseTreeItem, increaseTreeItem, moveTreeItem, findDescendants } from './utils';
import Item from './Item';

let reduceOffset = 0;
const noop = () => {};
export default class Sortly extends Component {
  static propTypes = {
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    items: PropTypes.arrayOf(PropTypes.shape({
      path: PropTypes.array.isRequired,
    })).isRequired,
    itemRenderer: PropTypes.func.isRequired,
    threshold: PropTypes.number,
    maxDepth: PropTypes.number,
    cancelOnDropOutside: PropTypes.bool,
    onMove: PropTypes.func,
    onDragStart: PropTypes.func,
    ondDragEnd: PropTypes.func,
    onDrop: PropTypes.func,
    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    component: 'div',
    threshold: 20,
    maxDepth: Infinity,
    cancelOnDropOutside: false,
    onMove: null,
    onDragStart: noop,
    ondDragEnd: noop,
    onDrop: noop,
  }

  state = { items: this.props.items, draggingDescendants: {} }

  componentWillReceiveProps(nextProps) {
    if (nextProps.items !== this.props.items) {
      this.setState({ items: nextProps.items });
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
    const { cancelOnDropOutside, ondDragEnd } = this.props;

    if (cancelOnDropOutside && !didDrop) {
      // restore
      this.setState({ items: this.originalItems });
      this.originalItems = null;
    }

    ondDragEnd(dragIndex, didDrop);

    reduceOffset = 0;
    this.setState({ draggingDescendants: {} });
  }

  handleMove = (dragIndex: number, hoverIndex: number, offsetX: number): number|null => {
    const { items } = this.state;
    let updateFn;
    let newIndex;

    if (dragIndex === hoverIndex) {
      const { threshold } = this.props;

      // Check that if it move horizontally
      if (Math.abs(offsetX + reduceOffset) < threshold) {
        return null;
      }

      // Move to the right, meaning decrease horizontal level
      // It now is a child of it previous sibling
      if (offsetX > 0) {
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

  handleDrop = (dragIndex: number, dropIndex: number) => {
    this.props.onDrop(dragIndex, dropIndex);
    this.change();
  }

  change = () => {
    this.props.onChange(this.state.items);
  }

  render() {
    const { component: Comp, itemRenderer } = this.props;
    const { items, draggingDescendants } = this.state;

    return (
      <Comp>
        {items.map((item, index) => (
          <Item
            {...item}
            key={item.id}
            index={index}
            renderer={itemRenderer}
            isClosestDragging={draggingDescendants[item.id] === true}
            onDragStart={this.handleDragStart}
            onDragEnd={this.handleDragEnd}
            onMove={this.handleMove}
            onDrop={this.handleDrop}
          />
        ))}
      </Comp>
    );
  }
}
