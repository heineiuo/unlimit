var conf = module.exports = {}

conf.port = 80

conf.indexfile = {}
conf.indexfileExpire = Date.now() + 1000*60*3 // 每3分钟更新一次

conf.appId = ''
conf.appSecret = ''

conf.morgan = require('./morgan')

conf.proxyHosts = require('./proxyhosts')