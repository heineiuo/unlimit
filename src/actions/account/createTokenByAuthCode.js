/**
 * @public
 */

/**
 * @api {POST} /account/createTokenByAuthCode 根据AuthCode获取token
 * @apiName TokenBySSOCode
 * @apiGroup Account
 * @apiParam {string} code code
 * @apiSuccess {string} token token
 */
export default ({code}) => (dispatch, getCtx) => new Promise(async(resolve, reject) => {
  try {
    const SSOCode = getCtx().leveldb.sub('ssocode');
    const result = await SSOCode.get(code);
    resolve({token: result.token});
  } catch(e){
    reject(e)
  }
});

