module.exports = {
  plugins: {
    autoprefixer: {
      add: true,
      remove: true,
      browsers: ['last 2 versions'],
    },
    cssnano: {
      discardComments: {
        removeAll: true,
      },
      discardUnused: false,
      mergeIdents: false,
      reduceIdents: false,
      safe: true,
    },
  },
  sourceMap: true,
};
