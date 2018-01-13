import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

import { decreaseTreeItem, increaseTreeItem, moveTreeItem, insert } from './utils';
import Item from './Item';

let reduceOffset = 0;
const noop = () => {};
export default class Sortly extends Component {
  static propTypes = {
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    items: PropTypes.arrayOf(PropTypes.shape({
      path: PropTypes.array.isRequired,
    })).isRequired,
    activeItemId: PropTypes.number,
    itemRenderer: PropTypes.func.isRequired,
    threshold: PropTypes.number,
    maxDepth: PropTypes.number,
    cancelOnDropOutside: PropTypes.bool,
    onDragStart: PropTypes.func,
    ondDragEnd: PropTypes.func,
    onDrop: PropTypes.func,
    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    component: 'div',
    activeItemId: null,
    threshold: 20,
    maxDepth: Infinity,
    cancelOnDropOutside: false,
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


    const dragItem = items[dragIndex];
    const { id: dragId } = dragItem;
    const descendants = items.filter(({ path }) => path.includes(dragId));

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

    if (dragIndex === hoverIndex) {
      const { threshold } = this.props;

      // Check that if it move horizontally
      if (Math.abs(offsetX + reduceOffset) < threshold) {
        return null;
      }

      // Move to the right, meaning decrease horizontal level
      // It now is a child of it previous sibling
      let updateFn;
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

      this.setState(update(this.state, {
        items: updateFn,
      }));

      return hoverIndex;
    }

    const { updateFn, newIndex } = moveTreeItem(items, dragIndex, hoverIndex);

    this.setState(update(this.state, {
      items: updateFn,
    }));

    return newIndex;
  }

  handleDrop = (dragIndex: number, dropIndex: number) => {
    this.props.onDrop(dragIndex, dropIndex);
    this.change();
  }

  handleRemoveItem = (index: number) => {
    const { items } = this.state;

    // remove item and it descendants
    const item = this.state.items[index];
    const descendants = items.filter(({ path }) => path.includes(item.id));

    this.setState(update(this.state, {
      items: { $splice: [[index, 1 + descendants.length]] },
    }), () => this.change());
  }

  add = (itemData: { id: number|string }) => {
    const item = { ...itemData, path: [] };
    this.setState(update(this.state, {
      items: { $push: [item] },
    }), () => this.change());
  }

  insertNextTo = (targetIndex: number, itemData: { id: number|string }) => {
    const updateFn = insert(this.state.items, targetIndex, itemData);
    this.setState(update(this.state, {
      items: updateFn,
    }), () => this.change());
  }

  change = () => {
    this.props.onChange(this.state.items);
  }

  render() {
    const { component: Comp, maxDepth, activeItemId, itemRenderer } = this.props;
    const { items, draggingDescendants } = this.state;

    return (
      <Comp>
        {items.map((item, index) => (
          <Item
            {...item}
            key={item.id}
            index={index}
            active={item.id === activeItemId}
            path={item.path}
            renderer={itemRenderer}
            maxDepth={maxDepth}
            isClosestDragging={draggingDescendants[item.id] === true}
            onDragStart={this.handleDragStart}
            onDragEnd={this.handleDragEnd}
            onMove={this.handleMove}
            onDrop={this.handleDrop}
            onRemove={this.handleRemoveItem}
          />
        ))}
      </Comp>
    );
  }
}
