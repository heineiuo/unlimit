import path from 'path'

/**
 * 文件下载代理
 */
const handleFILE = (res, hostname, pathname, datadir, reqpath) => new Promise((resolve, reject) => {

  try {
    const baseDir = `${datadir}/app/${hostname}/public`;
    const filePath = path.join(baseDir, pathname);

    res.sendFile(filePath, {
      CacheControl: true,
      "maxAge": 31536000000,
      headers: {
        // "Access-Control-Allow-Origin": "*",
        "Expires": new Date(Date.now() + 31536000000)
      }
    }, (err) => {
      if (!err) return resolve();
      const lastParam = pathname.split('/').pop();
      if (lastParam.length && !/\./.test(lastParam)) {
        res.redirect(reqpath + '/');
      } else {
        reject(new Error('NOT_FOUND'))
      }
    });

  } catch(e){
    reject(e)
  }
});

export default handleFILE;