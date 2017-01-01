import path from 'path'
import config from '../../utils/config'

/**
 * 文件下载代理
 */
const handleFILE = async (req, res, next) => {
  try {
    const {location, host, url} = res.locals;
    if (location.type.toUpperCase() != 'FILE') return next();
    // const baseDir = location.content;
    const baseDir = `${config.datadir}/app/${host.hostname}/public`;
    const filePath = path.join(baseDir, url.pathname);

    if (config.debug) console.log(filePath);
    return res.sendFile(filePath, {
      CacheControl: true,
      "maxAge": 31536000000,
      headers: {
        // "Access-Control-Allow-Origin": "*",
        "Expires": new Date(Date.now() + 31536000000)
      }
    },  (err) => {
      if (err && !res.headersSent) {
        const lastParam = url.pathname.split('/').pop();
        if (lastParam.length && !/\./.test(lastParam))
          return res.redirect(req.path+'/');
        next('NOT_FOUND')
      }
    })
  } catch(e){
    next(e)
  }
};

module.exports = handleFILE;