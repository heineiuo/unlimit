
import {connect, bindActionCreators} from 'action-creator'
import Joi from 'joi'
import ent from 'ent'



/**
 * @api {POST} /location/updatesort 修改排序
 * @apiGroup Location
 * @apiName LocationUpdateSort
 * @apiParam {string} token 令牌
 * @apiParam {string} hostname
 * @apiParam {string} pathname
 * @apiParam {number} nextSort
 * @apiSuccess {number} success
 */
const UpdateSort = (query) => (ctx) => new Promise(async (resolve, reject) => {
  try {
    const validate = Joi.validate(query, Joi.object().keys({
      hostname: Joi.string().required(),
      pathname: Joi.string().required(),
      nextSort: Joi.number().required()
    }), {allowUnknown: true});
    if (validate.error) return reject(validate.error);

    const db = ctx.db.location;
    const {nextSort, pathname, hostname} = query;
    if (nextSort < 1) return reject('PARAMS_ILLEGAL');
    const location = await db.get(hostname);
    const targetPath = location.locations[pathname];
    const prevSort = targetPath.sort;
    if (nextSort == prevSort) return reject(new Error('NOT_CHANGED'));
    const beBigger = nextSort > prevSort;
    if (nextSort > Object.keys(location.locations).length) return reject(new Error('PARAMS_ILLEGAL'));

    location.locations[pathname].sort = nextSort;
    Object.values(location.locations).forEach(item => {
      /**
       * 变大的话, 比之前大的和比现在小的都要变小, 包括目标sort
       * 变小的话, 比之前小的和比现在大的都要变大, 包括目标sort
       */
      if (item.pathname == pathname) return false;
      if (beBigger  && item.sort > prevSort && item.sort <= nextSort) {
        return location.locations[item.pathname].sort --;
      }
      if (!beBigger && item.sort >= nextSort && item.sort < prevSort) {
        return location.locations[item.pathname].sort ++;
      }
    });
    await db.put(hostname, location);
    resolve({success: 1});
  } catch(e){
    reject(e);
  }

});

export default module.exports = UpdateSort;