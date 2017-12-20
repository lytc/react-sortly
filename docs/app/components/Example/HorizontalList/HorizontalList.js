import React, { Component } from 'react';
import faker from 'faker';

import NestedSortable from '../../../../../src';
import ItemRenderer from './ItemRenderer';
import DumpData from '../DumpData';

const ITEMS = Array.from(Array(10).keys())
  .map(index => ({
    id: index + 1,
    name: faker.name.findName(),
    color: faker.internet.color(),
    path: [],
  }));

export default class HorizontalList extends Component {
  state = { items: ITEMS }

  handleChange = (items) => {
    this.setState({ items });
  }

  render() {
    const { items } = this.state;
    return (
      <section>
        <h1 className="page-title">Horizontal List</h1>
        <div className="clearfix">
          <NestedSortable
            maxDepth={0}
            items={items}
            switchMode
            itemRenderer={ItemRenderer}
            onChange={this.handleChange}
          />
        </div>
        <hr />
        <DumpData items={items} tree={false} />
      </section>
    );
  }
}
