const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    app: [path.join(process.cwd(), 'examples/index.js')]
  },
  output: {
    path: path.join(process.cwd(), 'built'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(process.cwd(), 'examples/index.html'),
      inject: true
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ]
}
