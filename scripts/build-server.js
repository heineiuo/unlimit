const webpack = require('webpack')
const path = require('path')
const express = require('express')
const fs = require('fs')
const rucksack = require('rucksack-css')
const webpackClientConfigCreator = require('webpack-config').webpackClientConfigCreator

const app = express()
const port = 8080

const dashboardComplier = webpackClientConfigCreator('dashboard')
const compliers = [dashboardComplier]


compliers.forEach(complier=>{

  app.use(require('webpack-dev-middleware')(webpack(complier), {
    publicPath: complier.output.publicPath,
    stats: {
      colors: true
    }
  }))
  app.use(require('webpack-hot-middleware')(webpack(complier)))

})

app.use('/', express.static(path.join(__dirname, '../build/public')))

app.listen(port, '0.0.0.0', (err) => {
  if (err) return console.log(err);
  console.log(`Listening at http://0.0.0.0:${port}`)
})