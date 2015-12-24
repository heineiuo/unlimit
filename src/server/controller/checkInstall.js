var checkInstall = function(req, res, next){

  if (conf.isChecked) return next()

  db.config.findOne({}, function(err, doc){
    conf.isChecked = true
    if (err) return res.sendStatus(500)
    if (doc) {
      conf.isInstalled = true
      conf = _.extend(conf, doc)
    }
    next()
  })

}