/**
 * 下载文件
 * @param req
 * @param res
 * @param path (req.query.path)
 */
export default (req, res, path) => new Promise((resolve, reject) => {
  if (typeof path === 'undefined') return reject(new Error('PARAMS_LOST'));
  const rawPath = decodeURI(path);
  // const result = {path: rawPath};
  // const truePath = rawPath;
  res.download(rawPath);
  resolve();
});

