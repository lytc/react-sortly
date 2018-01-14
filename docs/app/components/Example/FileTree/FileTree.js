import React, { Component } from 'react';
import { random, system } from 'faker/locale/en';
import Sortly, { findDescendants } from 'react-sortly';
import update from 'immutability-helper';

import ItemRenderer from './ItemRenderer';

const ITEMS = [
  { id: 1, name: random.word(), type: 'folder', path: [] },
  { id: 2, name: system.commonFileName(), type: 'file', path: [1] },
  { id: 3, name: system.commonFileName(), type: 'file', path: [1] },
  { id: 4, name: system.commonFileName(), type: 'file', path: [1] },
  { id: 5, name: random.word(), type: 'folder', path: [] },
  { id: 6, name: system.commonFileName(), type: 'file', path: [5] },
  { id: 7, name: system.commonFileName(), type: 'file', path: [5] },
  { id: 8, name: system.commonFileName(), type: 'file', path: [5] },
  { id: 9, name: random.word(), type: 'folder', collapsed: true, path: [] },
  { id: 10, name: system.commonFileName(), type: 'file', collapsed: true, path: [9] },
  { id: 11, name: system.commonFileName(), type: 'file', collapsed: true, path: [9] },
  { id: 12, name: system.commonFileName(), type: 'file', collapsed: true, path: [9] },
  { id: 13, name: random.word(), type: 'folder', path: [] },
  { id: 14, name: system.commonFileName(), type: 'file', path: [13] },
  { id: 15, name: system.commonFileName(), type: 'file', path: [13] },
  { id: 16, name: system.commonFileName(), type: 'file', path: [13] },
];

export default class FileTree extends Component {
  state = { items: ITEMS }

  handleMove = (items, index, newIndex) => {
    const { path } = items[newIndex];

    const parent = items.find(item => item.id === path[path.length - 1]);

    // parent should not be file
    if (parent && parent.type === 'file') {
      return false;
    }

    // if parent is collapsed, should expand the parent
    if (parent && parent.collapsed) {
      const updateFn = {
        [items.indexOf(parent)]: { collapsed: { $set: false } },
      };
      const descendants = findDescendants(items, items.indexOf(parent));
      descendants.forEach((item) => {
        updateFn[items.indexOf(item)] = { collapsed: { $set: false } };
      });

      return update(items, updateFn);
    }

    return true;
  }

  handleChange = (items) => {
    this.setState({ items });
  }

  handleToggleCollapse = (index) => {
    const { items } = this.state;
    const descendants = findDescendants(items, index);

    const updateFn = {
      [index]: { $toggle: ['collapsed'] },
    };
    descendants.forEach((item) => {
      updateFn[items.indexOf(item)] = { $toggle: ['collapsed'] };
    });

    this.setState(update(this.state, {
      items: updateFn,
    }));
  }

  renderItem = props => <ItemRenderer {...props} onToggleCollapse={this.handleToggleCollapse} />

  render() {
    const { items } = this.state;
    return (
      <section>
        <h1 className="page-title">File Tree</h1>
        <div className="row">
          <div className="col-12 col-lg-8 col-xl-6">
            <Sortly
              items={items}
              itemRenderer={this.renderItem}
              onMove={this.handleMove}
              onChange={this.handleChange}
            />
          </div>
        </div>
      </section>
    );
  }
}
