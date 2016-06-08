import {Router} from 'express'
import paramRule from '../middleware/param-rule'
import Admin from '../model/Admin'
import User from '../model/User'
import Hire from '../model/Hire'
import HireLog from '../model/HireLog'
import {awaitify2} from '../lib/awaitify'
import request from 'request'

const router = module.exports = Router()

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