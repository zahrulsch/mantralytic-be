const path = require('node:path')
const { ContextReplacementPlugin } = require('webpack')

module.exports = {
  entry: './ts_dist/index.js',
  output: {
    path: path.resolve(__dirname, 'webpack_dist'),
    filename: 'index.bundle.node.js'
  },
  module: {
    rules: [
      { test: /\.ts$/, use: 'ts-loader' }
    ]
  },
  target: 'node',
  mode: 'production',
  plugins: [
    new ContextReplacementPlugin(/(express|keyv)/)
  ]
}