/* @public */
import Joi from 'joi'

/**
 * @api {POST} /account2/session 获取session信息
 * @apiName Session
 * @apiGroup Account
 * @apiDescription 获取session信息
 * @apiParam {string} token 令牌
 * @apiSuccess {object} user
 */
export default query => (dispatch, getCtx) => new Promise(async(resolve, reject) => {
  return resolve(getCtx().request.headers.session)

});

