const Lambda = require('../../model/Lambda')

/**
 * 返回json
 */
const handleJSON = async (req, res, next)=>{

  try {

    const {location} = res.locals
    if (location.type != 'LAMBDA') return next()

    /**
     * example fn
     `
     return new Promise(function (resolve, reject){
        try {
          resolve(Date.now())
        } catch(e){
          reject(e)
        }
      })
     `

     */

    const lam = await Lambda.findOne({path: req.path})
    if (!lam) return next()

    const danger = new Function('options', lam.fn)

    const response = await danger({
      query: req.query
    })

    res.json({response: response})

  } catch(e){
    next(e)
  }

}
