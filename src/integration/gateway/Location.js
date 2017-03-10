
import {Model} from 'sprucejs'
import Joi from 'joi'
import ent from 'ent'
import config from '../../utils/config'

class Location extends Model {

  static valueTypes = {
    pathname: String,
    cors: Boolean,
    sort: Number,
    type: String,
    contentType: String,
    content: String
  };

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
  New = (req) => new Promise(async (resolve, reject) => {
    try {
      Joi.validate(req, Joi.object().keys({
        hostname: Joi.string().required(),
        pathname: Joi.string().required(),
        cors: Joi.boolean(),
        type: Joi.string().required(),
        contentType: Joi.string(),
        content: Joi.string().required()
      }), {allowUnknown: true});

      const {db, reducers} = this.props;
      const {hostname, type, cors=false, pathname, content, contentType='text'} = req;
      await reducers.Host.Get(hostname);
      const encodedContent = type == 'html'? ent.encode(content) :content;
      const location = await db.get(hostname);
      const nextLocation = {
        pathname,
        cors,
        sort: Object.keys(location.locations).length + 1,
        type,
        contentType,
        content: encodedContent,
      };

      location.locations[pathname] = nextLocation;
      await db.put(hostname, location);
      resolve({nextLocation})
    } catch(e){
      reject(e);
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
  list = (req) => new Promise(async (resolve, reject) => {

    try {
      Joi.validate(req, Joi.object().keys({
        hostname: Joi.string().required()
      }), {allowUnknown: true});

      const {db, reducers} = this.props;

      const {hostname} = req;
      const {Host} = this.props.reducers;
      const host = await Host.Get(hostname);
      const location = await db.get(hostname);
      // console.log('=================location============');
      // console.log(location);
      resolve({host, location, hostname})
    } catch(e){
      reject(e)
    }

  });

  commitLocations = (req) => new Promise(async (resolve, reject) => {
    try {
      Joi.validate(req, Joi.object().keys({
        hostname: Joi.string().required(),
        locations: Joi.array().required(),
      }), {allowUnknown: true});
      const {db, reducers} = this.props;
      const {locations, hostname} = req;
      const location = await db.get(hostname);
      location.hostname = hostname;
      location.locations = locations;
      await db.put(hostname, location);
      resolve({success:1});
    } catch(e){
      reject(e)
    }
  });

  edit = (req) => new Promise(async (resolve, reject) => {
    try {
      Joi.validate(req, Joi.object().keys({
        hostname: Joi.string().required(),
        pathname: Joi.string().required(),
        cors: Joi.boolean(),
        type: Joi.string(),
        contentType: Joi.string(),
        content: Joi.string(),
      }), {allowUnknown: true});

      const {db, reducers} = this.props;

      const {cors, hostname, type, content, contentType, pathname} = req;
      const nextContent = (type == 'html' && contentType == 'text')?ent.encode(content):content;

      const location = await db.get(hostname);
      location.locations[pathname] = {
        pathname,
        cors,
        sort: location.locations[pathname].sort,
        type,
        contentType,
        content: nextContent
      };
      await db.put(hostname, location);
      resolve({success:1});
    } catch(e){
      reject(e)
    }

  });


  /**
   * @api {POST} /Location/delete 删除一个location
   * @apiGroup Location
   * @apiName LocationDelete
   * @apiParam {string} token 令牌
   * @apiParam {string} hostname
   * @apiParam {string} pathname
   */
  Delete = (req) => new Promise(async (resolve, reject) => {
    try {
      Joi.validate(req, Joi.object().keys({
        hostname: Joi.string().required(),
        pathname: Joi.string().required()
      }), {allowUnknown: true});

      const {db, reducers} = this.props;

      const {hostname, pathname} = req;
      const location = await db.get(hostname);
      delete location.locations[pathname];
      await db.put(hostname, location);
      resolve({})
    } catch(e){
      reject(e)
    }
  });

  destroy = (hostname) => {
    const {db} = this.props;
    return db.del(hostname)
  };

  /**
   * @api {POST} /location/batch 批量设置
   * @apiGroup Location
   * @apiName LocationBatch
   * @apiParam {string} token 令牌
   * @apiParam {string} hostname
   * @apiParam {string} locations
   * @apiSuccess {number} success
   */
  batch = (req) => new Promise(async (resolve, reject) => {
    try {

      Joi.validate(req, Joi.object().keys({
        hostname: Joi.string().required(),
        locations: Joi.object().required()
      }), {allowUnknown: true});

      const {db, reducers} = this.props;

      const {hostname, locations, reset=false} = req;
      await reducers.Host.Get(hostname);
      if (reset) {
        await db.put(hostname, {hostname, locations});
      } else {
        const location = await db.get(hostname);
        location.locations = locations;
        await db.put(hostname, location);
      }
      resolve({})
    } catch(e){
      reject(e)
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
  UpdateSort = (req) => new Promise(async (resolve, reject) => {
    try {
      Joi.validate(req, Joi.object().keys({
        hostname: Joi.string().required(),
        pathname: Joi.string().required(),
        nextSort: Joi.number().required()
      }), {allowUnknown: true});

      const {db, reducers} = this.props;

      const {nextSort, pathname, hostname} = req;
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

  resolve (req) {
    const {action} = req;
    if (action == 'UpdateSort') return this.UpdateSort(req);
    if (action == 'batch') return this.batch(req);
    if (action == 'Delete') return this.Delete(req);
    if (action == 'edit') return this.edit(req);
    if (action == 'list') return this.list(req);
    if (action == 'commitLocations') return this.commitLocations(req);
    if (action == 'New') return this.New(req);
    return new Promise((resolve, reject) => reject(new Error('NOT_FOUND')))

  }

}

module.exports = Location;