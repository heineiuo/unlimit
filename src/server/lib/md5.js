var md5 = module.exports = function(tobeHash) {
  return crypto.createHash('md5').update(tobeHash).digest('hex')
}