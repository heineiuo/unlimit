/**
 * 检查验证码
 */
const checkVerificationCode = (query) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {
    const db = getCtx().leveldb.sub('emailcode');
    const {email, code} = query;
    const result = await db.get(email);
    if (result.code !== code) return reject(new Error('ILLEGAL_CODE'));
    if (Date.now() > result.createTime + 6000 * 3) return reject(new Error('EXPIRE_CODE'));
    await db.del(email);
    resolve(true)
  } catch(e){
    if (e.name === 'NotFoundError') return reject(new Error('ILLEGAL_CODE'));
    reject(e)
  }
});

export default module.exports = checkVerificationCode