import React from 'react';
import { render } from 'react-dom';
import { hmrClient } from 'webpack-hmr';
import io from 'socket.io-client';

import App from './components/App';

render(<App />, document.getElementById('root'));

// Webpack HMR
if (module.hot) {
  const socket = io.connect(
    '/',
    { transports: ['websocket', 'polling'], reconnection: true },
  );
  hmrClient(socket);
}
