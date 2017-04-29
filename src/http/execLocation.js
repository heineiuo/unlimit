
import handleHTML from "./handler/html"
import handleBLOCK from "./handler/block"
import handleFILE from "./handler/file"
import handleREDIRECT from "./handler/redirect"
import handleDOWNLOAD from "./handler/download"
import handleUPLOAD from "./handler/upload"
import proxyHTTP from './handler/proxyHTTP'

export default (getSeashell) => async (req, res, next) => {

  try {

    const seashell = await getSeashell();
    const {location, location: {type, content}, url, driveId} = res.locals;

    const handles = {
      JSON: () => new Promise((resolve, reject) => {
        try {
          res.json(location.content);
          resolve()
        } catch (e) {
          reject(e)
        }
      }),
      HTML: () => handleHTML(req, res, content),
      BLOCK: () => handleBLOCK(req, res, content),
      FILE: () => handleFILE(req, res, seashell, driveId, url.pathname, req.path),
      REDIRECT: () => handleREDIRECT(req, res, content),
      DOWNLOAD: () => handleDOWNLOAD(req, res, req.query.path),
      UPLOAD: () => handleUPLOAD(req, res, seashell, content),
    };

    /**
     * 未定义的type类型, 报非法请求错误
     */
    if (!handles.hasOwnProperty(type)) return next(new Error('ILLEGAL_HTTP_REQUEST'))

    await handles[type]();

  } catch(e){
    if (e.message === 'USE_PROXY') return proxyHTTP(req, res, next);
    next(e)
  }
}
