var controller = controller || pansy.Controller()
// 渲染
controller('docs.render', function(req, res, next){

  req.locals = {
    active: "docs"
  }

  $("#view-scope").html(JST['layout/docs'](req.locals))
  next()

})