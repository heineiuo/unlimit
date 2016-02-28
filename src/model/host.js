var mongoose = require('mongoose')
var uuid = require('uuid')


module.exports = mongoose.model('Host', new mongoose.Schema({
  hostId:  {type: String, default: uuid.v4},
  appId:  String,
  userId:  String,
  hostname:  String,
  sub:  String,  // 二级域名
  protocol: { type: String, default: 'http:'}
}))