const middleware = (conf) => {

  return (req, res) => {
    res.end('NOT FOUND \n GATEWAY.')
  }

}

module.exports = middleware