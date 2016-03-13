var cli = module.exports = {}

cli.renderCLI = function (req, res, next) {

  $('#page-container').html(JST['cli/index']())
  res.end()

}