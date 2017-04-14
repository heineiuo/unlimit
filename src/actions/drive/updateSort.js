
import Joi from 'joi'


/**
 * @api {POST} /drive/updatesort 修改排序
 * @apiGroup Location
 * @apiName LocationUpdateSort
 * @apiParam {string} token 令牌
 * @apiParam {string} driveId
 * @apiParam {string} pathname
 * @apiParam {number} nextSort
 * @apiSuccess {number} success
 */
export default (query) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {
    const validated = Joi.validate(query, Joi.object().keys({
      driveId: Joi.string().required(),
      pathname: Joi.string().required(),
      nextSort: Joi.number().required()
    }), {allowUnknown: true});
    if (validated.error) return reject(validated.error);

    const db = getCtx().leveldb.sub('location');
    const {nextSort, pathname, driveId} = validated.value;
    if (nextSort < 1) return reject('PARAMS_ILLEGAL');
    const location = await db.get(driveId);
    const targetPath = location.locations[pathname];
    const prevSort = targetPath.sort;
    if (nextSort === prevSort) return reject(new Error('NOT_CHANGED'));
    const beBigger = nextSort > prevSort;
    if (nextSort > Object.keys(location.locations).length) return reject(new Error('PARAMS_ILLEGAL'));

    location.locations[pathname].sort = nextSort;
    Object.values(location.locations).forEach(item => {
      /**
       * 变大的话, 比之前大的和比现在小的都要变小, 包括目标sort
       * 变小的话, 比之前小的和比现在大的都要变大, 包括目标sort
       */
      if (item.pathname === pathname) return false;
      if (beBigger  && item.sort > prevSort && item.sort <= nextSort) {
        return location.locations[item.pathname].sort --;
      }
      if (!beBigger && item.sort >= nextSort && item.sort < prevSort) {
        return location.locations[item.pathname].sort ++;
      }
    });
    await db.put(driveId, location);
    resolve({success: 1});
  } catch(e){
    reject(e);
  }

});
