import {Router} from 'express'

const router = module.exports = Router()

const splitKeywords = function(keywords){
  return keywords.split(new RegExp(/\-\|\,\|\.\|\?\|\:\|\;\|\'\|\"\|\!|'|\s|\+|,|\/|\u3002|\uff1b|\uff0c|\uff1a|\u201c|\u201d|\uff08|\uff09|\u3001|\uff1f|\u300a|\u300b/))
}

router.route('/').get(async function(req, res, next){
  try {
    var result = []
    var keywords = req.query.keywords||''
    if (keywords =='') return next('KEYWORDS_ILLEGAL')
    const hireResult = await Hire.search(splitKeywords(keywords))
    result = result.concat(hireResult)

    res.json({list: result})
  }
  catch(e){
    next(e)
  }
})