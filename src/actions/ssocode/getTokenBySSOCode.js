
/**
 * @api {POST} /account2/token/gettokenbyssocode 根据ssocode获取token
 * @apiName TokenBySSOCode
 * @apiGroup Account
 * @apiParam {string} code code
 * @apiSuccess {string} token token
 */
const getTokenBySSOCode = ({code}) => (ctx, getAction) => new Promise(async(resolve, reject) => {
  try {
    const SSOCode = ctx.db.sub('ssocode');
    const result = await SSOCode.get(code);
    resolve({token: result.token});
  } catch(e){
    reject(e)
  }
});

export default module.exports = getTokenBySSOCode