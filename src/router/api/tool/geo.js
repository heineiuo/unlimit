import {Router} from 'express'
import {awaitify2} from '../../../util/awaitify'
import request from 'request'

const router = module.exports = Router()

/**
 * 根据坐标获取城市
 */
router.route('/city').get(async function(req, res, next){

  try {
    var query = {
      ak: 'gCDbEw1IkZx7nNZLvIOySQU5X3iozfK2',
      location: req.query.location,
      output:'json',
      pois:1
    }
    var response = await awaitify2(request)({
      method: 'GET',
      url: 'http://api.map.baidu.com/geocoder/v2/',
      qs: query
    })

    var data = JSON.parse(response[1])
    var city = data.result.addressComponent.city
    res.json({city: city})

  } catch(e){
    next(e)
  }
})


/**
 * 根据坐标获取城市
 */
router.route('/city').post(async function(req, res, next){


//     //api.map.baidu.com/geocoder/v2/
//     // ?ak=E4805d16520de693a3fe707cdc962045
//     // &callback=renderReverse
//     // &location=${latitude},${longitude}
//     // &output=json
//     // &pois=1
//   }

  try {
    var query = {
      ak: 'gCDbEw1IkZx7nNZLvIOySQU5X3iozfK2',
      location: req.body.location,
      output:'json',
      pois:1
    }
    var response = await awaitify2(request)({
      method: 'GET',
      url: 'http://api.map.baidu.com/geocoder/v2/',
      qs: query
    })


    var data = JSON.parse(response[1])
    var city = data.result.addressComponent.city
    res.json({city: city})

  } catch(e){
    next(e)
  }
})