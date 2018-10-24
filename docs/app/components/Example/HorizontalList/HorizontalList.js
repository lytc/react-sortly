import React, { Component } from 'react';
import { name, internet } from 'faker/locale/en';
import Sortly from 'react-sortly';

import ItemRenderer from './ItemRenderer';
import DumpData from '../DumpData';

const ITEMS = [...Array(10)]
  .map((v, index) => ({
    id: index + 1,
    name: name.findName(),
    color: internet.color(),
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
          <Sortly
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
