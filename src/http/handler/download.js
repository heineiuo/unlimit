/**
 * 下载文件
 * @param res
 * @param path (req.query.path)
 */
const downloadHandle = function (res, path) {

  if (typeof path == 'undefined') throw new Error('PARAMS_LOST');
  const rawPath = decodeURI(path);
  const result = {path: rawPath};
  const truePath = rawPath;
  res.download(truePath);
};

export default downloadHandle;