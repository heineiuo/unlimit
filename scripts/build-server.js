const webpack = require('webpack')
const path = require('path')
const express = require('express')
const fs = require('fs')
const rucksack = require('rucksack-css')
const webpackClientConfigCreator = require('webpack-config').webpackClientConfigCreator
const argv = require('../src/util/argv')

const port = 8080
const app = express()

const webpackConfigs = {
  dashboard: webpackClientConfigCreator('dashboard')
}

const startServer = ()=>{
  Object.keys(webpackConfigs).forEach(key=>{

    const config = webpackConfigs[key]
    const compiler = webpack(config)
    app.use(require('webpack-dev-middleware')(compiler, {
      publicPath: config.output.publicPath,
      stats: {
        colors: true
      }
    }))
    app.use(require('webpack-hot-middleware')(compiler))
  })

  app.use('/', express.static(path.join(__dirname, '../build/public')))

  app.listen(port, '0.0.0.0', (err) => {
    if (err) return console.log(err)
    console.log(`Listening at http://0.0.0.0:${port}`)
  })
}



console.log(`argv: ${JSON.stringify(argv)}`)

if (argv.build){
  const compiler = webpack(webpackConfigs[argv.build])
  compiler.run((err, stats)=>{
    if (err) return console.error(err)
    // console.log(err, stats)
    console.log('build success')
  })
} else {
  startServer()
}