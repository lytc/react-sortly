const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    docs: './docs',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(gif|png|jpg|jpeg|mp3)$/,
        exclude: /node_modules/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './docs/index.html',
    })
  ],
  resolve: {
    extensions: [
      '.js',
      '.ts',
      '.tsx',
      '.cjs',
    ],
    alias: {
      'react-sortly': path.resolve(__dirname, './src'),
    }
  },
}
