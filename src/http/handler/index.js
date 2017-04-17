import handleHTML from "./html"
import handleBLOCK from "./block"
import handleFILE from "./file"
import handleREDIRECT from "./redirect"
import handleDOWNLOAD from "./download"
import handleUPLOAD from "./upload"

const handler = (seashell) => async (req, res, next) => {
  const {host, driveId, url, location, location: {type, content}} = res.locals;
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

  if (!handles.hasOwnProperty(type)) {
    /**
     * 未定义的type类型
     */
    return next(new Error('ILLEGAL_HTTP_REQUEST'))
  }

  try {
    await handles[type]();
  } catch (e) {
    if (e.message === 'USE_PROXY') return next();
    next(e)
  }
};

export {
  handler
}
