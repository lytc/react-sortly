import React, { Component } from 'react';
import update from 'immutability-helper';
import faker from 'faker';

import NestedSortable, { convert } from '../../../../../src';
import ItemRenderer from './ItemRenderer';
import DumpData from '../DumpData';

let idSeq = 5;
const generateId = () => {
  idSeq += 1;
  return idSeq;
};
const ITEMS = [
  { id: 1, parentId: 0, name: faker.name.findName(), index: 0 },
  { id: 2, parentId: 0, name: faker.name.findName(), index: 1 },
  { id: 3, parentId: 2, name: faker.name.findName(), index: 0 },
  { id: 4, parentId: 3, name: faker.name.findName(), index: 0 },
  { id: 5, parentId: 0, name: faker.name.findName(), index: 2 },
];

export default class Advanced extends Component {
  state = { items: convert(ITEMS), activeItemId: null }

  handleChange = (items) => {
    this.setState({ items });
  }

  handleChangeItem = (index, data) => {
    this.setState(update(this.state, {
      items: { [index]: { $merge: data } },
    }));
  }

  handleClickAddNewItem = () => {
    const id = generateId();
    const newItemData = { id, name: faker.name.findName() };

    this.tree.add(newItemData);
    this.setState({ activeItemId: id });
  }

  handleReturn = (targetIndex) => {
    const id = generateId();
    const newItemData = { id, name: faker.name.findName() };

    this.tree.insertNextTo(targetIndex, newItemData);
    this.setState({ activeItemId: id });
  }

  refTree = (tree) => {
    this.tree = tree;
  }

  renderItem = props => (
    <ItemRenderer
      {...props}
      active={props.id === this.state.activeItemId}
      onChange={this.handleChangeItem}
      onReturn={this.handleReturn}
    />
  )

  render() {
    const { items } = this.state;
    return (
      <section>
        <h1 className="page-title">Advanced</h1>
        <div className="row">
          <div className="col-12 col-lg-8 col-xl-6">
            <button type="button" className="btn btn-primary" onClick={this.handleClickAddNewItem}>Add New Item</button>
            <br />
            <br />
            <NestedSortable
              ref={this.refTree}
              items={items}
              itemRenderer={this.renderItem}
              onChange={this.handleChange}
            />
          </div>
        </div>
        <hr />
        <DumpData items={items} />
      </section>
    );
  }
}
