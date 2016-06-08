import express from 'express'
import paramRule from '../lib/param-rule'

import File from '../model/File'

const router = module.exports = express.Router()

router.route('/').post(async function(req, res, next){

  try {
    const urls = await File.upload(req)
    res.json({urls: urls})
  } catch(e){
    next(e)
  }

})
