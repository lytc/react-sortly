import React, { PureComponent } from 'react';
import { HashRouter, Route, Link } from 'react-router-dom';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import classNames from 'classnames';

import Dashboard from './Dashboard';
import ApiComponent from './Api/Component';
import ApiUtils from './Api/Utils';
import Simple from './Example/Simple';
import Advanced from './Example/Advanced';
import TableSortableRow from './Example/TableSortableRow';
import HorizontalList from './Example/HorizontalList';
import FileTree from './Example/FileTree';
import StressTest from './Example/StressTest';
import style from './App.scss';

class App extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <HashRouter basename="/">
        <div>
          <header
            className={`navbar ${style.navbar}`}
          >
            <Link className="navbar-brand mr-0 mr-md-2" to="/">React Sortly</Link>
            <ul className="navbar-nav pull-right">
              <li className="nav-item">
                <a className="nav-link" href="https://github.com/lytc/react-sortly">Github</a>
              </li>
            </ul>
          </header>
          <div className="container-fluid">
            <div className="row flex-xl-nowrap">
              <div className={classNames('col-12 col-md-3 col-xl-2', style.sidebar)}>
                <h4>API</h4>
                <nav className="nav flex-column">
                  <Link className="nav-link" to="/api/component">Component</Link>
                  <Link className="nav-link" to="/api/utils">Utils</Link>
                </nav>
                <br />
                <h4>Examples</h4>
                <nav className="nav flex-column">
                  <Link className="nav-link" to="/examples/simple">Simple</Link>
                  <Link className="nav-link" to="/examples/advanced">Advanced</Link>
                  <Link className="nav-link" to="/examples/table-sortable-row">Table Sortable Row</Link>
                  <Link className="nav-link" to="/examples/horizontal-list">Horizontal List</Link>
                  <Link className="nav-link" to="/examples/file-tree">File Tree</Link>
                  <Link className="nav-link" to="/examples/stress-test">Stress Test</Link>
                </nav>
              </div>
              <main className="col-12 col-xl-10 col-md-9">
                <Route path="/" exact component={Dashboard} />
                <Route path="/api/component" component={ApiComponent} />
                <Route path="/api/utils" component={ApiUtils} />
                <Route path="/examples/simple" component={Simple} />
                <Route path="/examples/advanced" component={Advanced} />
                <Route path="/examples/table-sortable-row" component={TableSortableRow} />
                <Route path="/examples/horizontal-list" component={HorizontalList} />
                <Route path="/examples/file-tree" component={FileTree} />
                <Route path="/examples/stress-test" component={StressTest} />
              </main>
            </div>
          </div>
        </div>
      </HashRouter>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
