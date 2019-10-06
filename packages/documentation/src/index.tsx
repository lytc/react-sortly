import React from 'react';
import { render } from 'react-dom';
// @ts-ignore
// import { registerObserver } from 'react-perf-devtool';

import App from './App';

// registerObserver();

// type Foo = {
//   id: number;
// };

// const App = () => <div>xxxx</div>;

const root = document.createElement('div');
document.body.appendChild(root);

render(<App />, root);
