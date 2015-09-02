var fs = require('fs')
var request = require('request')
var path = require('path')

var conf = require(path.join(__dirname, '../conf'))

var update = module.exports = {}

var nextUpdateTime = Date.now()
var updatedTime = 0
var updating = false

update.check = function(req, res, next){

  next()

  if (updating && Date.now()>nextUpdateTime) {
    updating = true
    nextUpdateTime += 1000*60
    updatedTime ++

    updating = false
  }

}