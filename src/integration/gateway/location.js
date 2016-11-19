/**
 * Copyright heineiuo@gmail.com
 */

import {Model} from '../../spruce'
import Joi from 'joi'
import ent from 'ent'
import Host from './host'
import config from '../../utils/config'
import awaitify from '../../utils/awaitify'

const Location = new Model('Location', {
  pathname: String,
  cors: Boolean,
  sort: Number,
  type: String,
  contentType: String,
  content: String
});

/**
 * @api {POST} /Location/delete 删除一个location
 * @apiGroup Location
 * @apiName LocationDelete
 * @apiParam {string} token 令牌
 * @apiParam {string} hostname
 * @apiParam {string} pathname
 */
Location.statics.delete = (query, ctx) => new Promise(async (resolve, reject) => {
  try {
    await awaitify(Joi.validate)(query, Joi.object().keys({
      hostname: Joi.string().required(),
      pathname: Joi.string().required()
    }), {allowUnknown: true});
    const {hostname, pathname} = query;
    const location = await Location.get(hostname);
    delete location.locations[pathname];
    await Location.put(hostname, location);
    resolve({})
  } catch(e){
    reject(e)
  }
});


/**
 * @api {POST} /Location/edit 更新已有的记录
 * @apiGroup Location
 * @apiName LocationEdit
 * @apiParam {string} token 令牌
 * @apiParam {string} hostname
 * @apiParam {string} pathname
 * @apiParam {boolean} cors
 * @apiParam {string} type
 * @apiParam {string} contentType
 * @apiParam {string} content
 * @apiSuccess {number} success
 */
Location.statics.edit = (query, ctx) => new Promise(async (resolve, reject) => {
  try {
    await awaitify(Joi.validate)(query, Joi.object().keys({
      hostname: Joi.string().required(),
      pathname: Joi.string().required(),
      cors: Joi.boolean(),
      type: Joi.string(),
      contentType: Joi.string(),
      content: Joi.string(),
    }), {allowUnknown: true});

    const {cors, hostname, type, content, contentType, pathname} = query;
    const nextContent = (type == 'html' && contentType == 'text')?ent.encode(content):content;

    const location = await Location.get(hostname);
    location.locations[pathname] = {
      pathname,
      cors,
      sort: location.locations[pathname].sort,
      type,
      contentType,
      content: nextContent
    };
    await Location.put(hostname, location);
    resolve({success:1});
  } catch(e){
    reject(e)
  }

});


/**
 * @api {POST} /location/list 获取location列表
 * @apiGroup Location
 * @apiName LocationList
 * @apiParam {string} token 令牌
 * @apiParam {string} hostname
 * @apiSuccess {object} host
 * @apiSuccess {object} location
 */
Location.statics.list = (query, ctx) => new Promise(async (resolve, reject) => {

  try {
    await awaitify(Joi.validate)(query, Joi.object().keys({
      hostname: Joi.string().required()
    }), {allowUnknown: true});
    const {hostname} = query;
    const host = await Host.Get(hostname);
    const location = await Location.get(hostname);
    resolve({host, location})
  } catch(e){
    reject(e)
  }

});




/**
 * @api {POST} /location/new 创建一条location记录
 * @apiGroup Location
 * @apiName LocationNew
 * @apiParam {string} token 令牌
 * @apiParam {string} hostname
 * @apiParam {string} pathname
 * @apiParam {boolean} cors
 * @apiParam {string} type
 * @apiParam {string} [contentType]
 * @apiParam {string} content
 */
Location.statics.new = (query, ctx) => new Promise(async (resolve, reject) => {
  try {
    await awaitify(Joi.validate)(query, Joi.object().keys({
      hostname: Joi.string().required(),
      pathname: Joi.string().required(),
      cors: Joi.boolean(),
      type: Joi.string().required(),
      contentType: Joi.string(),
      content: Joi.string().required()
    }), {allowUnknown: true});

    const {hostname, type, cors=false, pathname, contentType='text'} = query;
    await Host.Get(hostname);
    const content = type == 'html'? ent.encode(query.content) :query.content;
    const location = await Location.get(hostname);
    const nextLocation = {
      pathname,
      cors,
      sort: Object.keys(location.locations).length + 1,
      type,
      contentType,
      content,
    }
    location.locations[pathname] = nextLocation;
    await Location.put(hostname, location);
    resolve({nextLocation})
  } catch(e){
    if (config.debug) console.log(e.stack||e);
    reject(e);
  }
});



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
Location.statics.UpdateSort = (query, ctx) => new Promise(async (resolve, reject) => {
  try {
    await awaitify(Joi.validate)(query, Joi.object().keys({
      hostname: Joi.string().required(),
      pathname: Joi.string().required(),
      nextSort: Joi.number().required()
    }), {allowUnknown: true});
    const {nextSort, pathname, hostname} = query;
    if (nextSort < 1) return reject('PARAMS_ILLEGAL');
    const location = await Location.get(hostname);
    const targetPath = location.locations[pathname];
    const prevSort = targetPath.sort;
    if (nextSort == prevSort) return reject('NOT_CHANGED');
    const beBigger = nextSort > prevSort;
    if (nextSort > Object.keys(location.locations).length) return reject('PARAMS_ILLEGAL');

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
    await Location.put(hostname, location);
    resolve({success: 1});
  } catch(e){
    reject(e);
  }

});


/**
 * @api {POST} /location/batch 批量设置
 * @apiGroup Location
 * @apiName LocationBatch
 * @apiParam {string} token 令牌
 * @apiParam {string} hostname
 * @apiParam {string} locations
 * @apiSuccess {number} success
 */
Location.statics.batch = (query, ctx) => new Promise(async (resolve, reject) => {
  try {

    await awaitify(Joi.validate)(query, Joi.object().keys({
      hostname: Joi.string().required(),
      locations: Joi.object().required()
    }), {allowUnknown: true});
    const {hostname, locations} = query;
    await Host.get(hostname);
    const location = await Location.get(hostname);
    location.locations = locations;
    await Location.put(hostname, location);
    resolve({})
  } catch(e){
    reject(e)
  }
});

export default module.exports = Location