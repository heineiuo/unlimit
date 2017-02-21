import path from 'path'

/**
 * 文件下载代理
 */
const handleFILE = async (res, hostname, pathname, datadir, reqpath) => {
  const baseDir = `${datadir}/app/${hostname}/public`;
  const filePath = path.join(baseDir, pathname);

  return res.sendFile(filePath, {
    CacheControl: true,
    "maxAge": 31536000000,
    headers: {
      // "Access-Control-Allow-Origin": "*",
      "Expires": new Date(Date.now() + 31536000000)
    }
  },  (err) => {
    if (err && !res.headersSent) {
      const lastParam = pathname.split('/').pop();
      if (lastParam.length && !/\./.test(lastParam))
        return res.redirect(reqpath+'/');
      next(new Error('NOT_FOUND'))
    }
  })
};

export default handleFILE;