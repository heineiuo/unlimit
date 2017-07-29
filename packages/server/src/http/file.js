import CustomError from '../CustomError'

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

  try {
    if (result.body.error) {
      const error = new Error(result.body.message)
      error.name = result.body.name || 'ExceptionError'
      return reject(error)
    }
    res.setHeader('CacheControl', true);
    res.setHeader('maxAge', 31536000000);
    res.setHeader('Expires', new Date(Date.now() + 31536000000));
    res.write(new Buffer(result.body.cat));
    res.end();
    resolve()
  } catch(e){
    reject(e)
  }

});

export default handleFILE;
