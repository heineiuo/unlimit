export const setHeader = () => (dispatch, getState) => new Promise((resolve, reject) => {
  const { response: res } = getState()
  if (location['X-Frame-Options']) {
    res.set('X-Frame-Options', location['X-Frame-Options'])
  }
  resolve()
})

export const removeHeader = () => (dispatch, getState) => new Promise((resolve, reject) => {
  const { response: res } = getState()
  res.removeHeader("x-powered-by")
  resolve()
})

export const cors = (makeCors) => (dispatch, getState) => new Promise((resolve, reject) => {
  const { response: res, request: req } = getState()
  res.set('Access-Control-Expose-Headers', '*')
  // IE8 does not allow domains to be specified, just the *
  // headers["Access-Control-Allow-Origin"] = req.headers.origin
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Headers', 'X-PINGOTHER, Content-Type, X-Requested-With')
  res.set('Access-Control-Allow-Methods', '*')
  if (req.method === 'OPTIONS') {
    res.set("Access-Control-Max-Age", '86400')
  }
  resolve()
})
