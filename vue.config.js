const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const webpack = require('webpack')

// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      new NodePolyfillPlugin(),
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
    ],
    resolve: {
      extensions: ['.ts', '.js'],
      fallback: {
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
      },
    },
  },
}
