
import getUserIdByEmail from './getUserIdByEmail'
import checkCode from './checkVerificationCode'
import createToken from './createToken'

/**
 * @api {POST} /account2/token/gettokenbyemailcode 根据email验证码获取token
 * @apiName TokenByEmailCode
 * @apiGroup Account
 * @apiParam {string} code
 * @apiParam {string} email
 * @apiSuccess {string} token
 */
export default (query) => (dispatch, getCtx) => new Promise(async(resolve, reject) => {
  try {
    const {code, email} = query;
    await dispatch(checkCode({email, code}));
    const {userId} = await dispatch(getUserIdByEmail({email, upset: true}));
    resolve(await dispatch(createToken({userId})))
  } catch(e) {
    reject(e)
  }
});