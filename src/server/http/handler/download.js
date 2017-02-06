/**
 * 下载文件
 *
 */
const downloadHandle = function (req, res, next) {

  const {location, url, host} = res.locals;
  if (location.type.toUpperCase() != 'DOWNLOAD') return next(new Error('NOT_UPLOAD'));

  if (typeof req.query.path == 'undefined') return next(new Error('PARAMS_LOST'));
  const rawPath = decodeURI(req.query.path);
  const result = {path: rawPath};
  const truePath = rawPath;
  res.download(truePath);
};

module.exports = downloadHandle;