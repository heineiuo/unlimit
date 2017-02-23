import handleHTML from './html'
import handlePROXY from './proxy'
import handleBLOCK from './block'
import handleFILE from './file'
import handleREDIRECT from './redirect'
import handleDOWNLOAD from './download'
import handleUPLOAD from './upload'

module.exports = (config) => async (req, res, next) => {

  try {

    const {host, url, location, location: {type, content}} = res.locals;
    const handles = {
      JSON: () => new Promise((resolve, reject) => {
        try {
          res.json(location.content);
          resolve()
        } catch(e){
          reject(e)
        }
      }),
      HTML: () => handleHTML(res, content),
      PROXY: () => handlePROXY(req, res, next),
      BLOCK: () => handleBLOCK(res, content),
      FILE: () => handleFILE(res, host.hostname, url.pathname, config.datadir, req.path),
      REDIRECT: () => handleREDIRECT(res, content),
      DOWNLOAD: () => handleDOWNLOAD(res, req.query.path),
      UPLOAD: () => handleUPLOAD(req, res, content),
    };

    if (handles.hasOwnProperty(type)) return await handles[type]();

    /**
     * 未定义的type类型
     */
    next(new Error('ILLEGAL_HTTP_REQUEST'))

  } catch(e){
    next(e)
  }

};
