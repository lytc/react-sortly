import React, { Component } from 'react';
import { name, internet } from 'faker/locale/en';
import Sortly from 'react-sortly';

import ItemRenderer from './ItemRenderer';
import DumpData from '../DumpData';

const ITEMS = [...Array(5)]
  .map((v, index) => ({
    id: index + 1,
    name: name.findName(),
    email: internet.email(),
    path: [],
  }));

export default class TableSortableRow extends Component {
  state = { items: ITEMS }

  handleChange = (items) => {
    this.setState({ items });
  }

  render() {
    const { items } = this.state;
    return (
      <section>
        <h1 className="page-title">Table Sortable Row</h1>
        <div className="row">
          <div className="col-12 col-lg-10 col-xl-8">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <Sortly
                component="tbody"
                items={items}
                itemRenderer={ItemRenderer}
                maxDepth={0}
                onChange={this.handleChange}
              />
            </table>
          </div>
        </div>

        <hr />
        <DumpData items={items} tree={false} />
      </section>
    );
  }
}
