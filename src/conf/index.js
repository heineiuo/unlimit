var conf = module.exports = {}

conf.port = 80
conf.morgan = require('./morgan')
conf.proxyHosts = require('./proxyhosts')