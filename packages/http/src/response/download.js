/**
 * 下载文件
 * @param req
 * @param res
 * @param path (req.query.path)
 */
export default query => (dispatch, getState) => new Promise((resolve, reject) => {
  const { filepath } = query
  const { response: res } = getState()
  if (typeof filepath === 'undefined') {
    const error = new Error('Params lost')
    error.name = 'ValidationError'
    return reject(error)
  }
  const rawPath = decodeURI(filepath)
  res.download(rawPath)
  resolve()
})

