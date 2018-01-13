import React, { Component } from 'react';
import { name } from 'faker/locale/en';
import debounce from 'lodash.debounce';
import Sortly, { convert } from 'react-sortly';

import ItemRenderer from './ItemRenderer';

const generate = numItems =>
  Array
    .from(Array(numItems).keys())
    .map(index => ({ id: index + 1, parentId: 0, name: name.findName(), index }));

export default class StressTest extends Component {
  state = { numItems: 1000, generating: false, items: convert(generate(1000)) }

  handleChange = (items) => {
    this.setState({ items });
  }

  handleChangeNumItems = (e) => {
    const numItems = parseInt(e.target.value, 10);
    const validNumber = !isNaN(numItems);
    this.setState({ numItems: validNumber ? numItems: '', generating: validNumber }, () => {
      if (validNumber) {
        this.generate();
      }
    });
  }

  generate = debounce(() => {
    const items = convert(generate(this.state.numItems));
    this.setState({ items, generating: false });
  }, 500)

  render() {
    const { numItems, items, generating } = this.state;
    return (
      <section>
        <h1 className="page-title">Stress Test</h1>
        <div className="row">
          <div className="col-12 col-lg-8 col-xl-6">
            <div className="input-group">
              <input
                type="number"
                min={1}
                className="form-control"
                value={numItems}
                onChange={this.handleChangeNumItems}
              />
              <span className="input-group-addon">items{generating && ' generating...'}</span>
            </div>
            <br />
            <Sortly items={items} itemRenderer={ItemRenderer} onChange={this.handleChange} />
          </div>
        </div>
      </section>
    );
  }
}
