/**
 * 黑名单域名
 */
export default (req, res, host) => new Promise((resolve, reject) => {
  res.redirect(`https://www.google.com/s?q=${host} is dangerous.`);
  resolve()
});
