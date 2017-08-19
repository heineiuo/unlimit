
import handleHTML from "./html"
import handleBLOCK from "./block"
import handleFILE from "./file"
import handleREDIRECT from "./redirect"
import handleDOWNLOAD from "./download"
import handleUPLOAD from "./upload"
import proxyHTTP from './proxyHTTP'

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
      PROXY: () => handleREDIRECT(req, res, content),
      DOWNLOAD: () => handleDOWNLOAD(req, res, req.query.path),
      UPLOAD: () => handleUPLOAD(req, res, seashell, content),
      PROXY: () => proxyHTTP(req, res, next)
    };

    /**
     * 未定义的type类型, 报非法请求错误
     */
    if (!handles.hasOwnProperty(type)) {
      const error = new Error('Illegal http request')
      error.name = 'ForbiddenError'
      return next(error)
    }

    await handles[type]();

  } catch(e){
    next(e)
  }
}
