/**
 * 黑名单域名
 */
export default query => (dispatch, getState) => new Promise((resolve, reject) => {
  const { host } = query
  const { response: res } = getState()
  res.redirect(`https://www.google.com/s?q=${host} is dangerous.`)
  resolve()
})
