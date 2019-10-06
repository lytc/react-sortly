import path from 'path';
import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';

const base: webpack.Configuration = {
  mode: 'production',
  devtool: 'source-map',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          rootMode: 'upward'
        }
      }
    ]
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false
          }
        },
        sourceMap: true
      })
    ]
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.cjs']
  }
};

const config: webpack.Configuration[] = [
  {
    ...base,
    output: {
      path: path.resolve(__dirname, './umd'),
      library: 'ReactSortly',
      libraryTarget: 'umd',
      filename: 'ReactSortly.js'
    }
  },
  {
    ...base,
    output: {
      path: path.resolve(__dirname, './cjs'),
      library: 'ReactSortly',
      libraryTarget: 'commonjs',
      filename: 'ReactSortly.js'
    }
  }
];

export default config;
