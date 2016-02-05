var path = require("path")
var webpack = require("webpack")
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    // 除.bin目录以外的目录
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(moduleName) {
    nodeModules[moduleName] = 'commonjs ' + moduleName;
  });


module.exports.serverIndexJS = {
  cache: false,

  entry: {
    index: "./src/server/index"
  },

  target: 'node',

  externals: nodeModules,

  output: {
    path: './.grunt/server/',
    //publicPath: "dist/",
    filename: "[name].js",
    //chunkFilename: "[chunkhash].js"
  }

}

module.exports.homeIndexJS = {
  cache: false,

  entry: {
    index: "./src/home/index"
  },

  target: 'web',

  output: {
    path: './.grunt/home/',
    //publicPath: "dist/",
    filename: "[name].js",
    //chunkFilename: "[chunkhash].js"
  }

}
