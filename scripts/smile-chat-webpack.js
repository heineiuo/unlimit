const webpack = require('webpack');
const path = require('path');
const express = require('express');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';
const nodeExternals = require('webpack-node-externals')
const packageFile = JSON.parse(fs.readFileSync('package.json', 'UTF-8'))
const webpackLoaderExclude = (list) => new RegExp('(node_modules\/)(?!'+list.join('|')+')')

const argv = {};
process.argv.forEach((val, index, array) => {
  if (val.substring(0, 2)=='--'){
    var equalIndex = val.indexOf('=')
    if (equalIndex<0) equalIndex = val.length
    const trueval = val.substring(equalIndex+1) || true
    argv[val.substring(2, equalIndex)] = trueval
  }
});




/**
 * webpack client config
 * @param options
 */
const webpackClientConfigCreator = (options) =>{


  const config = {
    // options: options,
    context: process.cwd(),
    devtool: false,
    entry: {
      'app': [
        options.sourceFileName,
      ],
      // 'vendor': [
      //   "react",
      //   "react-dom",
      //   // "react-title-component",
      //   // "react-tap-event-plugin",
      //   // "react-swipeable-views",
      //   "react-router",
      //   "redux",
      //   "redux-actions",
      //   "react-router-redux",
      // ]
    },
    target: 'web',
    output: {
      library: 'WNWChat',
      libraryTarget: 'umd',
      // umdNamedDefine: true,
      path: `${process.cwd()}/build/public/${options.clientName}`,
      // css中的图片地址的前缀, 可以加上域名
      publicPath: options.production?
        `https://im.258m.com/${options.outputDir}/`:
        `/${options.outputDir}/`,
      filename: '[name].js',
      chunkFilename: "[chunkhash].js"
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
          exclude: webpackLoaderExclude([
            'react-inlinestyle',
            'fetch-es6-utils',
            'react-lang',
            'react-icons-md'
          ]),
          loader: 'babel',
          query: {
            presets: ['es2015', 'stage-0', 'react']
          }
        }
      ]
    },
    plugins: []
  };


  return config

};


/**
 * start server
 * @param webpackConfigs
 * @param port
 */
const startServer = (webpackConfigs, port)=>{

  const app = express();

  Object.keys(webpackConfigs).forEach(key=>{

    const config = webpackConfigs[key];
    config.devtool = 'inline-source-map';
    config.plugins.push(new webpack.NoErrorsPlugin());
    // config.plugins.push(new webpack.optimize.OccurenceOrderPlugin());

    config.devServer = {
      hot: true,
      inline: true
    };

    const compiler = webpack(config);
    app.use(require('webpack-dev-middleware')(compiler, {
      publicPath: config.output.publicPath,
      stats: {
        colors: true
      }
    }));
  });

  app.route('*').all((req, res, next) => {
    try {
      res.sendFile(`${process.cwd()}/build/public/${req.path}`)
    } catch(e){
      res.sendStatus(404)
    }
  });

  app.use(express.static(`${process.cwd()}/build/public`));

  app.listen(port, '127.0.0.1', (err) => {
    if (err) return console.log(err);
    console.log(`Listening at http://127.0.0.1:${port}`)
  })
};



console.log(`argv: ${JSON.stringify(argv)}`);

const configFilename = argv.configFilename || `${process.cwd()}/react-dev.json`;
const config = JSON.parse(fs.readFileSync(configFilename, 'utf-8'));

if (argv.build){

  const targets = config.targets;
  targets.forEach(target => {
    const currentConfig = webpackClientConfigCreator({
      clientName: target.key,
      outputDir: target.outputDir,
      sourceFileName: `${process.cwd()}/${target.filename}`,
      notCompress: true,
      production: true,
    });


    currentConfig.plugins.push(new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      })
    );

    if (argv.compress){
      console.log('compress...');


      currentConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
          drop_debugger: true,
          dead_code: true,
          // drop_console: true,
          warnings: false,
          unused: true
        },
        mangle: {
          except: ['window', '$super','exports', 'require']
        }
      }))
    }

    const compiler = webpack(currentConfig);

    compiler.run((err, stats) => {
      if (err) return console.error(err);
      console.log(`build ${target.key} success`);
    })
  });

  console.log(`running build`);


} else {

  const targets = config.targets;
  const targetMap = {};
  targets.forEach(target => {
    targetMap[target.key] = webpackClientConfigCreator({
      clientName: target.key,
      outputDir: target.outputDir,
      sourceFileName: `${process.cwd()}/${target.filename}`,
      notCompress: true,
      production: false
    })

    targetMap[target.key].plugins.push(new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development')
      })
    );
  });

  startServer(targetMap, argv.port||8083)
}
