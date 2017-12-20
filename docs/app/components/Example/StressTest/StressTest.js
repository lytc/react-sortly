import React, { Component } from 'react';
import faker from 'faker';

import NestedSortable, { convert } from '../../../../../src';
import ItemRenderer from './ItemRenderer';

const ITEMS = Array.from(Array(500).keys())
  .map(index => ({ id: index + 1, parentId: 0, name: faker.name.findName(), index }));

export default class StressTest extends Component {
  state = { items: convert(ITEMS) }

  handleChange = (items) => {
    this.setState({ items });
  }

  render() {
    const { items } = this.state;
    return (
      <section>
        <h1 className="page-title">Stress Test</h1>
        <div className="row">
          <div className="col-12 col-lg-8 col-xl-6">
            <NestedSortable items={items} itemRenderer={ItemRenderer} onChange={this.handleChange} />
          </div>
        </div>
      </section>
    );
  }
}
