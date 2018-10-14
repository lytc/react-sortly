const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

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
  mode: process.env.NODE_ENV,
  devtool: 'sourcemap',
  optimization: {
    minimize: process.env.NODE_ENV === 'production',
  },
  entry: {
    Sortly: [`${__dirname}/src/index`],
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
        test: /\.css$/,
        use: [styleLoader, cssLoader, postcssLoader],
      },
      {
        test: /\.scss$/,
        use: [styleLoader, cssLoader, postcssLoader, sassLoader],
      },
    ],
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static', openAnalyzer: false, reportFilename: `${__dirname}/bundle-analyze.html`,
    }),
  ],
  resolve: {
    alias: {
      'react-sortly': path.resolve(__dirname, 'src/index'),
    },
  },
};


module.exports = config;
