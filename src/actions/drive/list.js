import Joi from 'joi'

/**
 * @api {POST} /host/list 获取域名列表
 * @apiGroup Host
 * @apiName HostList
 * @apiParam {number} limit 个数限制
 * @apiSuccess {string} list
 */
export default (query) => (dispatch, getCtx) => new Promise(async(resolve, reject) => {
  try {
    const db = getCtx().leveldb.sub('location');
    const {userId} = getCtx().request.headers.session;
    const list = [];
    db.createReadStream()
      .on('data', (item) => {
        if (item.value.users.includes(userId)){
          list.push({driveId: item.key, ...item.value})
        }
      })
      .on('end', () => {
        resolve({list})
      });
  } catch (e) {
    reject(e)
  }
});
