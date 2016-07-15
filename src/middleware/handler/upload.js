var fs = require('fs-extra')
var _ = require('lodash')
var mkdirp = require('mkdirp')
var path = require('path')
var formidable = require('formidable')
var async = require('async')
var util = require('util')
var express = require('express')

/*****************************
 *
 * 文件代理
 *
 *****************************/


/**
 * 检查是否是文件代理类型, 是的话继续处理上传
 */
const uploadHandle = async (req, res, next) => {
  try {
    const {location, url, host} = res.locals
    if (location.type != 'UPLOAD') return next('NOT_UPLOAD')

    if (!_.has(req.query, 'uploadDir')) throw 'PARAMS_LOST'
    var form = new formidable.IncomingForm()
    form.encoding = 'utf-8'
    form.parse(req, function (err, fields, files) {
      if (err) return next(err)
      var rootPath = `${process.cwd()}/data/app`
      //var uploadPath = rootPath + req.query.uploadDir
      var uploadPath = req.query.uploadDir
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

  } catch(e){
    next(e)
  }
}


module.exports = uploadHandle

