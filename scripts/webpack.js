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

const port = 8080
const app = express()

const webpackConfigs = {
  dashboard: webpackClientConfigCreator('dashboard', {notCompress: true})
}

const startServer = ()=>{
  Object.keys(webpackConfigs).forEach(key=>{

    const config = webpackConfigs[key]
    const compiler = webpack(config)
    app.use(require('webpack-dev-middleware')(compiler, {
      publicPath: config.output.publicPath,
      hot: true,
      stats: {
        colors: true
      }
    }))
    app.use(require('webpack-hot-middleware')(compiler))
  })

  app.use('/', express.static(path.join(__dirname, '../build/public')))
  app.use('/api', (req, res, next)=>{


    var apiOptions = {
      method: req.method,
      url: `http://127.0.0.1${req.originalUrl}`,
      qs: req.query,
      body: req.body
    }
    request(apiOptions, function(err, response, body){
      if (err) {
        console.log('请求外部接口失败')
        console.log(err)
        return res.sendStatus(500)
      }
      try {
        res.json(JSON.parse(body))
      } catch(e){
        console.log(body)
        res.sendStatus(502)
      }
    })


  })

  app.listen(port, '127.0.0.1', (err) => {
    if (err) return console.log(err)
    console.log(`Listening at http://0.0.0.0:${port}`)
  })
}

const serverConfig = {
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
          presets:['es2015','stage-0'],
          plugins: ['transform-runtime']
        }
      }
    ]
  },

  plugins: [
    //new webpack.NoErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      //'process.env.NODE_ENV': JSON.stringify('production')
      'process.env.NODE_ENV': JSON.stringify('development')
    })
    // , new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   },
    //   mangle: {
    //     except: ['$super', '$', 'exports', 'require']
    //   }
    // })

  ]
}



console.log(`argv: ${JSON.stringify(argv)}`)

if (argv.build){
  const compiler = argv.build == 'server'? webpack(serverConfig)
    : webpack(webpackConfigs[argv.build])

  compiler.run((err, stats)=>{
    if (err) return console.error(err)
    // console.log(err, stats)
    console.log('build success')
  })
} else {
  startServer()
}