const webpack = require('webpack');

const styleLoader = { loader: 'style-loader', options: {} };
const postcssLoader = { loader: 'postcss-loader', options: {} };
const sassLoader = { loader: 'sass-loader', options: {} };
const cssLoader = {
  loader: 'css-loader',
  options: {
    sourceMap: true,
    minimize: {
      autoprefixer: {
        add: true,
        remove: true,
        browsers: ['last 2 versions'],
      },
      discardComments: { removeAll: true },
      discardUnused: false,
      mergeIdents: false,
      reduceIdents: false,
      safe: true,
      sourcemap: true,
    },
    modules: true,
    importLoaders: 1,
    localIdentName: '[name]__[local]___[hash:base64:5]',
  },
};

const config = {
  devtool: 'sourcemap',
  entry: {
    ReactNestedSortable: [`${__dirname}/src/index`],
    app: [`${__dirname}/docs/app/index`],
  },
  output: {
    path: `${__dirname}/dist`,
    filename: '[name].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [styleLoader, cssLoader, postcssLoader, sassLoader],
      },
    ],
    noParse: /\.min\.js/,
  },
  plugins: [],
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false,
      },
    }),
  );
}

module.exports = config;
