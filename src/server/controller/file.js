var fs = require('fs-extra')
var _ = require('lodash')
var mkdirp = require('mkdirp')
var path = require('path')
var formidable = require('formidable')
var async = require('async')
var util = require('util')

var file = module.exports = {}

file.upload = function (req, res, next) {


  if (!_.has(req.query, 'uploadDir')) throw 'PARAMS_LOST'

  var form = new formidable.IncomingForm()
  form.encoding = 'utf-8'

  form.parse(req, function (err, fields, files) {
    if (err) return next(err)
    var rootPath = process.cwd() + '/public'
    var uploadPath = rootPath + req.query.uploadDir
    mkdirp.sync(uploadPath)
    var tmpFileName = files.file.path
    var fileName = files.file.name
    var uploadName = path.join(uploadPath, fileName)

    fs.lstat(uploadName, function (err, stats) {
      if (err) return renameFile()
      fs.readdir(uploadPath, function (err, files) {
        if (err) return next(err)
        var serial = 0
        var extname = path.extname(fileName||'')
        var name = path.basename(fileName, extname)
        while (_.indexOf(files, fileName)>=0) {
          serial += 1
          fileName = name + "(" + serial + ")" + extname;
        }
        uploadName = path.join(uploadPath, fileName)
        renameFile()
      })

    })

    function renameFile(){
      fs.rename(tmpFileName, uploadName, function (err) {
        if (err) return console.log(err)
        res.json({})
      })
    }



  })


}


file.readdir = function (req, res, next) {

  if (!_.has(req.body, 'path')) throw 'PARAMS_LOST'

  var rawPath = decodeURI(req.body.path)

  var result = {path: rawPath}
  //var truePath = process.cwd()+'/public'+ rawPath
  var truePath = rawPath

  fs.lstat(truePath, function (err, stats) {
    if (err) return next(err)
    result.isFile = stats.isFile()
    result.stats = stats
    if (stats.isDirectory()) {
      fs.readdir(truePath, function (err, files) {
        if (err) return next(err)
        result.files = files
        res.json(result)
      })
    } else {
      res.json(result)
    }
  })

}

file.deleteFile = function (req, res, next) {

  if (!_.has(req.body, 'path')) throw 'PARAMS_LOST'

  var rawPath = decodeURI(req.body.path)

  var result = {path: rawPath}
  //var truePath = process.cwd()+'/public'+ rawPath
  var truePath = rawPath

  fs.lstat(truePath, function (err, stats) {
    if (err) throw 'FILE_NOT_EXIST'
    fs.remove(truePath, function (err) {
      if (err) return next(err)
      result.deleteFail = false
      res.json(result)
    })
  })

}