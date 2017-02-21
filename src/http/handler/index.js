import handleHTML from './html'
import handlePROXY from './proxy'
import handleBLOCK from './block'
import handleFILE from './file'
import handleREDIRECT from './redirect'
import handleDOWNLOAD from './download'

module.exports = (config) => (req, res, next) => {

  try {

    const {host, url, location, location: {type, content}} = res.locals;

    if (type == 'JSON') {
      return res.json(JSON.parse(location.content))
    }

    if (type == 'HTML') {
      return handleHTML(res, content)
    }

    if (type == 'PROXY') {
      return handlePROXY(req, res, next)
    }

    if (type == 'BLOCK') {
      return handleBLOCK(res, content)
    }

    if (type == 'FILE') {
      return handleFILE(res, host.hostname, url.pathname, config.datadir, req.path)
    }

    if (type == 'REDIRECT') {
      return handleREDIRECT(res, content)
    }

    if (type == 'DOWNLOAD') {
      return handleDOWNLOAD(res, req.query.path)
    }

    /**
     * 未定义的type类型
     */
    throw new Error('ILLEGAL_HTTP_REQUEST')

  } catch(e){
    next(e)
  }

};
