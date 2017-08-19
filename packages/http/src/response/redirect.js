/**
 * 重定向
 */
export default (req, res, content) => new Promise((resolve, reject) => {
  res.redirect(content)
  resolve()
})
