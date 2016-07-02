import {Router} from 'express'
import config from '../../util/config'
import path from 'path'

const cloudHostPublicPath = `${process.cwd()}/data/app/${config.host}/public`
const router = module.exports = Router()

router.use((req, res, next) => {
  if (!res.locals.isCloud) return next('IS_NOT_CLOUD')
  next()
})

router.use('/api', require('./api'))
router.use((req, res, next) => {

  try {
    const {url} = res.locals
    const filePath = path.join(cloudHostPublicPath, url.pathname)
    res.sendFile(filePath, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "maxAge": "31536000000",
        "Expires": new Date(Date.now() + 31536000000)
      }
    }, function (err) {
      if (err && !res.headersSent) {
        var lastParam = url.pathname.split('/').pop()
        if (lastParam.length && !/\./.test(lastParam))
          return res.redirect(req.path+'/')
        next('NOT_FOUND')
      }
    })
  } catch(e){
    next(e)
  }

})

router.use(async (err, req, res, next) => {
  console.log(err)
  if (err == 'IS_NOT_CLOUD') return next()
  if (typeof err == 'object') return res.end(err.name)
  if (typeof err == 'string') return res.end(err)
  res.end('EXCEPTION_ERROR')
})