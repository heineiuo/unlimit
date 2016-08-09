const webpack = require('webpack')
const path = require('path')
const express = require('express')
const fs = require('fs')
const request = require('request')
const rucksack = require('rucksack-css')
const packageFile = JSON.parse(fs.readFileSync('package.json', 'UTF-8'))
const nodeExternals = require('webpack-node-externals')
const _ = require('lodash')

const port = 80
const app = express()



const getValue = (equalIndex, val) => {
  var value = val.substring(equalIndex+1)
  return value==''?true:value
}

const getArgv = () => {
  const argv = {}
  process.argv.forEach((val, index, array) => {
    if (val.substring(0, 2)=='--'){
      var equalIndex = val.indexOf('=')
      if (equalIndex<0) equalIndex = val.length
      argv[val.substring(2, equalIndex)] = getValue(equalIndex,val)
    }
  })
  return argv
}

const argv = getArgv()
const config = argv


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

      console.log('请求外部接口成功')
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

const serverConfigCreater = (name) => {

  return {
    context: process.cwd(),
    // devtool: 'inline-source-map',
    // devtool: 'eval',
    devtool: false,
    target: 'node',
    entry: {
      app: [`${process.cwd()}/src/${name}.js`]
    },
    output: {
      path: `${process.cwd()}/build/bin`,
      filename: `${name}.js`
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

    plugins: []
  }

}

const webpackConfigs = {
  server: serverConfigCreater('server'),
  cli: serverConfigCreater('cli')
}

const uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({
  compress: {
    warnings: false
  },
  sourceMap: false,
  mangle: {
    except: ['$super', '$', 'exports', 'require']
  }
})

const DefinePluginProduction = new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('production')
})

const DefinePluginDevelopment = new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('development')
})


console.log(`config: ${JSON.stringify(config)}`)

if (config.build){
  const webpackConfig = webpackConfigs[config.build]

  if (config.compress){
    console.log('compress...')
    webpackConfig.plugins.push(DefinePluginProduction)
    webpackConfig.plugins.push(uglifyJsPlugin)
  }

  const compiler = webpack(webpackConfig)

  compiler.run((err, stats)=>{
    if (err) return console.error(err)
    console.log(`build ${config.build} success`)
  })
} else {
  startServer()
}