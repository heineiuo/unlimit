/**
 * 重定向
 */
export default url => (getState) => new Promise((resolve, reject) => {
  const { response: res } = getState()
  res.redirect(url)
  resolve()
})
