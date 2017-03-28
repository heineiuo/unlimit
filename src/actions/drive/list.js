import Joi from 'joi'

/**
 * @api {POST} /host/list 获取域名列表
 * @apiGroup Host
 * @apiName HostList
 * @apiParam {number} limit 个数限制
 * @apiSuccess {string} list
 */
const list = (query) => (ctx) => new Promise(async(resolve, reject) => {
  try {
    const db = ctx.db.sub('location');
    const list = [];
    db.createReadStream()
      .on('data', (item) => {
        list.push(item.value)
      })
      .on('end', () => {
        resolve({list})
      });
  } catch (e) {
    reject(e)
  }
});

export default module.exports = list;