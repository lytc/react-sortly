import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sortly from 'react-sortly';

import style from './App.scss';

const CODE = `
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Sortly from 'react-sortly';

const ITEMS = [
  { id: 1, name: 'Priscilla Cormier', path: [] },
  { id: 2, name: 'Miss Erich Bartoletti', path: [] },
  { id: 3, name: 'Alison Friesen', path: [2] },
  { id: 4, name: 'Bernita Mayert', path: [2, 3] },
  { id: 5, name: 'Garfield Berge', path: [] },
];

const itemStyle = {
  border: '1px solid #ccc',
  cursor: 'move',
  padding: 10,
  marginBottom: 4,
};

const muteStyle = { opacity: 0.3 };

const ItemRenderer = (props) => {
  const {
    name, path, connectDragSource, connectDropTarget, 
    isDragging, isClosestDragging,
  } = props;
  const style = {
    ...itemStyle,
    ...(isDragging || isClosestDragging ? muteStyle : null),
    marginLeft: path.length * 30,
  };
  const el = <div style={style}>{name}</div>;
  return connectDragSource(connectDropTarget(el));
};

class MyApp extends Component {
  state = { items: ITEMS }
  
  handleChange = (items) => {
    this.setState({ items });
  }
  
  render() {
    const { items } = this.state;
    return (
      <div>
        <Sortly 
          items={items} 
          itemRenderer={ItemRenderer}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

ReactDOM.render(
  DragDropContext(HTML5Backend)(MyApp),
  document.getElementById('root')
);
`;

const ITEMS = [
  { id: 1, name: 'Priscilla Cormier', path: [] },
  { id: 2, name: 'Miss Erich Bartoletti', path: [] },
  { id: 3, name: 'Alison Friesen', path: [2] },
  { id: 4, name: 'Bernita Mayert', path: [2, 3] },
  { id: 5, name: 'Garfield Berge', path: [] },
];

const itemStyle = {
  border: '1px solid #ccc',
  cursor: 'move',
  padding: 10,
  marginBottom: 4,
};

const muteStyle = { opacity: 0.3 };

const ItemRenderer = (props) => {
  const {
    name, path, connectDragSource, connectDropTarget,
    isDragging, isClosestDragging,
  } = props;
  const style = {
    ...itemStyle,
    ...(isDragging || isClosestDragging ? muteStyle : null),
    marginLeft: path.length * 30,
  };
  const el = <div style={style}>{name}</div>;
  return connectDragSource(connectDropTarget(el));
};

ItemRenderer.propTypes = {
  name: PropTypes.string.isRequired,
  path: PropTypes.arrayOf(PropTypes.number).isRequired,
  isDragging: PropTypes.bool.isRequired,
  isClosestDragging: PropTypes.bool.isRequired,
};

export default class Dashboard extends Component {
  state = { items: ITEMS }

  componentDidMount() {
    hljs.highlightBlock(this.code);
  }

  handleChange = (items) => {
    this.setState({ items });
  }

  refCode = (code) => {
    this.code = code;
  }

  render() {
    const { items } = this.state;

    return (
      <div>
        <br />
        <div className={style.lead}>
          <p>
            React Sortly is a simple, lightweight and highly customizable dnd nested sortable React component.
            <br />
            Supported to sort the tree, vertical list, horizontal list, table row and maybe more!
          </p>
        </div>
        <br />
        <br />
        <h2>Installation</h2>
        <p><code>npm install --save react-sortly react-dnd react-dnd-html5-backend</code></p>
        <h2>What's It Look Like?</h2>
        <br />
        <div className="row">
          <div className="col-12 col-lg-6">
            <Sortly items={items} itemRenderer={ItemRenderer} onChange={this.handleChange} />
          </div>
          <div className="col-12 col-lg-6"><pre ref={this.refCode} className="js">{CODE}</pre></div>
        </div>
      </div>
    );
  }
}
