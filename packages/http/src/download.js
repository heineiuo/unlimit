/**
 * 下载文件
 * @param req
 * @param res
 * @param path (req.query.path)
 */
export default (req, res, path) => new Promise((resolve, reject) => {
  if (typeof path === 'undefined') {
    const error = new Error('Params lost')
    error.name = 'ValidationError'
    return reject(error)
  }
  const rawPath = decodeURI(path);
  // const result = {path: rawPath};
  // const truePath = rawPath;
  res.download(rawPath);
  resolve();
});

