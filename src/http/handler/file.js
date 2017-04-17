/**
 * 文件下载代理
 */
const handleFILE = (req, res, seashell, driveId, pathname, reqpath) => new Promise(async (resolve, reject) => {

  let result = {body: {}};
  try {
    result = await seashell.requestSelf({
      headers: {originUrl: '/fs/queryFileContent'},
      body: {fullPath: `/${driveId}${reqpath}`}
    });
  } catch (e) {
    result.body.error = e;
  }
  if (result.body.error) return reject(new Error('NOT_FOUND'));
  res.setHeader('CacheControl', true);
  res.setHeader('maxAge', 31536000000);
  res.setHeader('Expires', new Date(Date.now() + 31536000000));
  res.write(result.body.cat);
  res.end();

});

export default handleFILE;