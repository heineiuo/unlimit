var path = require("path")
var webpack = require("webpack")
var fs = require('fs');

var data = fs.readFileSync('package.json', 'utf-8')
var devDependencies = JSON.parse(data).devDependencies

var nodeModules = {}
fs.readdirSync('node_modules')
  .filter(function(x) {
    // 除.bin目录以外的目录
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(moduleName) {
    if (typeof devDependencies[moduleName] == 'undefined') {
      nodeModules[moduleName] = 'commonjs ' + moduleName;
    }
  });

module.exports.serverIndexJS = {
  cache: false,

  entry: {
    index: "./src/index"
  },

  target: 'node',

  externals: nodeModules,

  output: {
    path: './.grunt/',
    //publicPath: "dist/",
    filename: "[name].js",
    //chunkFilename: "[chunkhash].js"
  }

}
