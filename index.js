var conf = require('./src/conf')

conf.port = 8080
conf.appId = require('./appdata/secret').appId
conf.appSecret = require('./appdata/secret').appSecret

module.exports = require('./src')()