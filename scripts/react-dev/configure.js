const fs = require('fs');
const nodeExternals = require('webpack-node-externals');
const packageFile = JSON.parse(fs.readFileSync('package.json', 'UTF-8'));
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackLoaderExclude = require('./webpackLoaderExclude')
const webpack = require('webpack');
const path = require('path');
const mkdirp = require('mkdirp')

/**
 * webpack client config
 * @param options
 * @param argv
 */
module.exports = (options, argv) => {

  const config = {
    options: options,
    context: process.cwd(),
    devtool: false,
    entry: {
      'app': [
        options.sourceFileName,
      ],
      'vendor': [
        "react",
        "react-dom",
        // "react-title-component",
        // "react-tap-event-plugin",
        // "react-swipeable-views",
        "react-router",
        "redux",
        "redux-actions",
        "react-router-redux",
      ]
    },
    target: 'web',
    output: {
      // library: 'Chat',
      // libraryTarget: 'umd',
      // umdNamedDefine: true,
      path: `${process.cwd()}/build/public/${options.clientName}`,
      // css中的图片地址的前缀, 可以加上域名
      publicPath: argv.production && options.target.origin?
        `${options.target.origin}/${options.target.outputDir}/`:
        `/${options.target.outputDir}/`,
      filename: '[name]_[hash].js',
      chunkFilename: "chunk_[hash].js"
    },
    resolve: {
      extensions: ['', '.jsx', '.js', '.json'],
      modulesDirectories: [
        'node_modules',
        path.resolve(`${process.cwd()}/node_modules`)
      ]
    },
    module: {
      loaders: [
        {
          test: /\.(png|jpg|svg)$/,
          loader: 'url-loader?limit=1024&name=images/[hash].[ext]'
        },
        {
          test: /\.(json)$/,
          loader: 'json-loader'
        },
        {
          test: /(\.js|\.jsx)$/,
          exclude: webpackLoaderExclude(argv.modulesNeedBabel|| []),
          loader: 'babel',
          query: {
            presets: ['es2015', 'stage-0', 'react']
          }
        }
      ]
    },
    plugins: []
  };

  if (argv.compress) {
    console.log(`[webpack configure] use uglify js plugin`);
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
      compress: {
        drop_debugger: true,
        dead_code: true,
        // drop_console: true,
        warnings: false,
        unused: true
      },
      mangle: {
        except: ['window', 'QT','$super', '$', 'exports', 'require']
      }
    }))
  }

  if (argv.production) {
    console.log(`[webpack configure] use define plugin, NODE_ENV: production`);
    config.plugins.push(new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }))
  } else {
    console.log(`[webpack configure] use define plugin, NODE_ENV: development`);
    config.plugins.push(new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }))
  }

  console.log(`[webpack configure] use chunk plugin`);
  config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: Infinity
  }));

  console.log(`[webpack configure] use html webpack plugin`);
  mkdirp.sync(`${process.cwd()}/build/public/${options.target.key}`);
  config.plugins.push(new HtmlWebpackPlugin({
    title: options.target.key,
    hash: true,
    minify: {
      minifyJS: true,
      minifyCSS: true,
      collapseWhitespace: true,
      removeComments: true,
    },
    template: `${process.cwd()}/${options.target.template}`,
    filename: `${process.cwd()}/build/public/${options.target.key}/index.html`
  }));

  return config

};

