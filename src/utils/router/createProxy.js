/**
 * Copyright 2016 Hansel <heineiuo@gmail.com>
 * @provideModule middleware for express
 */

const createProxy = (router) => {
  return (req, res) => new Promise(async (resolve, reject) => {
    const {handleLoop} = router;

    res.end = () => resolve(res);

    const next = (err, req, res, index, pathname) => {
      return handleLoop(err, req, res, next, index, pathname)
    };
    next(null, req, res, 0, req.headers.originalUrl)
  })
};


const handleRequest = async ( req, original) => {
  const {handleLoop} = router;
  console.log(`[seashell] handle request: ${JSON.stringify(req)}`)
  Object.assign(req, {params: {}})
  const res = {
    headers: {
      appId: req.headers.appId,
      callbackId: req.headers.callbackId
    },
    body: {},
    end: () => {
      if (res.headers.__type == 'html') return original.res.end(res.body.__html)
      if (res.headers.__type == 'json') return original.res.json(res.body)
      original.res.json(res.body)
    },
    json: (data) => {
      res.headers.__type = 'json'
      res.body = data
      res.end()
    },
    render: (string) => {
      res.headers.__type = 'html'
      res.body.__html = string
      res.end()
    }
  };
  const next = (err, req, res, index, pathname) => {
    return handleLoop(err, req, res, next, index, pathname)
  };
  next(null, req, res, 0, req.headers.originUrl)
};

const createProxyMiddleware = () => {
  return (req, res, next) => {
    const original = {
      req: req,
      res: res,
      next: next
    };
    const seaReq = {
      headers: {
        originUrl: req.path
      },
      body: Object.assign({}, req.query, req.body)
    };
    handleRequest(seaReq, original)
  }
};

export default { createProxy, createProxyMiddleware }
