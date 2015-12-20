function md5(tobeHash) {
  return crypto.createHash('md5').update(tobeHash).digest('hex')
}