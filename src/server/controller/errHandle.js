var errHandle = {}


errHandle.status500 = function(req, res){
  res.sendStatus(404)
}

errHandle.status404 = function(req, res){
  res.sendStatus(404)
}