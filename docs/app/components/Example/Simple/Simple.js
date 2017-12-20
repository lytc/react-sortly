import React, { Component } from 'react';
import faker from 'faker';

import NestedSortable from '../../../../../src';
import ItemRenderer from './ItemRenderer';
import DumpData from '../DumpData';

const ITEMS = [
  { id: 1, name: faker.name.findName(), path: [] },
  { id: 2, name: faker.name.findName(), path: [] },
  { id: 3, name: faker.name.findName(), path: [2] },
  { id: 4, name: faker.name.findName(), path: [2, 3] },
  { id: 5, name: faker.name.findName(), path: [] },
];

export default class Simple extends Component {
  state = { items: ITEMS }

  handleChange = (items) => {
    this.setState({ items });
  }

  render() {
    const { items } = this.state;
    return (
      <section>
        <h1 className="page-title">Simple</h1>
        <div className="row">
          <div className="col-12 col-lg-8 col-xl-6">
            <NestedSortable items={items} itemRenderer={ItemRenderer} onChange={this.handleChange} />
          </div>
        </div>
        <hr />
        <DumpData items={items} />
      </section>
    );
  }
}
