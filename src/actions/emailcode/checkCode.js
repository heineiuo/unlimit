/**
 * 检查code
 */
const checkCode = (query) => (ctx, getAction) => new Promise(async (resolve, reject) => {
  try {
    const db = ctx.db.emailcode;
    const {email, code} = query;
    const result = await db.get(email);
    if (result.code != code) return reject(new Error('ILLEGAL_CODE'));
    if (result.createTime + 6000 * 3 > Date.now()) return reject(new Error('EXPIRE_CODE'));
    await db.del(email);
    resolve(true)
  } catch(e){
    if (e.name == 'NotFoundError') return reject(new Error('ILLEGAL_CODE'));
    reject(e)
  }
});

export default module.exports = checkCode