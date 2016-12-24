/* eslint-disable no-console */

const express = require('express')
const path = require('path')

const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackConfig = require('./webpack.config')

const app = express()

app.use(webpackDevMiddleware(webpack(webpackConfig), {
  publicPath: webpackConfig.publicPath,
  noInfo: true,
  stats: {
    colors: true
  }
}))

app.use(express.static(path.join(__dirname, 'built')))

app.listen(8080, () =>
  console.log('Server listening on http://localhost:8080, Ctrl+C to stop')
)
