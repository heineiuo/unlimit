var path = require("path")
var webpack = require("webpack")
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });


module.exports.options = {

}

module.exports.server = {
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