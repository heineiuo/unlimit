const webpack = require('webpack')
const path = require('path')
const express = require('express')
const fs = require('fs')
const request = require('request')
const rucksack = require('rucksack-css')
const webpackClientConfigCreator = require('webpack-config').webpackClientConfigCreator
const argv = require('../src/util/argv')
const packageFile = JSON.parse(fs.readFileSync('package.json', 'UTF-8'))
const nodeExternals = require('webpack-node-externals')
const _ = require('lodash')


module.exports = {
  context: process.cwd(),
  // devtool: 'inline-source-map',
  // devtool: 'eval',
  devtool: false,
  target: 'node',
  entry: {
    app: [`${process.cwd()}/src/entry/server.js`]
  },
  output: {
    path: `${process.cwd()}/build/server`,
    //filename: '[name].js'
    filename: 'index.js'
  },
  externals: nodeExternals({
    //whitelist: [ 'node-uuid', 'sha.js']
    whitelist: _.keys(packageFile.devDependencies)
  }),
  resolve: {
    extensions: ['', '.jsx', '.scss', '.js', '.json'],
    modulesDirectories: [
      'node_modules',
    ]
  },
  module: {
    loaders: [
      {
        test: /(\.js|\.jsx)$/,
        exclude: /(node_modules)/,
        loader: 'babel',
        query: {
          presets:['es2015', 'stage-0', 'react'],
          plugins: ['transform-runtime']
        }
      }
    ]
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: false,
      mangle: {
        except: ['$super', '$', 'exports', 'require']
      }
    })
  ]
}