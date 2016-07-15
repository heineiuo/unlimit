module.exports = async (req, res, next) => {
  try {
    const {location} = res.locals
    if (location.type != 'SEASHELL') return next()

    const {seashell} = res.locals
    const reqBody = Object.assign({}, req.query, req.body)
    const result = await seashell.request(req.path, reqBody)
    console.log(result)
    res.json(result.body)
  } catch(e){
    next(e)
  }
}
