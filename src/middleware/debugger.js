const middleware = (conf) => {
  return (req, res, next) => {
    console.log('debug')
    next()
  }
}

module.exports = middleware