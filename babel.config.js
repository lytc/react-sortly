module.exports = {
  presets: [
    ['@babel/preset-env', {
      debug: false,
      useBuiltIns: 'usage',
      corejs: '3.0.0',
      modules: false
    }],
    '@babel/preset-typescript',
    '@babel/preset-react'
  ],
  plugins: [
    '@babel/plugin-transform-async-to-generator',
    '@babel/plugin-transform-runtime'
  ]
};
