
/**
 * SDK
 * @provideModule SDK
 */

import { POSTUrlencodeJSON, Mock, Urlencode } from 'fetch-tools'

export const MOCK_JSON_PATH = '/mock';
export const API_HOST = 'https://www.youkuohao.com/api';
export const MOCK = false;
export const SECRET = 'secret';
export const signature = (params) => params;


/**
 * @api {POST} /account/emailcode/createlogincode 获取登录验证码
 * @apiGroup Account
 * @apiName EmailCodeForLogin
 * @apiParam {string} email 邮箱
 */
export const EmailCodeForLogin = (options) => {
  const url = `${API_HOST}/account/emailcode/createlogincode`;
  return POSTUrlencodeJSON(MOCK?`${MOCK_JSON_PATH}/EmailCodeForLogin.json`:url, 
    signature(options)
  )
};

/**
 * @api {POST} /account/token/logout 注销token
 * @apiName Logout
 * @apiGroup Account
 * @apiParam {string} token token
 */
export const Logout = (options) => {
  const url = `${API_HOST}/account/token/logout`;
  return POSTUrlencodeJSON(MOCK?`${MOCK_JSON_PATH}/Logout.json`:url, 
    signature(options)
  )
};

/**
 * @api {POST} /account/ssocode/get 获取ssocode
 * @apiName SSOCodeGet
 * @apiGroup Account
 * @apiParam {string} token
 * @apiSuccess {string} code
 */
export const SSOCodeGet = (options) => {
  const url = `${API_HOST}/account/ssocode/get`;
  return POSTUrlencodeJSON(MOCK?`${MOCK_JSON_PATH}/SSOCodeGet.json`:url, 
    signature(options)
  )
};



/**
 * @api {POST} /account/session 获取session信息
 * @apiName Session
 * @apiGroup Account
 * @apiDescription 获取session信息
 * @apiParam {string} token 令牌
 * @apiSuccess {object} user
 */
export const Session = (options) => {
  const url = `${API_HOST}/account/session`;
  return POSTUrlencodeJSON(MOCK?`${MOCK_JSON_PATH}/Session.json`:url, 
    signature(options)
  )
};

/**
 * @api {POST} /account/token/gettokenbyemailcode 根据email验证码获取token
 * @apiName TokenByEmailCode
 * @apiGroup Account
 * @apiParam {string} code
 * @apiParam {string} email
 * @apiSuccess {string} token
 */
export const TokenByEmailCode = (options) => {
  const url = `${API_HOST}/account/token/gettokenbyemailcode`;
  return POSTUrlencodeJSON(MOCK?`${MOCK_JSON_PATH}/TokenByEmailCode.json`:url, 
    signature(options)
  )
};

/**
 * @api {POST} /account/token/gettokenbyssocode 根据ssocode获取token
 * @apiName TokenBySSOCode
 * @apiGroup Account
 * @apiParam {string} code code
 * @apiSuccess {string} token token
 */
export const TokenBySSOCode = (options) => {
  const url = `${API_HOST}/account/token/gettokenbyssocode`;
  return POSTUrlencodeJSON(MOCK?`${MOCK_JSON_PATH}/TokenBySSOCode.json`:url, 
    signature(options)
  )
};

/**
 * @api {POST} /account/user/userlist 获取用户列表
 * @apiName UserList
 * @apiGroup Account
 * @apiParam {string} model model名, user
 */
export const UserList = (options) => {
  const url = `${API_HOST}/account/user/userlist`;
  return POSTUrlencodeJSON(MOCK?`${MOCK_JSON_PATH}/UserList.json`:url, 
    signature(options)
  )
};

