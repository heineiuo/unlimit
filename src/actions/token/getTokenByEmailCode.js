
import getUserIdWithUpset from '../email/getUserIdWithUpset'
import checkCode from '../emailcode/checkCode'
import createToken from './createToken'

/**
 * @api {POST} /account2/token/gettokenbyemailcode 根据email验证码获取token
 * @apiName TokenByEmailCode
 * @apiGroup Account
 * @apiParam {string} code
 * @apiParam {string} email
 * @apiSuccess {string} token
 */
const getTokenByEmailCode = (query) => (dispatch, getCtx) => new Promise(async(resolve, reject) => {
  try {
    const {code, email} = query;
    await dispatch(checkCode)({email, code});
    const userId = await dispatch(getUserIdWithUpset)({email});
    const token = await dispatch(createToken)({userId});
    resolve(token)

  } catch(e) {
    reject(e)
  }

});

export default module.exports = getTokenByEmailCode