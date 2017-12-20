const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const { hmrServer } = require('webpack-hmr');

const webpackConfig = require('./webpack.config');

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

const io = socketIO(server);
const compiler = webpack(webpackConfig);
const serverOptions = {
  hot: true,
  quiet: false,
  noInfo: false,
  publicPath: webpackConfig.output.publicPath,
  stats: { colors: true },
};

app.use(webpackDevMiddleware(compiler, serverOptions));
hmrServer(compiler, io);

app.use(express.static('docs'));

server.on('error', (error) => {
  throw error;
});

server.on('listening', () => {
  console.log(`Listerning on ${PORT}`);
});

server.listen(PORT);