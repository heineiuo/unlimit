var controller = controller || pansy.Controller()


controller('home',  function(req, res) {

  $("#page-container").html(JST['home/index']())

  res.end()
})


