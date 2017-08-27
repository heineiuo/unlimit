import path from 'path'

export default query => (dispatch, getState) => new Promise(async (resolve, reject) => {
  try {
    const { rootDir } = query
    const { DATA_DIR } = process.env
    const { response: res, request: req } = getState()
    const resolvedRootDir = path.resolve(DATA_DIR, rootDir)
  
    res.set('CacheControl', true)
    res.set('maxAge', 31536000000)
    res.set('Expires', new Date(Date.now() + 31536000000))
    const resolvedFullPath = path.join(resolvedRootDir, req.path)
    res.sendFile(resolvedFullPath, (err) => {
      if (!err) return resolve()
      if (err.message.indexOf('ENOENT') === 0) {
        res.sendStatus(404)
        return resolve()
      }
      if (err.message.indexOf('EISDIR') === 0) {
        return res.sendFile(path.resolve(resolvedFullPath, './index.html'), (err) => {
          if (!err) return resolve()
          if (err.message.indexOf('ENOENT') === 0) {
            res.sendStatus(404)
            return resolve()
          }
          return reject(err)
        })
      }
      return reject(err)
    })
  } catch(e){
    reject(e)
  }
  

})
