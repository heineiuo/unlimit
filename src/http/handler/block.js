/**
 * 黑名单域名
 */
const handleBLOCK = (res, host)=>{
  res.redirect(`https://www.google.com/s?q=${host} is dangerous.`)
};

export default handleBLOCK;
