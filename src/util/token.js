module.exports.normalToken = function(){
  return require('./sha256')(Date.now()+Math.random())
}