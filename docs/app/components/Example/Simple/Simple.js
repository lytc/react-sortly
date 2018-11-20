import React, { Component } from 'react';
import { name } from 'faker/locale/en';
import Sortly from 'react-sortly';

import ItemRenderer from './ItemRenderer';
import DumpData from '../DumpData';

const ITEMS = [
  { id: 1, name: name.findName(), path: [] },
  { id: 2, name: name.findName(), path: [] },
  { id: 3, name: name.findName(), path: [2] },
  { id: 4, name: name.findName(), path: [2, 3] },
  { id: 5, name: name.findName(), path: [] },
];

export default class Simple extends Component {
  state = { items: ITEMS }

  handleChange = (items) => {
    console.log('change')
    this.setState({ items });
  }

  render() {
    const { items } = this.state;
    return (
      <section>
        <h1 className="page-title">Simple</h1>
        <div className="row">
          <div className="col-12 col-lg-8 col-xl-6">
            <Sortly items={items} itemRenderer={ItemRenderer} onChange={this.handleChange} cancelOnDropOutside cancelOnDragOutside />
          </div>
        </div>
        <hr />
        <DumpData items={items} />
      </section>
    );
  }
}
