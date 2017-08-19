/**
 * 下载文件
 * @param req
 * @param res
 * @param path (req.query.path)
 */
export default query => (dispatch, getState) => new Promise((resolve, reject) => {
  const { req, res, path } = query
  if (typeof path === 'undefined') {
    const error = new Error('Params lost')
    error.name = 'ValidationError'
    return reject(error)
  }
  const rawPath = decodeURI(path)
  res.download(rawPath)
  resolve()
})

