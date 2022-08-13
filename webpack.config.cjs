const path = require('node:path')

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
  externals: [/node_modules/, 'bufferutil', 'utf-8-validate'],
}