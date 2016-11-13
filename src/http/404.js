const middleware = (config) => {

  return (req, res) => {
    res.status(404);
    res.end('NOT FOUND \n GATEWAY.')
  }

};

module.exports = middleware;