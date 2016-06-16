import uuid from 'uuid'
import fs from 'fs-promise'
import path from 'path'
import formidable from 'formidable'
import getMonthHash from '../../util/get-month-hash'
import mkdirp from 'mkdirp'
import {Router} from 'express'

const router = module.exports = Router()


router.route('/').post(async (req, res, next) => {
  try {

    const {seashell} = res.locals

    res.json({url: '...'})

  } catch(e){
    next(e)
  }
})

const upload = function(req){

  const File = this
  var monthHash = getMonthHash()
  var uploadPath = `${process.cwd()}/data/file/${monthHash}`
  mkdirp.sync(uploadPath)
  var form = new formidable.IncomingForm()
  form.encoding = 'utf-8'
  form.multiples = true
  const rename = async (file)=> {
    console.log(file)
    var tmpFileName = file.path
    var extname = path.extname(file.name||'')
    var filename = `${uuid.v4()}${extname}`
    var uploadFileName = `${uploadPath}/${filename}`
    await fs.rename(tmpFileName, uploadFileName)
    return `/file/${monthHash}/${filename}`
  }

  return new Promise(async function(resolve, reject){

    form.parse(req, async function (err, fields, files) {
      if (err) return reject(err)
      if (typeof files.file == 'undefined') return reject('PARAM_ILLEGAL')
      try {
        var urls = files.file instanceof Array
          ? await Promise.all(files.file.map(rename))
          : [await rename(files.file)]
        resolve(urls)
      } catch(e){
        reject(e)
      }

    })

  })

}



