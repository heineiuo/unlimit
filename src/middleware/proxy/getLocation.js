import Location from '../../model/location'
import parse from 'url-parse'
import _ from 'lodash'

/**
 * 获取location
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const getLocation = async (req, res, next)=>{
  try {
    const {host} = res.locals
    const locations = await Location.cfind({host_id: host._id}).sort({sort: 1}).exec()

    if (locations.length==0) return next('LOCATION_NOT_FOUND')

    // 获取url, 自动补上'/'
    const url = res.locals.url = parse(req.headers.host + req.url , true)
    if (url.pathname =='') url.pathname = '/'

    // 通过比对pathname, 找到路由
    let found = false
    locations.some( item => {
      const reg = new RegExp(_.trim(item.pathname, '/').replace('\\\\','\\'))
      const matches = url.pathname.match(reg)
      if (matches && matches[0] == url.pathname) {
        item.type = item.type.toUpperCase()
        item.cors = 'ALLOW'
        res.locals.location = item
        found = true
      }
      return found
    })

    if (!found) return next('LOCATION_NOT_FOUND')
    next()


  } catch(e){
    next(e)
  }

}

module.exports = getLocation